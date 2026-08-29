import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function WorkRightsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💼 단축근무 안내</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 임신기 근로시간 단축</Text>
        {[
          { label: "대상", value: "임신 12주 이내 또는 36주 이후 근로자" },
          { label: "단축 시간", value: "1일 2시간" },
          { label: "급여", value: "단축 전 통상임금 100% 보장" },
          { label: "신청 방법", value: "회사 인사팀에 신청서 제출" },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📅 신청 가능 시기</Text>
        <View style={styles.periodCard}>
          <Text style={styles.periodTitle}>🌱 임신 초기</Text>
          <Text style={styles.periodRange}>임신 12주 이내</Text>
          <Text style={styles.periodDesc}>유산 위험이 높은 시기, 1일 2시간 단축 가능</Text>
        </View>
        <View style={styles.periodCard}>
          <Text style={styles.periodTitle}>🌸 임신 후기</Text>
          <Text style={styles.periodRange}>임신 36주 이후</Text>
          <Text style={styles.periodDesc}>출산 준비 시기, 1일 2시간 단축 가능</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚖️ 법적 보호</Text>
        {[
          "단축근무 신청을 이유로 한 해고·불이익 처우 금지",
          "단축 전 소정근로시간 기준으로 급여 전액 지급",
          "단축근무 중에도 연차·퇴직금 등 근로조건 동일 적용",
          "위반 시 사용자 500만원 이하 과태료",
        ].map((text, idx) => (
          <View key={idx} style={styles.protectionRow}>
            <Text style={styles.protectionDot}>✓</Text>
            <Text style={styles.protectionText}>{text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 신청 절차</Text>
        {[
          { step: "1", desc: "임신 확인 (산부인과 진단서 또는 임신확인서 발급)" },
          { step: "2", desc: "회사 인사팀에 단축근무 신청서 + 임신확인서 제출" },
          { step: "3", desc: "근무 시간 조정 협의 (시작·종료 시간 선택 가능)" },
          { step: "4", desc: "단축근무 시작" },
        ].map((item) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <Text style={styles.stepDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>💬 문의: 고용노동부 고객상담센터 ☎ 1350</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fdf2f8", gap: 8 },
  infoLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#1f2937", flex: 1.5, textAlign: "right" },
  periodCard: { backgroundColor: "#fdf2f8", borderRadius: 12, padding: 12, marginBottom: 8 },
  periodTitle: { fontSize: 13, fontWeight: "bold", color: "#1f2937", marginBottom: 2 },
  periodRange: { fontSize: 12, color: "#ec4899", fontWeight: "600", marginBottom: 4 },
  periodDesc: { fontSize: 12, color: "#6b7280" },
  protectionRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  protectionDot: { fontSize: 13, color: "#ec4899", fontWeight: "bold" },
  protectionText: { flex: 1, fontSize: 12, color: "#374151", lineHeight: 18 },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 12, alignItems: "flex-start" },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#ec4899", alignItems: "center", justifyContent: "center" },
  stepNumText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  stepDesc: { flex: 1, fontSize: 12, color: "#374151", lineHeight: 18, paddingTop: 4 },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
