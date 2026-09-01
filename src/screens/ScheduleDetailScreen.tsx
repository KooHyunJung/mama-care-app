import { useState, useLayoutEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Alert, Linking, KeyboardAvoidingView, Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "ScheduleDetail">;

const COLORS = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#f97316", "#14b8a6"];
const EMOJIS = [
  "🏥","👶","🍼","💊","📋","🎉","💉","🩺","🩸","❤️",
  "🌸","🎀","🛒","📝","✈️","🎂","🎁","🏃","🍕","☕",
  "🌙","⭐","🌈","🦋","🐣","🧸","🎵","📸","🌺","💐",
];

function openNaverMap(location: string) {
  const query = encodeURIComponent(location);
  const naverUrl = `nmap://search?query=${query}&appname=com.mamacare`;
  const webUrl = `https://map.naver.com/v5/search/${query}`;
  Linking.canOpenURL(naverUrl).then(supported => {
    Linking.openURL(supported ? naverUrl : webUrl);
  });
}

export default function ScheduleDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const ev = route.params;

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(ev.title || "");
  const [editEmoji, setEditEmoji] = useState(ev.emoji || "");
  const [editColor, setEditColor] = useState(ev.color);
  const [editMemo, setEditMemo] = useState(ev.memo || "");
  const [editLocation, setEditLocation] = useState(ev.location || "");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    if (ev.isAuto || editMode) {
      navigation.setOptions({ headerRight: undefined });
      return;
    }
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", gap: 16, paddingRight: 4 }}>
          <TouchableOpacity onPress={() => setEditMode(true)} style={styles.iconBtn}>
            <Text style={styles.iconText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconBtn}>
            <Text style={styles.iconText}>🗑</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [editMode, ev.isAuto]);

  const saveEdit = async () => {
    if (!editTitle.trim() && !editEmoji) {
      Alert.alert("제목 또는 이모지를 입력해주세요."); return;
    }
    setLoading(true);
    await supabase.from("schedules").update({
      title: editTitle.trim() || null,
      emoji: editEmoji || null,
      color: editColor,
      memo: editMemo.trim() || null,
      location: editLocation.trim() || null,
    }).eq("id", ev.id);
    setLoading(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert("일정 삭제", "삭제하시겠어요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제", style: "destructive", onPress: async () => {
          await supabase.from("schedules").delete().eq("id", ev.id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (editMode) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.sectionLabel}>이모지 (선택)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
            {EMOJIS.map(em => (
              <TouchableOpacity
                key={em}
                style={[styles.emojiBtn, editEmoji === em && styles.emojiBtnActive]}
                onPress={() => setEditEmoji(editEmoji === em ? "" : em)}
              >
                <Text style={{ fontSize: 22 }}>{em}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>제목 (선택)</Text>
          <TextInput
            style={styles.input} placeholder="제목 입력" placeholderTextColor="#9ca3af"
            value={editTitle} onChangeText={setEditTitle}
          />

          <Text style={styles.sectionLabel}>색상</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, editColor === c && styles.colorDotActive]}
                onPress={() => setEditColor(c)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>장소 (선택)</Text>
          <TextInput
            style={styles.input} placeholder="병원명, 장소 등" placeholderTextColor="#9ca3af"
            value={editLocation} onChangeText={setEditLocation}
          />

          <Text style={styles.sectionLabel}>메모 (선택)</Text>
          <TextInput
            style={[styles.input, { height: 88 }]} placeholder="메모 입력" placeholderTextColor="#9ca3af"
            value={editMemo} onChangeText={setEditMemo} multiline
          />

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
              <Text style={styles.cancelText}>뒤로</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.5 }]} onPress={saveEdit} disabled={loading}>
              <Text style={styles.saveText}>{loading ? "저장 중..." : "저장"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      {/* 색상 배너 */}
      <View style={[styles.colorBanner, { backgroundColor: ev.color + "18" }]}>
        <View style={[styles.colorBar, { backgroundColor: ev.color }]} />
        <View style={{ flex: 1 }}>
          {ev.emoji ? <Text style={styles.emoji}>{ev.emoji}</Text> : null}
          <Text style={styles.title}>{ev.title || "(제목 없음)"}</Text>
          <Text style={styles.date}>{ev.date}</Text>
        </View>
        {ev.isAuto && (
          <View style={styles.autoBadge}>
            <Text style={styles.autoBadgeText}>검진</Text>
          </View>
        )}
      </View>

      {/* 장소 */}
      {ev.location ? (
        <TouchableOpacity style={styles.infoRow} onPress={() => openNaverMap(ev.location!)}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>장소</Text>
            <Text style={[styles.infoValue, styles.locationLink]}>{ev.location}</Text>
          </View>
          <Text style={styles.naverBadge}>네이버 지도 →</Text>
        </TouchableOpacity>
      ) : null}

      {/* 메모 */}
      {ev.memo ? (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📝</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>메모</Text>
            <Text style={styles.infoValue}>{ev.memo}</Text>
          </View>
        </View>
      ) : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scroll: { padding: 16, gap: 12 },

  colorBanner: {
    flexDirection: "row", alignItems: "center", borderRadius: 16,
    padding: 16, gap: 12, overflow: "hidden",
  },
  colorBar: { width: 4, alignSelf: "stretch", borderRadius: 2 },
  emoji: { fontSize: 28, marginBottom: 4 },
  title: { fontSize: 18, fontWeight: "700", color: "#111827" },
  date: { fontSize: 12, color: "#9ca3af", marginTop: 4 },
  autoBadge: { backgroundColor: "#f3f4f6", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  autoBadgeText: { fontSize: 11, color: "#9ca3af", fontWeight: "600" },

  infoRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 12,
    backgroundColor: "#fff", borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: "#f3f4f6",
  },
  infoIcon: { fontSize: 20, marginTop: 2 },
  infoLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "600", marginBottom: 4 },
  infoValue: { fontSize: 14, color: "#111827", lineHeight: 20 },
  locationLink: { color: "#3b82f6" },
  naverBadge: { fontSize: 11, color: "#03C75A", fontWeight: "700", alignSelf: "center" },

  sectionLabel: { fontSize: 12, fontWeight: "600", color: "#6b7280", marginTop: 8 },
  emojiRow: { flexDirection: "row", marginVertical: 4 },
  emojiBtn: { padding: 6, borderRadius: 8, marginRight: 6, borderWidth: 2, borderColor: "transparent" },
  emojiBtnActive: { borderColor: "#ec4899", backgroundColor: "#fff0f6" },
  input: { borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#111827", backgroundColor: "#fff" },
  colorRow: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginVertical: 4 },
  colorDot: { width: 28, height: 28, borderRadius: 14 },
  colorDotActive: { borderWidth: 3, borderColor: "#111827" },

  btnRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  saveBtn: { flex: 1, backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  saveText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  iconBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  iconText: { fontSize: 15 },
});
