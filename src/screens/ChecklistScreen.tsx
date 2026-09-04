import { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  PREGNANCY_CHECKLIST, BIRTH_CHECKLIST,
  PregnancyPeriod, BirthPeriod, ChecklistItem,
} from "../data/checklist";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Child { id: string; name: string; type: string; date: string; }
interface Todo { id: string; title: string; completed_at: string | null; created_at: string; }

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function fmt(date: Date) { return date.toISOString().split("T")[0]; }

function getPregnancyDates(dueDate: string, weekStart: number, weekEnd: number) {
  const lmp = new Date(dueDate);
  lmp.setDate(lmp.getDate() - 280);
  const start = new Date(lmp); start.setDate(start.getDate() + (weekStart - 1) * 7);
  const end = new Date(lmp); end.setDate(end.getDate() + weekEnd * 7 - 1);
  return { start: fmt(start), end: fmt(end) };
}

function getBirthDates(birthDate: string, monthStart: number, monthEnd: number) {
  const birth = new Date(birthDate);
  const start = addMonths(birth, monthStart);
  const end = addMonths(birth, monthEnd + 1);
  end.setDate(end.getDate() - 1);
  return { start: fmt(start), end: fmt(end) };
}

function getCurrentPregnancyPeriodKey(dueDate: string): string {
  const lmp = new Date(dueDate);
  lmp.setDate(lmp.getDate() - 280);
  const week = Math.floor((Date.now() - lmp.getTime()) / (86400000 * 7)) + 1;
  return PREGNANCY_CHECKLIST.find(p => week >= p.weekStart && week <= p.weekEnd)?.key ?? "";
}

function getCurrentBirthPeriodKey(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
  return BIRTH_CHECKLIST.find(p => months >= p.monthStart && months <= p.monthEnd)?.key ?? "";
}

