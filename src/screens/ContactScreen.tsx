import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

export default function ContactScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📬 소개 및 문의</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🌸 마마케어란?</Text>
        <Text style={styles.desc}>
          마마케어는 임산부와 예비 부모를 위한 정보 제공 서비스입니다.
          임신 주수 계산, 영양제 가이드, 체중 관리, 국민행복카드, 단축근무·출산휴가·육아휴직 등
          꼭 필요한 정보를 한 곳에서 확인할 수 있도록 만들었습니다.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>✉️ 문의하기</Text>
        <Text style={styles.contactDesc}>서비스 이용 중 불편한 점, 정보 오류, 개선 제안 등 편하게 연락해 주세요.</Text>
        <TouchableOpacity
          style={styles.emailBtn}
          onPress={() => Linking.openURL("mailto:ghj3160@gmail.com")}
        >
          <Text style={styles.emailIcon}>✉️</Text>
          <Text style={styles.emailText}>ghj3160@gmail.com</Text>
        </TouchableOpacity>
        <Text style={styles.replyNote}>평일 기준 2~3일 내 답변 드리겠습니다.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>⚠️ 의학적 면책 고지</Text>
        <Text style={styles.desc}>
          본 앱의 모든 콘텐츠는 일반적인 참고 목적으로만 제공됩니다.
          의학적 진단, 처방, 치료는 반드시 전문 의료인과 상담하시기 바랍니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 10 },
  desc: { fontSize: 13, color: "#6b7280", lineHeight: 20 },
  contactDesc: { fontSize: 13, color: "#6b7280", marginBottom: 12, lineHeight: 20 },
  emailBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#fdf2f8", borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#fce7f3", marginBottom: 8,
  },
  emailIcon: { fontSize: 20 },
  emailText: { fontSize: 14, color: "#ec4899", fontWeight: "600", textDecorationLine: "underline" },
  replyNote: { fontSize: 11, color: "#9ca3af" },
});
