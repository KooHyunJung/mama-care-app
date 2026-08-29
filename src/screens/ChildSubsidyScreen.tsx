import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function ChildSubsidyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💰 자녀장려금 안내</Text>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>2026년 자녀장려금</Text>
        <Text style={styles.highlightAmount}>자녀 1인당 최대 100만원</Text>
        <Text style={styles.highlightNote}>근로장려금과 중복 수령 가능!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 지원 대상</Text>
        {[
          { label: "연령", value: "18세 미만 부양자녀" },
          { label: "소득 기준", value: "부부 합산 총소득 4,000만원 미만" },
          { label: "재산 기준", value: "재산 합계 2억원 미만" },
          { label: "신청자격", value: "근로소득·사업소득·종교인소득자" },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💵 지급 금액</Text>
        <View style={styles.amountGrid}>
          {[
            { range: "2,100만원 미만", amount: "100만원", color: "#34d399" },
            { range: "2,100~4,000만원", amount: "100만원 ~ 감소", color: "#fbbf24" },
            { range: "4,000만원 이상", amount: "지급 없음", color: "#f87171" },
          ].map((item) => (
            <View key={item.range} style={[styles.amountItem, { borderLeftColor: item.color }]}>
              <Text style={styles.amountRange}>{item.range}</Text>
              <Text style={[styles.amountValue, { color: item.color }]}>{item.amount}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 신청 기간 및 방법</Text>
        {[
          { label: "정기 신청", value: "매년 5월 1일 ~ 5월 31일" },
          { label: "기한 후 신청", value: "6월 1일 ~ 11월 30일 (10% 감액)" },
          { label: "신청 방법", value: "홈택스·손택스 또는 세무서 방문" },
          { label: "지급 시기", value: "9월 (정기), 12월 (기한 후)" },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => Linking.openURL("https://www.hometax.go.kr")}
      >
        <Text style={styles.linkBtnText}>🔗 홈택스에서 신청하기</Text>
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>💬 문의: 국세상담센터 ☎ 126</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  highlightCard: { backgroundColor: "#ec4899", borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 16 },
  highlightTitle: { fontSize: 13, color: "#fce7f3", marginBottom: 4 },
  highlightAmount: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  highlightNote: { fontSize: 12, color: "#fce7f3", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fdf2f8", gap: 8 },
  infoLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#1f2937", flex: 1.5, textAlign: "right" },
  amountGrid: { gap: 8 },
  amountItem: { backgroundColor: "#fdf2f8", borderRadius: 10, padding: 12, borderLeftWidth: 4 },
  amountRange: { fontSize: 12, color: "#6b7280", marginBottom: 2 },
  amountValue: { fontSize: 14, fontWeight: "bold" },
  linkBtn: { backgroundColor: "#fef9c3", borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "#fde68a" },
  linkBtnText: { fontSize: 14, color: "#92400e", fontWeight: "600" },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