export default function ChecklistScreen() {
  const navigation = useNavigation<Nav>();
  const { isLoggedIn } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [completions, setCompletions] = useState<Record<string, string>>({});
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn]));

  const fetchAll = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    const { data: children } = await supabase.from("children").select("*")
      .eq("user_id", user.id).order("created_at").limit(1);
    setChild(children?.[0] || null);

    const { data: comps } = await supabase.from("checklist_completions")
      .select("item_key, completed_at").eq("user_id", user.id);
    const map: Record<string, string> = {};
    (comps || []).forEach((c: any) => { map[c.item_key] = c.completed_at; });
    setCompletions(map);

    const { data: todoData } = await supabase.from("todos")
      .select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setTodos(todoData || []);

    setIsLoading(false);
  };

  const toggleItem = async (item: ChecklistItem) => {
    if (!child) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (completions[item.key]) {
      setCompletions(prev => { const n = { ...prev }; delete n[item.key]; return n; });
      await supabase.from("checklist_completions")
        .delete().eq("user_id", user.id).eq("child_id", child.id).eq("item_key", item.key);
    } else {
      const today = new Date().toISOString().split("T")[0];
      setCompletions(prev => ({ ...prev, [item.key]: today }));
      await supabase.from("checklist_completions").upsert({
        user_id: user.id, child_id: child.id,
        item_key: item.key, item_title: item.title, completed_at: today,
      }, { onConflict: "user_id,child_id,item_key" });
    }
  };

  const togglePeriod = async (items: ChecklistItem[]) => {
    if (!child) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const allDone = items.every(item => !!completions[item.key]);

    if (allDone) {
      const next = { ...completions };
      items.forEach(item => delete next[item.key]);
      setCompletions(next);
      for (const item of items) {
        await supabase.from("checklist_completions")
          .delete().eq("user_id", user.id).eq("child_id", child.id).eq("item_key", item.key);
      }
    } else {
      const next = { ...completions };
      const toInsert = items.filter(item => !next[item.key]);
      toInsert.forEach(item => { next[item.key] = today; });
      setCompletions(next);
      for (const item of toInsert) {
        await supabase.from("checklist_completions").upsert({
          user_id: user.id, child_id: child.id,
          item_key: item.key, item_title: item.title, completed_at: today,
        }, { onConflict: "user_id,child_id,item_key" });
      }
    }
  };

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return;
    setAddingTodo(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setAddingTodo(false); return; }
    const { data } = await supabase.from("todos").insert({
      user_id: user.id,
      title: newTodoTitle.trim(),
    }).select().single();
    if (data) setTodos(prev => [data, ...prev]);
    setNewTodoTitle("");
    setShowAddModal(false);
    setAddingTodo(false);
  };

  const toggleTodo = async (todo: Todo) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];
    const newDate = todo.completed_at ? null : today;
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed_at: newDate } : t));
    await supabase.from("todos").update({ completed_at: newDate }).eq("id", todo.id);
  };

  const deleteTodo = (todo: Todo) => {
    Alert.alert("할일 삭제", "삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제", style: "destructive", onPress: async () => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
          await supabase.from("todos").delete().eq("id", todo.id);
        },
      },
    ]);
  };

  const getRelevantPeriods = () => {
    if (!child) return [];
    const isPregnancy = child.type === "pregnancy";
    const checklist = isPregnancy ? PREGNANCY_CHECKLIST : BIRTH_CHECKLIST;
    const currentKey = isPregnancy
      ? getCurrentPregnancyPeriodKey(child.date)
      : getCurrentBirthPeriodKey(child.date);
    const today = new Date();

    return checklist.filter(period => {
      if (period.key === currentKey) return true;

      let endStr: string;
      if (isPregnancy) {
        const p = period as PregnancyPeriod;
        endStr = getPregnancyDates(child.date, p.weekStart, p.weekEnd).end;
      } else {
        const p = period as BirthPeriod;
        endStr = getBirthDates(child.date, p.monthStart, p.monthEnd).end;
      }

      const isPast = new Date(endStr) < today;
      const hasIncomplete = period.items.some(item => !completions[item.key]);
      return isPast && hasIncomplete;
    });
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>📋</Text>
        <Text style={styles.emptyText}>로그인하면 할일을 확인할 수 있어요</Text>
      </View>
    );
  }

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color="#ec4899" size="large" /></View>;
  }

  const isPregnancy = child?.type === "pregnancy";
  const currentKey = child
    ? (isPregnancy ? getCurrentPregnancyPeriodKey(child.date) : getCurrentBirthPeriodKey(child.date))
    : "";
  const relevantPeriods = getRelevantPeriods();

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* 접종/검진 섹션 */}
        {child && (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>
                {isPregnancy ? "📅 이번 달 검진 일정" : "💉 이번 달 접종 일정"}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("VaccinationSchedule")}>
                <Text style={styles.viewAll}>전체 보기 →</Text>
              </TouchableOpacity>
            </View>

            {relevantPeriods.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>이번 달 접종·검진 일정이 없어요 🎉</Text>
              </View>
            ) : relevantPeriods.map(period => {
              const allDone = period.items.every(item => !!completions[item.key]);
              const someDone = !allDone && period.items.some(item => !!completions[item.key]);
              const isCurrent = period.key === currentKey;

              return (
                <View key={period.key} style={[styles.periodCard, isCurrent && styles.periodCardCurrent]}>
                  <TouchableOpacity
                    style={styles.periodHeader}
                    onPress={() => togglePeriod(period.items)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.periodCheckbox,
                      allDone && styles.periodCheckboxDone,
                      someDone && styles.periodCheckboxPartial,
                    ]}>
                      {allDone && <Text style={styles.checkmark}>✓</Text>}
                      {someDone && <Text style={styles.dash}>−</Text>}
                    </View>
                    <Text style={[styles.periodLabel, isCurrent && styles.periodLabelCurrent]}>
                      {period.label}
                    </Text>
                    {isCurrent && (
                      <View style={styles.currentBadge}>
                        <Text style={styles.currentBadgeText}>현재</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {period.items.map(item => {
                    const done = !!completions[item.key];
                    return (
                      <TouchableOpacity
                        key={item.key}
                        style={styles.itemRow}
                        onPress={() => toggleItem(item)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.checkbox, done && styles.checkboxDone]}>
                          {done && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.itemTitle, done && styles.itemDone]} numberOfLines={2}>
                            {item.title}
                          </Text>
                          {done && (
                            <Text style={styles.completedDate}>완료 · {completions[item.key]}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </>
        )}

        {/* 내 할일 섹션 */}
        <View style={[styles.sectionRow, { marginTop: child ? 20 : 0 }]}>
          <Text style={styles.sectionTitle}>📝 내 할일</Text>
          <Text style={styles.todoCount}>{todos.filter(t => !t.completed_at).length}개 남음</Text>
        </View>

        {todos.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>오른쪽 아래 버튼으로{"\n"}할일을 추가해보세요 ✏️</Text>
          </View>
        ) : (
          <>
            {/* 미완료 */}
            {todos.filter(t => !t.completed_at).map(todo => (
              <TouchableOpacity key={todo.id} style={styles.todoItem} onPress={() => toggleTodo(todo)} activeOpacity={0.7}>
                <View style={styles.checkbox}>
                </View>
                <Text style={styles.todoTitle}>{todo.title}</Text>
                <TouchableOpacity onPress={() => deleteTodo(todo)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {/* 완료 */}
            {todos.filter(t => !!t.completed_at).map(todo => (
              <TouchableOpacity key={todo.id} style={[styles.todoItem, styles.todoDone]} onPress={() => toggleTodo(todo)} activeOpacity={0.7}>
                <View style={[styles.checkbox, styles.checkboxDone]}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.todoTitle, styles.itemDone]}>{todo.title}</Text>
                  <Text style={styles.completedDate}>완료 · {todo.completed_at}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteTodo(todo)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>✎</Text>
      </TouchableOpacity>

      {/* 할일 추가 모달 */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => { setShowAddModal(false); setNewTodoTitle(""); }} />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>할일 추가</Text>
            <TextInput
              style={styles.input}
              placeholder="할일을 입력하세요"
              placeholderTextColor="#9ca3af"
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              autoFocus
              onSubmitEditing={addTodo}
              returnKeyType="done"
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setShowAddModal(false); setNewTodoTitle(""); }}
              >
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, addingTodo && { opacity: 0.5 }]}
                onPress={addTodo}
                disabled={addingTodo}
              >
                <Text style={styles.saveText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 14, color: "#9ca3af", textAlign: "center", lineHeight: 22 },

  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  viewAll: { fontSize: 12, color: "#3b82f6", fontWeight: "600" },
  todoCount: { fontSize: 12, color: "#9ca3af" },

  emptyCard: {
    backgroundColor: "#fff", borderRadius: 12, padding: 20, alignItems: "center",
    borderWidth: 1, borderColor: "#f3f4f6", marginBottom: 8,
  },
  emptyCardText: { fontSize: 13, color: "#9ca3af", textAlign: "center", lineHeight: 20 },

  periodCard: {
    backgroundColor: "#fff", borderRadius: 12, marginBottom: 10,
    borderWidth: 1, borderColor: "#f3f4f6",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  periodCardCurrent: { borderColor: "#fce7f3" },

  periodHeader: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  periodCheckbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  periodCheckboxDone: { backgroundColor: "#10b981", borderColor: "#10b981" },
  periodCheckboxPartial: { backgroundColor: "#f3f4f6", borderColor: "#9ca3af" },
  periodLabel: { fontSize: 14, fontWeight: "700", color: "#374151", flex: 1 },
  periodLabelCurrent: { color: "#ec4899" },
  currentBadge: { backgroundColor: "#ec4899", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  currentBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },

  divider: { height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 14 },

  itemRow: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0,
  },
  checkboxDone: { backgroundColor: "#10b981", borderColor: "#10b981" },
  checkmark: { fontSize: 11, color: "#fff", fontWeight: "700" },
  dash: { fontSize: 14, color: "#9ca3af", fontWeight: "700", lineHeight: 16 },
  itemTitle: { fontSize: 13, color: "#111827", lineHeight: 18 },
  itemDone: { color: "#9ca3af", textDecorationLine: "line-through" },
  completedDate: { fontSize: 11, color: "#10b981", marginTop: 2 },

  todoItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: "#f3f4f6",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  todoDone: { opacity: 0.7 },
  todoTitle: { fontSize: 14, color: "#111827", flex: 1 },
  deleteBtn: { fontSize: 13, color: "#d1d5db", fontWeight: "600" },

  fab: {
    position: "absolute", bottom: 28, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#ec4899",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#ec4899", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 8,
  },
  fabIcon: { fontSize: 24, color: "#fff" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827", textAlign: "center" },
  input: {
    borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827",
  },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  saveBtn: { flex: 1, backgroundColor: "#3b82f6", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  saveText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
