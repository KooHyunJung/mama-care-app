import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

type Supplement = {
  name: string;
  weeks: [number, number];
  color: string;
  reason: string;
};

const SUPPLEMENTS: Supplement[] = [
  { name: "엽산", weeks: [0, 16], color: "#f472b6", reason: "신경관 결손 예방" },
  { name: "철분", weeks: [16, 40], color: "#fb923c", reason: "빈혈 예방 및 태아 혈액 생성" },
  { name: "칼슘", weeks: [16, 40], color: "#a78bfa", reason: "태아 뼈·치아 형성" },
  { name: "오메가3", weeks: [0, 40], color: "#34d399", reason: "태아 뇌·시력 발달" },
  { name: "비타민D", weeks: [0, 40], color: "#fbbf24", reason: "칼슘 흡수 보조·면역력" },
  { name: "마그네슘", weeks: [20, 40], color: "#60a5fa", reason: "다리 경련 예방·숙면" },
  { name: "유산균", weeks: [0, 40], color: "#f87171", reason: "장 건강·면역력 강화" },
];

export default function NutritionScreen() {
  const [currentWeek, setCurrentWeek] = useState(12);

  const activeSupplements = SUPPLEMENTS.filter(
    (s) => currentWeek >= s.weeks[0] && currentWeek < s.weeks[1]
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💊 주차별 영양제 가이드</Text>

      {/* 주수 슬라이더 */}
      <View style={styles.card}>
        <Text style={styles.weekLabel}>현재 임신 주수: <Text style={styles.weekNum}>{currentWeek}주</Text></Text>
        <View style={styles.weekBtns}>
          {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((w) => (
            <TouchableOpacity
              key={w}
              style={[styles.weekBtn, currentWeek === w && styles.weekBtnActive]}
              onPress={() => setCurrentWeek(w)}
            >
              <Text style={[styles.weekBtnText, currentWeek === w && styles.weekBtnTextActive]}>
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 현재 주수 추천 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✅ {currentWeek}주차 추천 영양제</Text>
        {activeSupplements.map((s) => (
          <View key={s.name} style={styles.supRow}>
            <View style={[styles.supDot, { backgroundColor: s.color }]} />
            <View style={styles.supTextWrap}>
              <Text style={styles.supName}>{s.name}</Text>
              <Text style={styles.supReason}>{s.reason}</Text>
            </View>
          </View>
        ))}
        {activeSupplements.length === 0 && (
          <Text style={styles.empty}>해당 주수 추천 영양제 없음</Text>
        )}
      </View>

      {/* 전체 타임라인 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 영양제 복용 기간</Text>
        {SUPPLEMENTS.map((s) => {
          const startPct = (s.weeks[0] / 40) * 100;
          const widthPct = ((s.weeks[1] - s.weeks[0]) / 40) * 100;
          const active = currentWeek >= s.weeks[0] && currentWeek < s.weeks[1];
          return (
            <View key={s.name} style={styles.timelineRow}>
              <Text style={styles.timelineName}>{s.name}</Text>
              <View style={styles.timelineBar}>
                <View
                  style={[
                    styles.timelineFill,
                    {
                      left: `${startPct}%`,
                      width: `${widthPct}%`,
                      backgroundColor: active ? s.color : "#e5e7eb",
                    },
                  ]}
                />
              </View>
              <Text style={styles.timelineWeeks}>{s.weeks[0]}~{s.weeks[1]}주</Text>
            </View>
          );
        })}
        <View style={styles.timelineAxis}>
          {[0, 10, 20, 30, 40].map((w) => (
            <Text key={w} style={styles.timelineAxisLabel}>{w}주</Text>
          ))}
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>⚠️ 영양제 복용 전 담당 의사와 상담하세요.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  weekLabel: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  weekNum: { color: "#ec4899", fontWeight: "bold", fontSize: 15 },
  weekBtns: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  weekBtn: {
    width: 44, height: 36, borderRadius: 10,
    backgroundColor: "#fdf2f8", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#fce7f3",
  },
  weekBtnActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  weekBtnText: { fontSize: 12, color: "#6b7280" },
  weekBtnTextActive: { color: "#fff", fontWeight: "bold" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  supRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 12, borderBottomWidth: 1, borderBottomColor: "#fdf2f8" },
  supDot: { width: 12, height: 12, borderRadius: 6 },
  supTextWrap: { flex: 1 },
  supName: { fontSize: 14, fontWeight: "600", color: "#1f2937" },
  supReason: { fontSize: 11, color: "#6b7280" },
  empty: { fontSize: 13, color: "#9ca3af", textAlign: "center", paddingVertical: 8 },
  timelineRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 8 },
  timelineName: { width: 52, fontSize: 11, color: "#374151" },
  timelineBar: { flex: 1, height: 16, backgroundColor: "#f3f4f6", borderRadius: 8, position: "relative", overflow: "hidden" },
  timelineFill: { position: "absolute", top: 0, bottom: 0, borderRadius: 8 },
  timelineWeeks: { width: 44, fontSize: 10, color: "#9ca3af", textAlign: "right" },
  timelineAxis: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  timelineAxisLabel: { fontSize: 10, color: "#9ca3af" },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
