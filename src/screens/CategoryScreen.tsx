import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SW } = Dimensions.get("window");
const CARD_W = SW * 0.72;

export const CATEGORIES = [
  {
    id: "pregnancy",
    label: "임신 정보",
    emoji: "🤰",
    accent: "#ec4899",
    bg: "#fff0f6",
    items: [
      {
        screen: "Nutrition" as const,
        icon: "💊", title: "주차별 영양제 가이드", tag: "영양 관리",
        points: ["엽산 · 철분 · 칼슘 · 오메가3", "임신 시기별 맞춤 안내"],
      },
      {
        screen: "WeightTracker" as const,
        icon: "⚖️", title: "주차별 몸무게 확인", tag: "체중 관리",
        points: ["BMI 기반 권장 증가량 계산", "저체중 / 정상 / 과체중 기준 제공"],
      },
    ],
  },
  {
    id: "birth",
    label: "출산 지원",
    emoji: "👶",
    accent: "#8b5cf6",
    bg: "#f5f3ff",
    items: [
      {
        screen: "HappyCard" as const,
        icon: "💳", title: "국민행복카드", tag: "바우처",
        points: ["임신·출산 바우처 100만원", "국민·롯데·삼성카드 발급"],
      },
      {
        screen: "WorkRights" as const,
        icon: "💼", title: "단축근무 안내", tag: "직장 권리",
        points: ["하루 최대 2시간 단축", "급여 삭감 없음 (법적 보장)"],
      },
      {
        screen: "MaternityLeave" as const,
        icon: "👶", title: "출산휴가 안내", tag: "휴가",
        points: ["총 90일 (다태아 120일)", "통상임금 100% 지급"],
      },
      {
        screen: "ParentalLeave" as const,
        icon: "🍼", title: "육아휴직 안내", tag: "휴직",
        points: ["자녀 1인당 최대 1년", "6+6 제도 상한 450만원"],
      },
    ],
  },
  {
    id: "benefit",
    label: "육아 혜택",
    emoji: "💰",
    accent: "#10b981",
    bg: "#ecfdf5",
    items: [
      {
        screen: "ChildSubsidy" as const,
        icon: "💰", title: "자녀장려금 안내", tag: "정부 지원",
        points: ["자녀 1인당 최대 100만원", "매년 5월 홈택스 신청"],
      },
    ],
  },
];

const GOV_LINKS = [
  { icon: "📋", title: "출생신고", desc: "정부24 온라인 신고", url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=12700000045" },
  { icon: "🎁", title: "출산서비스 통합처리", desc: "첫만남이용권·양육수당 한번에", url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001&tp_seq=01" },
  { icon: "🏥", title: "건강보험 피부양자 등록", desc: "신생아 피부양자 자격 취득 신고", url: "https://www.nhis.or.kr/nhis/minwon/pibuTotalMenu.do" },
];

interface Props {
  categoryIndex: number;
}

export default function CategoryScreen({ categoryIndex }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const cat = CATEGORIES[categoryIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>{cat.emoji}</Text>
        <Text style={styles.headerTitle}>{cat.label}</Text>
        <Text style={styles.headerCount}>{cat.items.length}개 항목</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
        decelerationRate="fast"
        snapToInterval={CARD_W + 12}
        snapToAlignment="start"
      >
        {cat.items.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.card, { width: CARD_W, backgroundColor: cat.bg, borderColor: cat.accent + "33" }]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.85}
          >
            <View style={[styles.tag, { backgroundColor: cat.accent }]}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.points}>
              {item.points.map((p, i) => (
                <Text key={i} style={styles.point}>· {p}</Text>
              ))}
            </View>
            <View style={[styles.btn, { backgroundColor: cat.accent }]}>
              <Text style={styles.btnText}>자세히 보기 →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 전체 목록 */}
      <Text style={styles.listTitle}>전체 목록</Text>
      <View style={styles.list}>
        {cat.items.map((item, idx) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.row, idx < cat.items.length - 1 && styles.rowBorder]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowPoints}>{item.points[0]}</Text>
            </View>
            <Text style={[styles.rowArrow, { color: cat.accent }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 출산 후 정부 서비스 (출산 탭에만 표시) */}
      {categoryIndex === 1 && (
        <View style={styles.govSection}>
          <Text style={styles.govSectionTitle}>🏛️ 출산 후 정부 서비스</Text>
          <Text style={styles.govSectionSub}>출산 후 꼭 해야 할 신청을 한번에!</Text>
          {GOV_LINKS.map((link) => (
            <TouchableOpacity
              key={link.url}
              style={styles.govCard}
              onPress={() => Linking.openURL(link.url)}
              activeOpacity={0.75}
            >
              <Text style={styles.govIcon}>{link.icon}</Text>
              <View style={styles.govText}>
                <Text style={styles.govTitle}>{link.title}</Text>
                <Text style={styles.govDesc}>{link.desc}</Text>
              </View>
              <Text style={styles.govArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { paddingBottom: 36 },

  header: { flexDirection: "row", alignItems: "center", gap: 8, padding: 16, paddingBottom: 12 },
  headerEmoji: { fontSize: 22 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827", flex: 1 },
  headerCount: { fontSize: 12, color: "#9ca3af" },

  carousel: { paddingHorizontal: 16, gap: 12, paddingBottom: 8 },
  card: { borderRadius: 18, padding: 20, borderWidth: 1.5 },
  tag: { alignSelf: "flex-start", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 14 },
  tagText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  cardIcon: { fontSize: 36, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  points: { gap: 4, marginBottom: 20 },
  point: { fontSize: 13, color: "#4b5563", lineHeight: 20 },
  btn: { borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  btnText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  listTitle: { fontSize: 13, fontWeight: "600", color: "#9ca3af", paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  list: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e5e7eb", overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  rowIcon: { fontSize: 20 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rowPoints: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  rowArrow: { fontSize: 20 },

  govSection: { margin: 16, marginTop: 20, backgroundColor: "#eff6ff", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#dbeafe", gap: 8 },
  govSectionTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  govSectionSub: { fontSize: 11, color: "#6b7280", marginBottom: 4 },
  govCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#bfdbfe", gap: 10 },
  govIcon: { fontSize: 22 },
  govText: { flex: 1 },
  govTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  govDesc: { fontSize: 11, color: "#6b7280" },
  govArrow: { fontSize: 16, color: "#d1d5db" },
});
