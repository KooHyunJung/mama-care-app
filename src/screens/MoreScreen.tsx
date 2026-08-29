import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MENU_ITEMS = [
  { screen: "Nutrition" as const, icon: "💊", title: "주차별 영양제 가이드" },
  { screen: "WeightTracker" as const, icon: "⚖️", title: "주차별 몸무게 확인" },
  { screen: "HappyCard" as const, icon: "💳", title: "국민행복카드" },
  { screen: "WorkRights" as const, icon: "💼", title: "단축근무 안내" },
  { screen: "MaternityLeave" as const, icon: "👶", title: "출산휴가 안내" },
  { screen: "ParentalLeave" as const, icon: "🍼", title: "육아휴직 안내" },
  { screen: "ChildSubsidy" as const, icon: "💰", title: "자녀장려금 안내" },
];

const INFO_ITEMS = [
  { screen: "Contact" as const, icon: "📬", title: "문의하기" },
  { screen: "Privacy" as const, icon: "🔒", title: "개인정보처리방침" },
  { screen: "Terms" as const, icon: "📄", title: "이용약관" },
];

export default function MoreScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>🌸 마마케어</Text>

      <Text style={styles.sectionTitle}>주요 기능</Text>
      <View style={styles.section}>
        {MENU_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.row, idx < MENU_ITEMS.length - 1 && styles.rowBorder]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>정보</Text>
      <View style={styles.section}>
        {INFO_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.row, idx < INFO_ITEMS.length - 1 && styles.rowBorder]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.footer}>© 2026 마마케어</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 20, fontWeight: "bold", color: "#ec4899", marginBottom: 20, marginTop: 8 },
  sectionTitle: { fontSize: 12, fontWeight: "600", color: "#9ca3af", marginBottom: 8, marginLeft: 4 },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fce7f3",
    marginBottom: 20,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  rowIcon: { fontSize: 20 },
  rowTitle: { flex: 1, fontSize: 14, color: "#1f2937" },
  rowArrow: { fontSize: 20, color: "#d1d5db" },
  footer: { textAlign: "center", fontSize: 12, color: "#d1d5db", marginTop: 8 },
});
