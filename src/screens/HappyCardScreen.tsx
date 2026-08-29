import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function HappyCardScreen() {
  const BENEFITS = [
    { title: "임신·출산 의료비", amount: "100만원", note: "단태아 기준" },
    { title: "다태아 임신·출산", amount: "140만원", note: "쌍둥이 기준" },
    { title: "미숙아·선천성이상아", amount: "100만원 추가", note: "조건부" },
  ];

  const CARDS = [
    { name: "BC카드", desc: "롯데·하나·우리·NH농협 등" },
    { name: "국민카드", desc: "KB국민카드" },
    { name: "신한카드", desc: "신한카드" },
    { name: "삼성카드", desc: "삼성카드" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💳 국민행복카드</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💰 지원 혜택</Text>
        {BENEFITS.map((b) => (
          <View key={b.title} style={styles.benefitRow}>
            <View style={styles.benefitLeft}>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitNote}>{b.note}</Text>
            </View>
            <Text style={styles.benefitAmount}>{b.amount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📋 발급 방법</Text>
        {[
          { step: "1", title: "카드사 선택", desc: "BC·KB국민·신한·삼성카드 중 선택" },
          { step: "2", title: "온라인 신청", desc: "각 카드사 홈페이지 또는 앱에서 신청" },
          { step: "3", title: "바우처 등록", desc: "카드 수령 후 복지로(bokjiro.go.kr) 또는 정부24에서 등록" },
          { step: "4", title: "사용", desc: "산부인과·약국·한의원 등 지정 의료기관에서 사용" },
        ].map((item) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{item.step}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🏦 발급 카드사</Text>
        <View style={styles.cardsGrid}>
          {CARDS.map((c) => (
            <View key={c.name} style={styles.cardItem}>
              <Text style={styles.cardName}>{c.name}</Text>
              <Text style={styles.cardDesc}>{c.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.linkBtn}
        onPress={() => Linking.openURL("https://www.bokjiro.go.kr")}
      >
        <Text style={styles.linkBtnText}>🔗 복지로에서 바우처 등록하기</Text>
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>⚠️ 자세한 사항은 복지로(☎ 129) 또는 국민행복카드 고객센터에 문의하세요.</Text>
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
  benefitRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#fdf2f8" },
  benefitLeft: { flex: 1 },
  benefitTitle: { fontSize: 13, fontWeight: "600", color: "#1f2937" },
  benefitNote: { fontSize: 11, color: "#9ca3af" },
  benefitAmount: { fontSize: 16, fontWeight: "bold", color: "#ec4899" },
  stepRow: { flexDirection: "row", gap: 12, marginBottom: 14 },
  stepNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#ec4899", alignItems: "center", justifyContent: "center" },
  stepNumText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 13, fontWeight: "bold", color: "#1f2937", marginBottom: 2 },
  stepDesc: { fontSize: 12, color: "#6b7280", lineHeight: 18 },
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  cardItem: { width: "47%", backgroundColor: "#fdf2f8", borderRadius: 12, padding: 12 },
  cardName: { fontSize: 13, fontWeight: "bold", color: "#1f2937", marginBottom: 2 },
  cardDesc: { fontSize: 11, color: "#6b7280" },
  linkBtn: { backgroundColor: "#eff6ff", borderRadius: 16, padding: 16, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "#bfdbfe" },
  linkBtnText: { fontSize: 14, color: "#3b82f6", fontWeight: "600" },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
