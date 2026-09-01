import { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, Modal, TextInput,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TODAY = new Date().toISOString().split("T")[0];

const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#f97316", "#14b8a6"];

const EMOJIS = [
  "🏥","👶","🍼","💊","📋","🎉","💉","🩺","🩸","❤️",
  "🌸","🎀","🛒","📝","✈️","🎂","🎁","🏃","🍕","☕",
  "🌙","⭐","🌈","🦋","🐣","🧸","🎵","📸","🌺","💐",
];

const CHECKUPS = [
  { week: 6,  title: "임신 확인 초음파" },
  { week: 11, title: "NT 기형아 검사" },
  { week: 16, title: "2차 기형아 검사" },
  { week: 20, title: "정밀 초음파" },
  { week: 24, title: "임신성 당뇨 검사" },
  { week: 32, title: "태아 성장 초음파" },
  { week: 36, title: "GBS 검사" },
  { week: 40, title: "출산 예정일 🎉" },
];

interface Child { id: string; name: string; type: string; date: string; }
export interface ScheduleItem {
  id: string; title?: string; emoji?: string; color: string;
  memo?: string; location?: string; date: string; isAuto: boolean;
}

function getLMP(dueDate: string) {
  const d = new Date(dueDate);
  d.setDate(d.getDate() - 280);
  return d;
}
function dateFromLMP(lmp: Date, week: number) {
  const d = new Date(lmp);
  d.setDate(d.getDate() + week * 7);
  return d.toISOString().split("T")[0];
}
function currentWeek(lmp: Date) {
  const days = Math.floor((Date.now() - lmp.getTime()) / 86400000);
  return Math.max(0, Math.floor(days / 7));
}

export default function ScheduleScreen() {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation<Nav>();
  const [child, setChild] = useState<Child | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newEmoji, setNewEmoji] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [newMemo, setNewMemo] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    if (isLoggedIn) fetchAll();
  }, [isLoggedIn]));

  const fetchAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: children } = await supabase.from("children").select("*")
      .eq("user_id", user.id).order("created_at").limit(1);
    const child = children?.[0] || null;
    setChild(child);

    const { data: custom } = await supabase.from("schedules").select("*").eq("user_id", user.id);

    const all: ScheduleItem[] = (custom || []).map((s: any) => ({
      id: s.id, title: s.title, emoji: s.emoji, color: s.color,
      memo: s.memo, location: s.location, date: s.date, isAuto: false,
    }));

    if (child?.type === "pregnancy" && child?.date) {
      const lmp = getLMP(child.date);
      CHECKUPS.forEach(c => {
        all.push({ id: `auto-${c.week}`, title: c.title, color: "#9ca3af", date: dateFromLMP(lmp, c.week), isAuto: true });
      });
    }

    setSchedules(all);
    buildMarked(all, selectedDate);
  };

  const buildMarked = (items: ScheduleItem[], selected: string) => {
    const marked: Record<string, any> = {};
    items.forEach(item => {
      if (!marked[item.date]) marked[item.date] = { events: [] };
      const label = item.emoji && item.title ? `${item.emoji} ${item.title}` : (item.emoji || item.title || "");
      marked[item.date].events.push({ label, color: item.color });
    });
    marked[selected] = { ...(marked[selected] || { events: [] }), selected: true };
    setMarkedDates(marked);
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    buildMarked(schedules, day.dateString);
  };

  const addSchedule = async () => {
    if (!newTitle.trim() && !newEmoji) {
      Alert.alert("제목 또는 이모지를 입력해주세요."); return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    await supabase.from("schedules").insert({
      user_id: user.id,
      child_id: child?.id || null,
      title: newTitle.trim() || null,
      emoji: newEmoji || null,
      color: newColor,
      memo: newMemo.trim() || null,
      location: newLocation.trim() || null,
      date: selectedDate,
    });
    setNewTitle(""); setNewEmoji(""); setNewColor(COLORS[0]); setNewMemo(""); setNewLocation("");
    setShowModal(false);
    fetchAll();
    setLoading(false);
  };

  const DayCell = ({ date, state, marking }: any) => {
    const events: any[] = marking?.events || [];
    const isSelected = marking?.selected;
    const isToday = date?.dateString === TODAY;
    return (
      <TouchableOpacity
        style={[daySt.cell, isSelected && daySt.selectedCell]}
        onPress={() => handleDayPress({ dateString: date.dateString })}
        activeOpacity={0.7}
      >
        <View style={[daySt.numberWrap, isToday && daySt.todayWrap]}>
          <Text style={[daySt.number, state === "disabled" && daySt.disabled, isSelected && daySt.selectedNumber]}>
            {date.day}
          </Text>
        </View>
        <View style={daySt.events}>
          {events.slice(0, 2).map((ev, i) => (
            <View key={i} style={[daySt.chip, { backgroundColor: ev.color + "20", borderColor: ev.color + "60" }]}>
              <Text style={[daySt.chipText, { color: ev.color }]} numberOfLines={1}>{ev.label}</Text>
            </View>
          ))}
          {events.length > 2 && <Text style={daySt.more}>+{events.length - 2}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  const selectedEvents = schedules.filter(s => s.date === selectedDate);

  let weekBanner = "";
  if (child?.type === "pregnancy" && child?.date) {
    const week = currentWeek(getLMP(child.date));
    weekBanner = `🤰 ${child.name} · 현재 ${week}주차`;
  } else if (child?.type === "birth" && child?.date) {
    const days = Math.floor((Date.now() - new Date(child.date).getTime()) / 86400000);
    weekBanner = `👶 ${child.name} · 생후 ${days}일`;
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>📅</Text>
        <Text style={{ fontSize: 14, color: "#9ca3af" }}>로그인하면 스케줄을 확인할 수 있어요</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!weekBanner && <View style={styles.banner}><Text style={styles.bannerText}>{weekBanner}</Text></View>}

      <Calendar
        dayComponent={(props: any) => <DayCell {...props} />}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#fff",
          textSectionTitleColor: "#9ca3af",
          monthTextColor: "#111827",
          arrowColor: "#ec4899",
          textMonthFontWeight: "700",
          textMonthFontSize: 15,
        }}
        style={styles.calendar}
      />

      <View style={styles.bottom}>
        <View style={styles.bottomHeader}>
          <Text style={styles.bottomDate}>{selectedDate}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.addBtnText}>+ 추가</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.eventList}>
          {selectedEvents.length === 0
            ? <Text style={styles.noEvent}>일정이 없어요</Text>
            : selectedEvents.map(ev => (
              <TouchableOpacity
                key={ev.id}
                style={[styles.eventItem, { borderLeftColor: ev.color }]}
                onPress={() => navigation.navigate("ScheduleDetail", ev)}
                activeOpacity={0.8}
              >
                <View style={[styles.eventDot, { backgroundColor: ev.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>
                    {ev.emoji ? `${ev.emoji} ` : ""}{ev.title || ""}
                  </Text>
                  {ev.location ? <Text style={styles.eventLocation}>📍 {ev.location}</Text> : null}
                  {ev.memo ? <Text style={styles.eventMemo}>{ev.memo}</Text> : null}
                </View>
                {ev.isAuto && <Text style={styles.autoBadge}>검진</Text>}
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>

      {/* 일정 추가 모달 */}
      <Modal visible={showModal} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setShowModal(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{selectedDate} 일정 추가</Text>

            <Text style={styles.sheetLabel}>이모지 (선택)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
              {EMOJIS.map(em => (
                <TouchableOpacity
                  key={em}
                  style={[styles.emojiBtn, newEmoji === em && styles.emojiBtnActive]}
                  onPress={() => setNewEmoji(newEmoji === em ? "" : em)}
                >
                  <Text style={{ fontSize: 22 }}>{em}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.sheetLabel}>제목 (선택)</Text>
            <TextInput
              style={styles.sheetInput} placeholder="제목 입력" placeholderTextColor="#9ca3af"
              value={newTitle} onChangeText={setNewTitle}
            />

            <Text style={styles.sheetLabel}>색상</Text>
            <View style={styles.colorRow}>
              {COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, newColor === c && styles.colorDotActive]}
                  onPress={() => setNewColor(c)}
                />
              ))}
            </View>

            <Text style={styles.sheetLabel}>장소 (선택)</Text>
            <TextInput
              style={styles.sheetInput} placeholder="병원명, 장소 등" placeholderTextColor="#9ca3af"
              value={newLocation} onChangeText={setNewLocation}
            />

            <Text style={styles.sheetLabel}>메모 (선택)</Text>
            <TextInput
              style={[styles.sheetInput, { height: 72 }]} placeholder="메모 입력" placeholderTextColor="#9ca3af"
              value={newMemo} onChangeText={setNewMemo} multiline
            />

            <View style={styles.sheetBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.5 }]} onPress={addSchedule} disabled={loading}>
                <Text style={styles.saveText}>{loading ? "저장 중..." : "저장"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const daySt = StyleSheet.create({
  cell: { alignItems: "center", paddingVertical: 4, width: "100%", minHeight: 64 },
  selectedCell: { backgroundColor: "#fff0f6", borderRadius: 8 },
  numberWrap: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 14 },
  todayWrap: { backgroundColor: "#ec4899" },
  number: { fontSize: 13, color: "#111827", fontWeight: "500" },
  selectedNumber: { color: "#ec4899", fontWeight: "700" },
  disabled: { color: "#d1d5db" },
  events: { width: "100%", gap: 2, paddingHorizontal: 2 },
  chip: { borderRadius: 4, paddingHorizontal: 3, paddingVertical: 1, borderWidth: 0.5 },
  chipText: { fontSize: 9, fontWeight: "600" },
  more: { fontSize: 9, color: "#9ca3af", textAlign: "center" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  banner: { backgroundColor: "#fff0f6", paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  bannerText: { fontSize: 13, fontWeight: "600", color: "#ec4899" },
  calendar: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },

  bottom: { flex: 1, backgroundColor: "#fff" },
  bottomHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  bottomDate: { fontSize: 14, fontWeight: "700", color: "#111827" },
  addBtn: { backgroundColor: "#ec4899", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  addBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  eventList: { flex: 1, padding: 12 },
  noEvent: { textAlign: "center", color: "#9ca3af", fontSize: 13, marginTop: 24 },
  eventItem: { flexDirection: "row", alignItems: "flex-start", padding: 12, borderRadius: 10, backgroundColor: "#fafafa", marginBottom: 8, borderLeftWidth: 3, gap: 10 },
  eventDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
  eventTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  eventLocation: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  eventMemo: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  autoBadge: { fontSize: 10, color: "#9ca3af", backgroundColor: "#f3f4f6", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start" },

  overlay: { flex: 1, justifyContent: "flex-end" },
  overlayBg: { flex: 1 },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 8 },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4, textAlign: "center" },
  sheetLabel: { fontSize: 12, fontWeight: "600", color: "#6b7280", marginTop: 4 },

  emojiRow: { flexDirection: "row" },
  emojiBtn: { padding: 6, borderRadius: 8, marginRight: 6, borderWidth: 2, borderColor: "transparent" },
  emojiBtnActive: { borderColor: "#ec4899", backgroundColor: "#fff0f6" },

  sheetInput: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#111827" },

  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotActive: { borderWidth: 3, borderColor: "#111827" },

  sheetBtns: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  saveBtn: { flex: 1, backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 13, alignItems: "center" },
  saveText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
