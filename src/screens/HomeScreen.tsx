import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const FEATURES = [
  { screen: "Nutrition" as const, icon: "💊", title: "주차별 영양제 가이드", desc: "임신 시기별 영양제를 쉽게 확인", bg: "#fff1f2" },
  { screen: "WeightTracker" as const, icon: "⚖️", title: "주차별 몸무게 확인", desc: "BMI 기반 권장 체중 증가량 확인", bg: "#fdf2f8" },
  { screen: "HappyCard" as const, icon: "💳", title: "국민행복카드", desc: "발급 방법, 바우처 등록 안내", bg: "#fdf2f8" },
  { screen: "WorkRights" as const, icon: "💼", title: "단축근무 안내", desc: "신청 시기·방법·급여 보장 총정리", bg: "#faf5ff" },
  { screen: "MaternityLeave" as const, icon: "👶", title: "출산휴가 안내", desc: "기간·급여·육아휴직 연계 정보", bg: "#fff1f2" },
  { screen: "ParentalLeave" as const, icon: "🍼", title: "육아휴직 안내", desc: "기간·급여·3+3제도 총정리", bg: "#faf5ff" },
  { screen: "ChildSubsidy" as const, icon: "💰", title: "자녀장려금 안내", desc: "2026년 지원 대상·금액·신청 방법", bg: "#fefce8" },
];

const GOV_LINKS = [
  {
    icon: "📋",
    title: "출생신고",
    desc: "정부24 온라인 신고",
    url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=12700000045",
  },
  {
    icon: "🎁",
    title: "출산서비스 통합처리",
    desc: "첫만남이용권·양육수당 등 한번에",
    url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001&tp_seq=01",
  },
  {
    icon: "🏥",
    title: "건강보험 피부양자 등록",
    desc: "신생아 피부양자 자격 취득 신고",
    url: "https://www.nhis.or.kr/nhis/minwon/pibuTotalMenu.do",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 히어로 */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🌸</Text>
        <Text style={styles.heroTitle}>마마케어</Text>
        <Text style={styles.heroDesc}>임산부에게 필요한 모든 정보를 한곳에서</Text>
      </View>

      {/* 기능 카드 */}
      <View style={styles.grid}>
        {FEATURES.map((f) => (
          <TouchableOpacity
            key={f.screen}
            style={[styles.card, { backgroundColor: f.bg }]}
            onPress={() => navigation.navigate(f.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardIcon}>{f.icon}</Text>
            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 출산 후 정부 서비스 */}
      <View style={styles.govSection}>
        <Text style={styles.govTitle}>🏛️ 출산 후 정부 서비스 바로가기</Text>
        <Text style={styles.govSubtitle}>출산 후 꼭 해야 할 신청, 정부24에서 한번에!</Text>
        {GOV_LINKS.map((link) => (
          <TouchableOpacity
            key={link.url}
            style={styles.govCard}
            onPress={() => Linking.openURL(link.url)}
            activeOpacity={0.7}
          >
            <Text style={styles.govIcon}>{link.icon}</Text>
            <View style={styles.govTextWrap}>
              <Text style={styles.govCardTitle}>{link.title}</Text>
              <Text style={styles.govCardDesc}>{link.desc}</Text>
            </View>
            <Text style={styles.govArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 면책 고지 */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ 이 앱의 모든 정보는 참고용이며, 의학적 결정은 반드시 전문의와 상담하세요.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  hero: { alignItems: "center", marginBottom: 24, paddingTop: 16 },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 6 },
  heroDesc: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 24 },
  card: {
    width: "47%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#fce7f3",
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 13, fontWeight: "bold", color: "#1f2937", marginBottom: 4 },
  cardDesc: { fontSize: 11, color: "#6b7280", lineHeight: 16 },
  govSection: {
    backgroundColor: "#eff6ff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#dbeafe",
    marginBottom: 16,
    gap: 8,
  },
  govTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937" },
  govSubtitle: { fontSize: 11, color: "#6b7280", marginBottom: 4 },
  govCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    gap: 10,
  },
  govIcon: { fontSize: 22 },
  govTextWrap: { flex: 1 },
  govCardTitle: { fontSize: 13, fontWeight: "bold", color: "#1f2937" },
  govCardDesc: { fontSize: 11, color: "#6b7280" },
  govArrow: { fontSize: 16, color: "#d1d5db" },
  disclaimer: {
    backgroundColor: "#fce7f3",
    borderRadius: 16,
    padding: 16,
  },
  disclaimerText: { fontSize: 12, color: "#9d174d", textAlign: "center", lineHeight: 18 },
});
