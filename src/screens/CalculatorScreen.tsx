import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getDayName(date: Date): string {
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()] + "요일";
}

type Mode = "lmp" | "week";

export default function CalculatorScreen() {
  const [mode, setMode] = useState<Mode>("lmp");
  const [lmpInput, setLmpInput] = useState("");
  const [weekInput, setWeekInput] = useState("");
  const [dayInput, setDayInput] = useState("0");
  const [result, setResult] = useState<null | {
    dueDate: Date;
    conceptionDate: Date;
    currentWeek: number;
    currentDay: number;
    daysLeft: number;
  }>(null);

  const calculate = () => {
    let lmp: Date | null = null;

    if (mode === "lmp") {
      const parts = lmpInput.replace(/[^0-9]/g, "");
      if (parts.length !== 8) return;
      lmp = new Date(
        parseInt(parts.slice(0, 4)),
        parseInt(parts.slice(4, 6)) - 1,
        parseInt(parts.slice(6, 8))
      );
    } else {
      const weeks = parseInt(weekInput) || 0;
      const days = parseInt(dayInput) || 0;
      const totalDays = weeks * 7 + days;
      const today = new Date();
      lmp = new Date(today.getTime() - totalDays * 86400000);
    }

    if (!lmp || isNaN(lmp.getTime())) return;

    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lmp.getTime()) / 86400000);
    const currentWeek = Math.floor(diffDays / 7);
    const currentDay = diffDays % 7;
    const dueDate = addDays(lmp, 280);
    const conceptionDate = addDays(lmp, 14);
    const daysLeft = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / 86400000));

    setResult({ dueDate, conceptionDate, currentWeek, currentDay, daysLeft });
  };

  const MILESTONES = result
    ? [
        { label: "임신 확인 가능", week: 4, emoji: "🔍" },
        { label: "심장 소리 들림", week: 8, emoji: "💓" },
        { label: "기형아 검사", week: 11, emoji: "🏥" },
        { label: "태동 시작", week: 18, emoji: "🤰" },
        { label: "임신성 당뇨 검사", week: 24, emoji: "🩸" },
        { label: "출산 준비 시작", week: 32, emoji: "🎒" },
        { label: "출산 예정", week: 40, emoji: "👶" },
      ]
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🗓️ 임신 주수 계산기</Text>

      {/* 모드 선택 */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "lmp" && styles.modeBtnActive]}
          onPress={() => setMode("lmp")}
        >
          <Text style={[styles.modeBtnText, mode === "lmp" && styles.modeBtnTextActive]}>
            마지막 생리일 입력
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, mode === "week" && styles.modeBtnActive]}
          onPress={() => setMode("week")}
        >
          <Text style={[styles.modeBtnText, mode === "week" && styles.modeBtnTextActive]}>
            현재 주수 입력
          </Text>
        </TouchableOpacity>
      </View>

      {/* 입력 */}
      <View style={styles.card}>
        {mode === "lmp" ? (
          <View>
            <Text style={styles.label}>마지막 생리 시작일</Text>
            <TextInput
              style={styles.input}
              placeholder="예: 20260101"
              keyboardType="numeric"
              maxLength={8}
              value={lmpInput}
              onChangeText={setLmpInput}
            />
            <Text style={styles.hint}>8자리 숫자로 입력해주세요 (YYYYMMDD)</Text>
          </View>
        ) : (
          <View style={styles.weekRow}>
            <View style={styles.weekInputWrap}>
              <Text style={styles.label}>주</Text>
              <TextInput
                style={styles.input}
                placeholder="예: 12"
                keyboardType="numeric"
                maxLength={2}
                value={weekInput}
                onChangeText={setWeekInput}
              />
            </View>
            <View style={styles.weekInputWrap}>
              <Text style={styles.label}>일</Text>
              <TextInput
                style={styles.input}
                placeholder="0~6"
                keyboardType="numeric"
                maxLength={1}
                value={dayInput}
                onChangeText={setDayInput}
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
          <Text style={styles.calcBtnText}>계산하기</Text>
        </TouchableOpacity>
      </View>

      {/* 결과 */}
      {result && (
        <>
          <View style={styles.resultCard}>
            <Text style={styles.currentWeek}>
              현재 <Text style={styles.currentWeekNum}>{result.currentWeek}주 {result.currentDay}일</Text>
            </Text>
            <Text style={styles.daysLeft}>출산까지 약 {result.daysLeft}일 남았어요</Text>
          </View>

          <View style={styles.infoGrid}>
            {[
              { label: "출산 예정일", value: formatDate(result.dueDate), sub: getDayName(result.dueDate), emoji: "👶" },
              { label: "착상 예정일", value: formatDate(result.conceptionDate), sub: getDayName(result.conceptionDate), emoji: "🌱" },
            ].map((item) => (
              <View key={item.label} style={styles.infoCard}>
                <Text style={styles.infoEmoji}>{item.emoji}</Text>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
                <Text style={styles.infoSub}>{item.sub}</Text>
              </View>
            ))}
          </View>

          {/* 마일스톤 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>임신 타임라인</Text>
            {MILESTONES.map((m) => {
              const passed = result.currentWeek >= m.week;
              const current = result.currentWeek === m.week;
              return (
                <View key={m.week} style={styles.milestoneRow}>
                  <View style={[styles.milestoneDot, passed && styles.milestoneDotPassed, current && styles.milestoneDotCurrent]} />
                  <Text style={styles.milestoneEmoji}>{m.emoji}</Text>
                  <Text style={[styles.milestoneLabel, passed && styles.milestoneLabelPassed]}>
                    {m.week}주 · {m.label}
                  </Text>
                  {current && <Text style={styles.milestoneBadge}>현재</Text>}
                </View>
              );
            })}
          </View>
        </>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>⚠️ 참고용이며 실제 예정일은 산부인과 진단을 따르세요.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#fce7f3",
    alignItems: "center",
  },
  modeBtnActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  modeBtnText: { fontSize: 13, color: "#6b7280" },
  modeBtnTextActive: { color: "#fff", fontWeight: "600" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1, borderColor: "#fce7f3", borderRadius: 12,
    padding: 12, fontSize: 15, backgroundColor: "#fdf2f8", marginBottom: 4,
  },
  hint: { fontSize: 11, color: "#9ca3af", marginBottom: 12 },
  weekRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  weekInputWrap: { flex: 1 },
  calcBtn: {
    backgroundColor: "#ec4899", borderRadius: 12,
    paddingVertical: 14, alignItems: "center", marginTop: 8,
  },
  calcBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  resultCard: {
    backgroundColor: "#ec4899", borderRadius: 16, padding: 20,
    alignItems: "center", marginBottom: 16,
  },
  currentWeek: { fontSize: 16, color: "#fff", marginBottom: 4 },
  currentWeekNum: { fontSize: 24, fontWeight: "bold" },
  daysLeft: { fontSize: 13, color: "#fce7f3" },
  infoGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  infoCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 16,
    padding: 16, alignItems: "center", borderWidth: 1, borderColor: "#fce7f3",
  },
  infoEmoji: { fontSize: 24, marginBottom: 6 },
  infoLabel: { fontSize: 11, color: "#6b7280", marginBottom: 4 },
  infoValue: { fontSize: 13, fontWeight: "bold", color: "#1f2937", textAlign: "center" },
  infoSub: { fontSize: 11, color: "#9ca3af" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  milestoneRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  milestoneDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#e5e7eb" },
  milestoneDotPassed: { backgroundColor: "#ec4899" },
  milestoneDotCurrent: { backgroundColor: "#be185d", width: 14, height: 14, borderRadius: 7 },
  milestoneEmoji: { fontSize: 16 },
  milestoneLabel: { flex: 1, fontSize: 13, color: "#9ca3af" },
  milestoneLabelPassed: { color: "#374151" },
  milestoneBadge: {
    fontSize: 10, color: "#fff", backgroundColor: "#ec4899",
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, fontWeight: "600",
  },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12, marginTop: 4 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
