import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

const SECTIONS = [
  { title: "1. 수집하는 정보", content: "본 앱은 회원가입, 로그인 등 직접적인 개인정보를 수집하지 않습니다. 다만 광고 및 통계 목적으로 쿠키 및 익명 사용 데이터가 자동 수집될 수 있습니다." },
  { title: "2. 정보 이용 목적", content: "서비스 품질 개선, 맞춤형 광고 제공(Google AdSense), 오류 감지 및 기술 문제 해결에 활용됩니다." },
  { title: "3. Google AdSense", content: "본 앱은 Google AdSense를 통해 광고를 게재합니다. Google은 쿠키를 사용하여 맞춤형 광고를 표시할 수 있습니다." },
  { title: "4. 쿠키 정책", content: "광고 서비스 운영을 위해 쿠키를 사용합니다. 기기 설정에서 광고 추적을 제한할 수 있습니다." },
  { title: "5. 면책 고지", content: "본 앱의 모든 정보는 참고 목적으로만 제공됩니다. 의학적 진단·치료는 반드시 전문 의료인과 상담하시기 바랍니다." },
];

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>🔒 개인정보처리방침</Text>

      <Text style={styles.intro}>
        마마케어(이하 "본 앱")는 임산부와 예비 부모를 위한 정보 제공 서비스입니다.
        본 방침은 앱 이용 과정에서 수집되는 정보와 그 처리 방법을 안내합니다.
      </Text>

      {SECTIONS.map((s) => (
        <View key={s.title} style={styles.card}>
          <Text style={styles.sectionTitle}>{s.title}</Text>
          <Text style={styles.bodyText}>{s.content}</Text>
        </View>
      ))}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>6. 문의</Text>
        <Text style={styles.bodyText}>개인정보 처리 관련 문의사항은 아래 이메일로 연락해 주세요.</Text>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:ghj3160@gmail.com")}>
          <Text style={styles.link}>ghj3160@gmail.com</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>시행일: 2026년 4월 30일</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  scrollContent: { padding: 16, paddingBottom: 32 },
  intro: { fontSize: 13, color: "#6b7280", lineHeight: 20, marginBottom: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#fce7f3" },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 8 },
  bodyText: { fontSize: 13, color: "#6b7280", lineHeight: 20 },
  link: { fontSize: 13, color: "#ec4899", textDecorationLine: "underline", marginTop: 6 },
  footer: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8, marginBottom: 16 },
});
