import { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Modal, TextInput, KeyboardAvoidingView, Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import {
  PREGNANCY_CHECKLIST, BIRTH_CHECKLIST,
  PregnancyPeriod, BirthPeriod, ChecklistItem,
} from "../data/checklist";

interface Child { id: string; name: string; type: string; date: string; }

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

export default function VaccinationScheduleScreen() {
  const { isLoggedIn } = useAuth();
  const [child, setChild] = useState<Child | null>(null);
  const [completions, setCompletions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<{ key?: string; title: string; items?: ChecklistItem[] } | null>(null);
  const [editDate, setEditDate] = useState("");

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

  const openEditDate = (item: ChecklistItem) => {
    setEditingItem({ key: item.key, title: item.title });
    setEditDate(completions[item.key] || "");
  };

  const openEditPeriodDate = (label: string, items: ChecklistItem[]) => {
    const firstDate = completions[items[0]?.key] || new Date().toISOString().split("T")[0];
    setEditingItem({ title: label, items });
    setEditDate(firstDate);
  };

  const saveEditDate = async () => {
    if (!editingItem || !child || !editDate.trim()) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(editDate.trim())) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const date = editDate.trim();

    if (editingItem.items) {
      const next = { ...completions };
      editingItem.items.forEach(item => { next[item.key] = date; });
      setCompletions(next);
      for (const item of editingItem.items) {
        await supabase.from("checklist_completions")
          .update({ completed_at: date })
          .eq("user_id", user.id).eq("child_id", child.id).eq("item_key", item.key);
      }
    } else if (editingItem.key) {
      setCompletions(prev => ({ ...prev, [editingItem.key!]: date }));
      await supabase.from("checklist_completions")
        .update({ completed_at: date })
        .eq("user_id", user.id).eq("child_id", child.id).eq("item_key", editingItem.key);
    }
    setEditingItem(null);
  };

  if (isLoading) {
    return <View style={styles.center}><ActivityIndicator color="#ec4899" size="large" /></View>;
  }
  if (!child) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>👶</Text>
        <Text style={styles.emptyText}>아이 정보를 등록하면{"\n"}맞춤 일정을 확인할 수 있어요</Text>
      </View>
    );
  }

  const isPregnancy = child.type === "pregnancy";
  const currentKey = isPregnancy
    ? getCurrentPregnancyPeriodKey(child.date)
    : getCurrentBirthPeriodKey(child.date);

  type PeriodWithDates = (PregnancyPeriod | BirthPeriod) & {
    dates: { start: string; end: string }; isCurrent: boolean;
  };

  const periods: PeriodWithDates[] = isPregnancy
    ? PREGNANCY_CHECKLIST.map(p => ({
        ...p,
        dates: getPregnancyDates(child.date, p.weekStart, p.weekEnd),
        isCurrent: p.key === currentKey,
      }))
    : BIRTH_CHECKLIST.map(p => ({
        ...p,
        dates: getBirthDates(child.date, p.monthStart, p.monthEnd),
        isCurrent: p.key === currentKey,
      }));

  const title = isPregnancy
    ? `🤰 ${child.name} · 임신 기간 검진 일정`
    : `👶 ${child.name} · 예방접종 전체 일정`;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{title}</Text>
        </View>

        {periods.map((period, idx) => {
          const isLast = idx === periods.length - 1;
          const allDone = period.items.every(item => !!completions[item.key]);
          const someDone = !allDone && period.items.some(item => !!completions[item.key]);
          const borderColor = period.isCurrent ? "#ec4899" : allDone ? "#10b981" : "#e5e7eb";

          return (
            <View key={period.key} style={styles.timelineRow}>
              <View style={styles.dotCol}>
                <View style={[styles.dot, period.isCurrent && styles.dotCurrent, allDone && styles.dotDone]} />
                {!isLast && <View style={styles.line} />}
              </View>

              <View style={[styles.card, { borderLeftColor: borderColor }, period.isCurrent && styles.cardCurrent]}>
                <TouchableOpacity style={styles.cardHeader} onPress={() => togglePeriod(period.items)} activeOpacity={0.7}>
                  <View style={[
                    styles.periodCheckbox,
                    allDone && styles.periodCheckboxDone,
                    someDone && !allDone && styles.periodCheckboxPartial,
                  ]}>
                    {allDone && <Text style={styles.periodCheckmark}>✓</Text>}
                    {someDone && !allDone && <Text style={styles.periodDash}>−</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.labelRow}>
                      <Text style={[styles.periodLabel, period.isCurrent && styles.labelCurrent]}>
                        {period.label}
                      </Text>
                      {period.isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>현재</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.dateRange}>{period.dates.start} ~ {period.dates.end}</Text>
                  </View>
                  {allDone && (
                    <TouchableOpacity
                      onPress={() => openEditPeriodDate(period.label, period.items)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.editIcon}>✎</Text>
                    </TouchableOpacity>
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
                        <View style={styles.itemTitleRow}>
                          {item.isCheckup && (
                            <View style={styles.checkupBadge}>
                              <Text style={styles.checkupText}>검진</Text>
                            </View>
                          )}
                          <Text style={[styles.itemTitle, done && styles.itemDone]} numberOfLines={2}>
                            {item.title}
                          </Text>
                        </View>
                        {done && (
                          <View style={styles.completedRow}>
                            <Text style={styles.completedDate}>완료 · {completions[item.key]}</Text>
                            <TouchableOpacity
                              onPress={() => openEditDate(item)}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text style={styles.editIcon}>✎</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!editingItem} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => setEditingItem(null)} />
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>완료일 수정</Text>
            <Text style={styles.modalSubtitle} numberOfLines={2}>{editingItem?.title}</Text>
            <TextInput
              style={styles.dateInput}
              value={editDate}
              onChangeText={setEditDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              keyboardType="numbers-and-punctuation"
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setEditingItem(null)}>
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={saveEditDate}>
                <Text style={styles.modalSaveText}>저장</Text>
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

  banner: { backgroundColor: "#fff0f6", borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: "#fce7f3" },
  bannerText: { fontSize: 14, fontWeight: "700", color: "#ec4899" },

  timelineRow: { flexDirection: "row", marginBottom: 0 },
  dotCol: { width: 24, alignItems: "center", paddingTop: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#d1d5db", zIndex: 1 },
  dotCurrent: { backgroundColor: "#ec4899", width: 14, height: 14, borderRadius: 7 },
  dotDone: { backgroundColor: "#10b981" },
  line: { flex: 1, width: 2, backgroundColor: "#e5e7eb", marginTop: 4 },

  card: {
    flex: 1, backgroundColor: "#fff", borderRadius: 12, borderLeftWidth: 4,
    marginBottom: 12, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardCurrent: { backgroundColor: "#fff8fc" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 10, gap: 10 },

  periodCheckbox: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  periodCheckboxDone: { backgroundColor: "#10b981", borderColor: "#10b981" },
  periodCheckboxPartial: { backgroundColor: "#f3f4f6", borderColor: "#9ca3af" },
  periodCheckmark: { fontSize: 12, color: "#fff", fontWeight: "700" },
  periodDash: { fontSize: 14, color: "#9ca3af", fontWeight: "700", lineHeight: 16 },

  labelRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  periodLabel: { fontSize: 14, fontWeight: "700", color: "#374151" },
  labelCurrent: { color: "#ec4899" },
  currentBadge: { backgroundColor: "#ec4899", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  currentBadgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  dateRange: { fontSize: 11, color: "#9ca3af" },

  divider: { height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 14 },

  itemRow: { flexDirection: "row", alignItems: "flex-start", padding: 12, paddingHorizontal: 14, gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center", marginTop: 1, flexShrink: 0,
  },
  checkboxDone: { backgroundColor: "#10b981", borderColor: "#10b981" },
  checkmark: { fontSize: 11, color: "#fff", fontWeight: "700" },
  itemTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  checkupBadge: { backgroundColor: "#6b7280", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  checkupText: { fontSize: 10, color: "#fff", fontWeight: "600" },
  itemTitle: { fontSize: 13, color: "#111827", lineHeight: 18, flex: 1 },
  itemDone: { color: "#9ca3af", textDecorationLine: "line-through" },

  completedRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 },
  completedDate: { fontSize: 11, color: "#10b981" },
  editIcon: { fontSize: 13, color: "#9ca3af" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, gap: 12 },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111827", textAlign: "center" },
  modalSubtitle: { fontSize: 12, color: "#9ca3af", textAlign: "center" },
  dateInput: {
    borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: "#111827", textAlign: "center",
  },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  modalCancelText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  modalSave: { flex: 1, backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  modalSaveText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
