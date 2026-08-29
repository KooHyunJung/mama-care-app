import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function MaternityLeaveScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>👶 출산휴가 안내</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 기본 정보</Text>
        {[
          { label: "휴가 기간", value: "출산 전후 90일 (다태아 120일)" },
          { label: "출산 전 사용", value: "최대 44일 (다태아 59일)" },
          { label: "급여 지원", value: "고용보험에서 최대 90일 지급" },
          { label: "상한액", value: "월 최대 210만원" },
        ].map((item) => (
          <View key={item.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📌 신청 절차</Text>
        {[
          { step: "1", title: "출산 전 회사 통보", desc: "출산 예정일을 미리 회사에 알리고 휴가 시작일 협의" },
          { step: "2", title: "출산휴가 신청서 제출", desc: "출산 전 또는 출산 후 인사팀에 출산휴가 신청서 제출" },
          { step: "3", title: "고용보험 급여 신청", desc: "고용24에서 '출산전후휴가 급여' 신청", link: "https://www.work24.go.kr/cm/main.do?topArea=EBM01" },
          { step: "4", title: "서류 제출", desc: "출산(예정)일 확인 서류, 통상임금 확인 서류, 출산전후휴가 확인서 제출" },
        ].map((item) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
              {item.link && (
                <TouchableOpacity onPress={() => Linking.openURL(item.link!)}>
                  <Text style={styles.link}>고용24 바로가기 →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightText}>
          💡 출산휴가 종료 후 바로 <Text style={styles.bold}>육아휴직</Text>으로 연계 가능해요!
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👨 배우자 출산휴가</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>기간</Text>
          <Text style={styles.infoValue}>20일 (유급)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>사용 기한</Text>
          <Text style={styles.infoValue}>출산일로부터 120일 이내</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>분할 사용</Text>
          <Text style={styles.infoValue}>최대 4회 분할 가능</Text>
        </View>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          💬 문의: 고용노동부 ☎ 1350 | 고용보험 ☎ 1588-0075
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.work24.go.kr/cm/main.do?topArea=EBM01")}>
          <Text style={styles.disclaimerLink}>고용24 바로가기</Text>
        </TouchableOpacity>
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
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#fdf2f8" },
  infoLabel: { fontSize: 13, color: "#6b7280" },
  infoValue: { fontSize: 13, fontWeight: "600", color: "#1f2937", flex: 1, textAlign: "right" },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#ec4899", alignItems: "center", justifyContent: "center" },
  stepNumText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 13, fontWeight: "bold", color: "#1f2937", marginBottom: 2 },
  stepDesc: { fontSize: 12, color: "#6b7280", lineHeight: 18 },
  link: { fontSize: 12, color: "#ec4899", marginTop: 4, textDecorationLine: "underline" },
  highlightCard: { backgroundColor: "#fdf2f8", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  highlightText: { fontSize: 13, color: "#374151", textAlign: "center", lineHeight: 20 },
  bold: { fontWeight: "bold", color: "#ec4899" },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12, alignItems: "center", gap: 6 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
  disclaimerLink: { fontSize: 12, color: "#ec4899", textDecorationLine: "underline" },
});
