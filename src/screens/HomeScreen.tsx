import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Dimensions, Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { CATEGORIES } from "./CategoryScreen";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SW } = Dimensions.get("window");
const GUIDE_W = SW * 0.90;
const IMAGE_SIZE = GUIDE_W * 0.62;

const GUIDE_CARDS = [
  { img: require("../../assets/img_pregnancy.png"), tab: "임신", desc: "영양제·체중 관리" },
  { img: require("../../assets/img_birth.png"), tab: "출산", desc: "카드·휴가·휴직" },
  { img: require("../../assets/img_parenting.png"), tab: "육아", desc: "장려금·정부혜택" },
];

const GOV_LINKS = [
  { icon: "📋", title: "출생신고", desc: "정부24 온라인 신고", url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=12700000045" },
  { icon: "🎁", title: "출산서비스 통합처리", desc: "첫만남이용권·양육수당 한번에", url: "https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001&tp_seq=01" },
  { icon: "🏥", title: "건강보험 피부양자 등록", desc: "신생아 피부양자 자격 취득 신고", url: "https://www.nhis.or.kr/nhis/minwon/pibuTotalMenu.do" },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const dismissBanner = () => setShowBanner(false);

  const currentCat = CATEGORIES[currentIndex];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* 웰컴 배너 */}
      {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>🌸</Text>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>마마케어에 오신 걸 환영해요</Text>
            <Text style={styles.bannerDesc}>임신부터 육아까지, 필요한 정보를 한곳에서</Text>
          </View>
          <TouchableOpacity onPress={dismissBanner} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.bannerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 카드 캐러셀 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.guide}
        snapToInterval={GUIDE_W + 12}
        decelerationRate="fast"
        disableIntervalMomentum
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (GUIDE_W + 12));
          setCurrentIndex(idx);
        }}
      >
        {GUIDE_CARDS.map((g) => (
          <View key={g.tab} style={[styles.guideItem, { width: GUIDE_W }]}>
            <Image source={g.img} style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }} resizeMode="contain" />
            <Text style={styles.guideTab}>{g.tab}</Text>
            <Text style={styles.guideDesc}>{g.desc}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 인디케이터 */}
      <View style={styles.dots}>
        {GUIDE_CARDS.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* 현재 카드에 해당하는 목록 */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{currentCat.emoji} {currentCat.label} 전체 목록</Text>
        <Text style={styles.sectionCount}>{currentCat.items.length}개</Text>
      </View>
      <View style={styles.list}>
        {currentCat.items.map((item, idx) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.row, idx < currentCat.items.length - 1 && styles.rowBorder]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSub}>{item.points[0]}</Text>
            </View>
            <Text style={[styles.rowArrow, { color: currentCat.accent }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 출산 카드일 때만 정부 서비스 표시 */}
      {currentIndex === 1 && (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>🏛️ 출산 후 정부 서비스</Text>
            <Text style={styles.sectionSub}>정부24 바로가기</Text>
          </View>
          <View style={styles.govList}>
            {GOV_LINKS.map((link) => (
              <TouchableOpacity
                key={link.url}
                style={styles.govCard}
                onPress={() => Linking.openURL(link.url)}
                activeOpacity={0.75}
              >
                <Text style={styles.govIcon}>{link.icon}</Text>
                <View style={styles.govText}>
                  <Text style={styles.govCardTitle}>{link.title}</Text>
                  <Text style={styles.govCardDesc}>{link.desc}</Text>
                </View>
                <Text style={styles.govArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* 면책 고지 */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ 모든 정보는 참고용이며, 의학적 결정은 반드시 전문의와 상담하세요.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 36 },

  banner: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff0f6", borderRadius: 18,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: "#fce7f3",
  },
  bannerEmoji: { fontSize: 30 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 3 },
  bannerDesc: { fontSize: 12, color: "#6b7280", lineHeight: 18 },
  bannerClose: { fontSize: 14, color: "#9ca3af", fontWeight: "600" },

  guide: { paddingHorizontal: 0, gap: 12 },
  guideItem: {
    backgroundColor: "#FFF0F3", borderRadius: 16,
    alignItems: "center", justifyContent: "center", gap: 8,
    borderWidth: 1, borderColor: "#e5e7eb",
    aspectRatio: 1, overflow: "hidden",
  },
  guideTab: { fontSize: 16, fontWeight: "700", color: "#111827" },
  guideDesc: { fontSize: 12, color: "#9ca3af", textAlign: "center" },

  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10, marginBottom: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#e5e7eb" },
  dotActive: { width: 18, backgroundColor: "#ec4899" },

  sectionRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  sectionCount: { fontSize: 12, color: "#9ca3af" },
  sectionSub: { fontSize: 12, color: "#9ca3af" },

  list: {
    backgroundColor: "#fff", borderRadius: 16,
    borderWidth: 1, borderColor: "#e5e7eb",
    overflow: "hidden", marginBottom: 20,
  },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  rowIcon: { fontSize: 20 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  rowSub: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  rowArrow: { fontSize: 20 },

  govList: { gap: 8, marginBottom: 16 },
  govCard: {
    backgroundColor: "#fff", borderRadius: 14,
    padding: 14, flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#e5e7eb", gap: 12,
  },
  govIcon: { fontSize: 22 },
  govText: { flex: 1 },
  govCardTitle: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 },
  govCardDesc: { fontSize: 11, color: "#9ca3af" },
  govArrow: { fontSize: 16, color: "#d1d5db" },

  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 14, padding: 14 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center", lineHeight: 18 },
});
