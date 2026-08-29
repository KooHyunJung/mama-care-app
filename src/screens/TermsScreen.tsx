import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

const SECTIONS = [
  { title: "제1조 (목적)", content: "본 약관은 마마케어가 제공하는 임신·출산·육아 관련 정보 서비스의 이용 조건 및 운영에 관한 사항을 규정함을 목적으로 합니다." },
  { title: "제2조 (서비스 내용)", content: "임신 주수 계산, 영양제 가이드, 체중 관리, 국민행복카드, 단축근무·출산휴가·육아휴직 안내, 출산 준비 체크리스트, 자녀장려금 등 정부 지원 정책 안내를 제공합니다." },
  { title: "제3조 (정보의 정확성)", content: "본 서비스에서 제공하는 모든 정보는 일반적인 참고 목적으로만 제공됩니다. 법령·제도·의학적 내용은 변경될 수 있으며, 정보의 완전성과 최신성을 보장하지 않습니다." },
  { title: "제4조 (광고)", content: "본 서비스는 Google AdSense를 통해 광고를 게재합니다. 광고 콘텐츠는 Google이 제공하며, 마마케어는 광고 내용에 대한 책임을 지지 않습니다." },
  { title: "제5조 (지적재산권)", content: "본 서비스에 게시된 콘텐츠의 저작권은 마마케어에 있으며, 무단 복제 및 배포를 금지합니다." },
  { title: "제6조 (면책 조항)", content: "서비스 내 정보 활용으로 발생한 손해, 서버 장애 등 불가항력으로 인한 서비스 중단, 제3자가 제공하는 광고를 통해 발생한 손해에 대해 책임을 지지 않습니다." },
  { title: "제7조 (약관의 변경)", content: "마마케어는 필요 시 본 약관을 변경할 수 있으며, 변경 후 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다." },
];

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📄 이용약관</Text>

      <Text style={styles.intro}>
        본 약관은 마마케어가 제공하는 모든 콘텐츠 및 서비스 이용에 관한 조건과 절차를 규정합니다.
      </Text>

      {SECTIONS.map((s) => (
        <View key={s.title} style={styles.card}>
          <Text style={styles.sectionTitle}>{s.title}</Text>
          <Text style={styles.sectionContent}>{s.content}</Text>
        </View>
      ))}

      <Text style={styles.footer}>시행일: 2026년 6월 7일</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  intro: { fontSize: 13, color: "#6b7280", lineHeight: 20, marginBottom: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#fce7f3" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 13, fontWeight: "bold", color: "#374151", marginBottom: 8 },
  sectionContent: { fontSize: 13, color: "#6b7280", lineHeight: 20 },
  footer: { fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 8, marginBottom: 16 },
});
