import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function ParentalLeaveScreen() {
  const PAY_TABLE = [
    { period: "1~3개월", rate: "통상임금 100%", cap: "월 최대 250만원" },
    { period: "4~6개월", rate: "통상임금 100%", cap: "월 최대 200만원" },
    { period: "7~12개월", rate: "통상임금 80%", cap: "월 최대 160만원" },
  ];

  const SIX_SIX = [
    { month: "1개월", cap: "월 최대 250만원" },
    { month: "2개월", cap: "월 최대 250만원" },
    { month: "3개월", cap: "월 최대 300만원" },
    { month: "4개월", cap: "월 최대 350만원" },
    { month: "5개월", cap: "월 최대 400만원" },
    { month: "6개월", cap: "월 최대 450만원 ⬆️" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🍼 육아휴직 안내</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 기본 정보</Text>
        {[
          { label: "사용 가능 기간", value: "자녀 1인당 최대 1년 6개월" },
          { label: "대상", value: "만 8세 이하 또는 초등 2학년 이하 자녀" },
          { label: "신청 방법", value: "고용24(work24.go.kr) 또는 고용센터" },
          { label: "급여 지급", value: "고용보험에서 100% 선지급 (2025~)" },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💰 육아휴직 급여</Text>
        {PAY_TABLE.map((row) => (
          <View key={row.period} style={styles.tableRow}>
            <Text style={styles.tableCell1}>{row.period}</Text>
            <Text style={styles.tableCell2}>{row.rate}</Text>
            <Text style={styles.tableCell3}>{row.cap}</Text>
          </View>
        ))}
        <Text style={styles.tableNote}>• 하한액 월 70만원 / 고용보험에서 전액 지원</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 6+6 부모육아휴직제</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2025 확대</Text>
          </View>
        </View>
        <Text style={styles.desc}>생후 <Text style={styles.bold}>18개월 이내</Text> 자녀 대상, 부모가 순차 또는 동시에 육아휴직 사용 시 최대 <Text style={styles.bold}>월 450만원</Text> 지원</Text>
        <View style={styles.sixSixGrid}>
          {SIX_SIX.map((row) => (
            <View key={row.month} style={styles.sixSixItem}>
              <Text style={styles.sixSixMonth}>{row.month}</Text>
              <Text style={styles.sixSixCap}>{row.cap}</Text>
            </View>
          ))}
        </View>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>• 엄마·아빠 각각 위 금액 지원 (통상임금 100% 기준)</Text>
          <Text style={styles.noteText}>• 7개월차부터는 일반 육아휴직으로 전환 (상한 월 160만원)</Text>
          <Text style={styles.noteText}>• 적용 대상: 생후 18개월 이내 자녀</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 2025년 주요 변경사항</Text>
        {[
          "급여 사후지급(25%) 제도 폐지 → 100% 선지급",
          "1~3개월 급여 상한 월 250만원으로 인상",
          "6+6 → 6개월차 상한 월 450만원으로 확대",
          "배우자 출산휴가 10일 → 20일, 사용기한 120일",
          "최소 사용 기간 30일 → 14일로 단축",
        ].map((text, idx) => (
          <View key={idx} style={styles.changeRow}>
            <Text style={styles.changeDot}>•</Text>
            <Text style={styles.changeText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>💬 문의: 고용보험 ☎ 1588-0075 | 고용24 work24.go.kr</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fdf2f8", gap: 8 },
  infoLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#1f2937", flex: 1, textAlign: "right" },
  tableRow: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fdf2f8" },
  tableCell1: { flex: 1, fontSize: 12, color: "#374151" },
  tableCell2: { flex: 1.2, fontSize: 12, color: "#6b7280" },
  tableCell3: { flex: 1.2, fontSize: 12, fontWeight: "600", color: "#ec4899", textAlign: "right" },
  tableNote: { fontSize: 11, color: "#9ca3af", marginTop: 8 },
  badge: { backgroundColor: "#ffe4e6", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 10, color: "#e11d48", fontWeight: "600" },
  desc: { fontSize: 12, color: "#6b7280", lineHeight: 18, marginBottom: 12 },
  bold: { fontWeight: "bold", color: "#1f2937" },
  sixSixGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  sixSixItem: {
    width: "47%", backgroundColor: "#fdf2f8", borderRadius: 12,
    padding: 10, flexDirection: "row", justifyContent: "space-between",
  },
  sixSixMonth: { fontSize: 12, color: "#374151" },
  sixSixCap: { fontSize: 12, fontWeight: "bold", color: "#ec4899" },
  noteBox: { backgroundColor: "#fdf2f8", borderRadius: 10, padding: 10, gap: 4 },
  noteText: { fontSize: 11, color: "#6b7280" },
  changeRow: { flexDirection: "row", gap: 6, marginBottom: 6 },
  changeDot: { fontSize: 12, color: "#ec4899" },
  changeText: { flex: 1, fontSize: 12, color: "#374151", lineHeight: 18 },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
