import { useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { supabase } from "../lib/supabase";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError("이메일 또는 비밀번호가 올바르지 않아요.");
    else navigation.goBack();
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>🌸</Text>
        <Text style={styles.title}>마마케어</Text>
        <Text style={styles.sub}>임신부터 육아까지{"\n"}필요한 정보를 한곳에서</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>로그인</Text>

          <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={(v) => { setEmail(v); setError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={(v) => { setPassword(v); setError(""); }}
            secureTextEntry
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.disabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.loginText}>{loading ? "로그인 중..." : "로그인"}</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} disabled activeOpacity={0.85}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Google로 계속하기 (준비 중)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.signupLink}>
          <Text style={styles.signupText}>
            계정이 없으신가요? <Text style={styles.signupBold}>회원가입</Text>
          </Text>
        </TouchableOpacity>

        <Text style={styles.notice}>
          로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff0f6" },
  scroll: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emoji: { fontSize: 52, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: "800", color: "#ec4899", marginBottom: 8 },
  sub: { fontSize: 14, color: "#6b7280", textAlign: "center", lineHeight: 22, marginBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 4 },

  input: {
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
  },
  error: { fontSize: 12, color: "#ef4444", textAlign: "center" },

  loginBtn: {
    backgroundColor: "#ec4899",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  loginText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  disabled: { opacity: 0.5 },

  divider: { flexDirection: "row", alignItems: "center", gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#f3f4f6" },
  dividerText: { fontSize: 12, color: "#9ca3af" },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 14,
    gap: 10,
    opacity: 0.5,
  },
  googleIcon: { fontSize: 17, fontWeight: "800", color: "#4285F4" },
  googleText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },

  signupLink: { marginBottom: 16 },
  signupText: { fontSize: 13, color: "#6b7280" },
  signupBold: { color: "#ec4899", fontWeight: "700" },

  notice: { fontSize: 11, color: "#d1d5db", textAlign: "center", lineHeight: 18 },
});
