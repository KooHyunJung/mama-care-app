import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";

type Item = { id: string; label: string; note?: string };
type Category = { title: string; emoji: string; items: Item[] };

const MOM_ITEMS: Category[] = [
  {
    title: "입원 서류", emoji: "📋",
    items: [
      { id: "d1", label: "산모수첩" },
      { id: "d2", label: "신분증" },
      { id: "d3", label: "진료카드" },
      { id: "d4", label: "국민건강보험증" },
      { id: "d5", label: "국민행복카드" },
      { id: "d6", label: "입원 보증금용 현금 & 카드" },
    ],
  },
  {
    title: "산모 의류", emoji: "👗",
    items: [
      { id: "m1", label: "수유 브라 2~3개" },
      { id: "m2", label: "맘스안심팬티 또는 산후 팬티 3~5개" },
      { id: "m3", label: "입는 오버나이트" },
      { id: "m4", label: "산모 패드" },
      { id: "m5", label: "수유 가운 또는 긴 잠옷" },
      { id: "m6", label: "슬리퍼" },
    ],
  },
  {
    title: "산모 세면·위생", emoji: "🧴",
    items: [
      { id: "w1", label: "세안 용품" },
      { id: "w2", label: "기초화장품 (소용량)" },
      { id: "w3", label: "샴푸 & 컨디셔너" },
      { id: "w4", label: "두피 케어", note: "산후 탈모 대비" },
      { id: "w5", label: "칫솔 & 치약" },
      { id: "w6", label: "텀블러 & 구부러지는 빨대" },
    ],
  },
  {
    title: "산모 영양", emoji: "💊",
    items: [
      { id: "n1", label: "산후 영양제 (철분·오메가3·유산균)" },
      { id: "n2", label: "미역국 재료 또는 즉석 미역국" },
    ],
  },
];

const BABY_ITEMS: Category[] = [
  {
    title: "의류", emoji: "👕",
    items: [
      { id: "b1", label: "배냇저고리 3~5벌" },
      { id: "b2", label: "손싸개 & 발싸개" },
      { id: "b3", label: "신생아 모자" },
      { id: "b4", label: "속싸개 2~3장" },
    ],
  },
  {
    title: "위생·수유", emoji: "🍼",
    items: [
      { id: "c1", label: "기저귀 (신생아용)" },
      { id: "c2", label: "물티슈" },
      { id: "c3", label: "신생아 배꼽 소독 용품" },
      { id: "c4", label: "수유 패드" },
      { id: "c5", label: "젖병 & 젖꼭지" },
    ],
  },
];

type Tab = "산모" | "아기";

export default function BirthPrepScreen() {
  const [tab, setTab] = useState<Tab>("산모");
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = tab === "산모" ? MOM_ITEMS : BABY_ITEMS;
  const allIds = categories.flatMap((c) => c.items.map((i) => i.id));
  const checkedCount = allIds.filter((id) => checked.has(id)).length;
  const progress = allIds.length > 0 ? checkedCount / allIds.length : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🎒 출산 가방 체크리스트</Text>

      {/* 탭 */}
      <View style={styles.tabs}>
        {(["산모", "아기"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 진행률 */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>완료</Text>
          <Text style={styles.progressCount}>{checkedCount} / {allIds.length}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* 카테고리 */}
      {categories.map((cat) => (
        <View key={cat.title} style={styles.card}>
          <Text style={styles.catTitle}>{cat.emoji} {cat.title}</Text>
          {cat.items.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.itemRow, idx < cat.items.length - 1 && styles.itemBorder]}
              onPress={() => toggle(item.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, checked.has(item.id) && styles.checkboxChecked]}>
                {checked.has(item.id) && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.itemTextWrap}>
                <Text style={[styles.itemLabel, checked.has(item.id) && styles.itemLabelChecked]}>
                  {item.label}
                </Text>
                {item.note && <Text style={styles.itemNote}>{item.note}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>💬 출산 준비 문의: 담당 산부인과 또는 고용노동부 ☎ 1350</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tab: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#fce7f3", alignItems: "center",
  },
  tabActive: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  tabText: { fontSize: 14, color: "#6b7280" },
  tabTextActive: { color: "#fff", fontWeight: "600" },
  progressCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3",
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { fontSize: 13, color: "#6b7280" },
  progressCount: { fontSize: 13, fontWeight: "bold", color: "#ec4899" },
  progressBar: { height: 8, backgroundColor: "#fce7f3", borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: "#ec4899", borderRadius: 4 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: "#fce7f3",
  },
  catTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: "#fce7f3" },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: "#fce7f3", alignItems: "center", justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#ec4899", borderColor: "#ec4899" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  itemTextWrap: { flex: 1 },
  itemLabel: { fontSize: 13, color: "#374151" },
  itemLabelChecked: { color: "#9ca3af", textDecorationLine: "line-through" },
  itemNote: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12, marginTop: 4 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
