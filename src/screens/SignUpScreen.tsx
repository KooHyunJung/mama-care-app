import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STEPS = ["계정 생성", "프로필 입력", "아이 정보"];

export default function SignUpScreen() {
  const navigation = useNavigation<Nav>();
  const { refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [childName, setChildName] = useState("");
  const [childGender, setChildGender] = useState<"male" | "female" | "unknown">("unknown");
  const [childType, setChildType] = useState<"pregnancy" | "birth">("pregnancy");
  const [childDate, setChildDate] = useState("");

  const createAccount = async () => {
    if (!email.trim()) { setError("이메일을 입력해주세요."); return; }
    if (password.length < 6) { setError("비밀번호는 6자리 이상이어야 해요."); return; }
    if (password !== passwordConfirm) { setError("비밀번호가 일치하지 않아요."); return; }
    setLoading(true); setError("");
    const { error: e } = await supabase.auth.signUp({ email, password });
    if (e) setError(e.message);
    else setStep(2);
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!name.trim()) { setError("이름을 입력해주세요."); return; }
    if (!nickname.trim()) { setError("닉네임을 입력해주세요."); return; }
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("오류가 발생했어요."); setLoading(false); return; }
    const { error: e } = await supabase.from("profiles").update({ name, nickname }).eq("id", user.id);
    if (e) setError(e.message);
    else setStep(3);
    setLoading(false);
  };

  const saveChildAndFinish = async () => {
    if (!childName.trim()) { setError("아이 이름 또는 태명을 입력해주세요."); return; }
    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("오류가 발생했어요."); setLoading(false); return; }
    const { error: e } = await supabase.from("children").insert({
      user_id: user.id,
      name: childName,
      gender: childGender,
      type: childType,
      date: childDate || null,
    });
    if (e) { setError(e.message); setLoading(false); return; }
    await refreshProfile();
    navigation.popToTop();
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.progressRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.progressDot, i + 1 <= step && styles.progressDotActive]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>{step} / {STEPS.length} — {STEPS[step - 1]}</Text>

        <View style={styles.card}>
          {step === 1 && (
            <>
              <Text style={styles.cardTitle}>계정 만들기</Text>
              <TextInput
                style={styles.input} placeholder="이메일" placeholderTextColor="#9ca3af"
                value={email} onChangeText={(v) => { setEmail(v); setError(""); }}
                keyboardType="email-address" autoCapitalize="none"
              />
              <TextInput
                style={styles.input} placeholder="비밀번호 (6자리 이상)" placeholderTextColor="#9ca3af"
                value={password} onChangeText={(v) => { setPassword(v); setError(""); }}
                secureTextEntry
              />
              <TextInput
                style={styles.input} placeholder="비밀번호 확인" placeholderTextColor="#9ca3af"
                value={passwordConfirm} onChangeText={(v) => { setPasswordConfirm(v); setError(""); }}
                secureTextEntry
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={[styles.btn, loading && styles.disabled]} onPress={createAccount} disabled={loading}>
                <Text style={styles.btnText}>{loading ? "처리 중..." : "다음"}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.cardTitle}>프로필 입력</Text>
              <TextInput
                style={styles.input} placeholder="이름" placeholderTextColor="#9ca3af"
                value={name} onChangeText={(v) => { setName(v); setError(""); }}
              />
              <TextInput
                style={styles.input} placeholder="닉네임" placeholderTextColor="#9ca3af"
                value={nickname} onChangeText={(v) => { setNickname(v); setError(""); }}
              />
              {!!error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={[styles.btn, loading && styles.disabled]} onPress={saveProfile} disabled={loading}>
                <Text style={styles.btnText}>{loading ? "저장 중..." : "다음"}</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>아이 정보</Text>
              <TextInput
                style={styles.input} placeholder="아이 이름 또는 태명" placeholderTextColor="#9ca3af"
                value={childName} onChangeText={(v) => { setChildName(v); setError(""); }}
              />

              <Text style={styles.label}>성별</Text>
              <View style={styles.toggleRow}>
                {(["male", "female", "unknown"] as const).map((g) => (
                  <TouchableOpacity
                    key={g} style={[styles.toggle, childGender === g && styles.toggleActive]}
                    onPress={() => setChildGender(g)}
                  >
                    <Text style={[styles.toggleText, childGender === g && styles.toggleTextActive]}>
                      {g === "male" ? "남아" : g === "female" ? "여아" : "미정"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>구분</Text>
              <View style={styles.toggleRow}>
                {(["pregnancy", "birth"] as const).map((t) => (
                  <TouchableOpacity
                    key={t} style={[styles.toggle, childType === t && styles.toggleActive]}
                    onPress={() => setChildType(t)}
                  >
                    <Text style={[styles.toggleText, childType === t && styles.toggleTextActive]}>
                      {t === "pregnancy" ? "임신 중" : "출산 완료"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder={childType === "pregnancy" ? "출산 예정일 (YYYY-MM-DD)" : "출산일 (YYYY-MM-DD)"}
                placeholderTextColor="#9ca3af"
                value={childDate} onChangeText={(v) => { setChildDate(v); setError(""); }}
                keyboardType="numbers-and-punctuation"
              />

              {!!error && <Text style={styles.error}>{error}</Text>}
              <TouchableOpacity style={[styles.btn, loading && styles.disabled]} onPress={saveChildAndFinish} disabled={loading}>
                <Text style={styles.btnText}>{loading ? "완료 중..." : "가입 완료"}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6" },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 40 },

  progressRow: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 8 },
  progressDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fce7f3" },
  progressDotActive: { backgroundColor: "#ec4899", width: 24 },
  stepLabel: { textAlign: "center", fontSize: 12, color: "#9ca3af", marginBottom: 24 },

  card: {
    backgroundColor: "#fff", borderRadius: 24, padding: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 8, gap: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 2 },

  input: {
    borderWidth: 1.5, borderColor: "#e5e7eb", borderRadius: 12,
    paddingVertical: 13, paddingHorizontal: 16, fontSize: 15, color: "#111827",
  },
  error: { fontSize: 12, color: "#ef4444", textAlign: "center" },

  btn: { backgroundColor: "#ec4899", borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  btnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  disabled: { opacity: 0.5 },

  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  toggleRow: { flexDirection: "row", gap: 8 },
  toggle: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: "#e5e7eb", alignItems: "center",
  },
  toggleActive: { borderColor: "#ec4899", backgroundColor: "#fff0f6" },
  toggleText: { fontSize: 13, color: "#9ca3af", fontWeight: "600" },
  toggleTextActive: { color: "#ec4899" },
});
