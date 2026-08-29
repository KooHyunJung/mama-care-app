import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from "react-native";

type BMICategory = "저체중" | "정상" | "과체중" | "비만";

function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return "저체중";
  if (bmi < 23) return "정상";
  if (bmi < 25) return "과체중";
  return "비만";
}

const WEIGHT_GUIDE: Record<BMICategory, { min: number; max: number; label: string; color: string }> = {
  저체중: { min: 12.5, max: 18, label: "12.5~18kg 증가 권장", color: "#60a5fa" },
  정상: { min: 11.5, max: 16, label: "11.5~16kg 증가 권장", color: "#34d399" },
  과체중: { min: 7, max: 11.5, label: "7~11.5kg 증가 권장", color: "#fbbf24" },
  비만: { min: 5, max: 9, label: "5~9kg 증가 권장", color: "#f87171" },
};

const WEEKLY_GAIN: Record<BMICategory, number> = {
  저체중: 0.5,
  정상: 0.42,
  과체중: 0.28,
  비만: 0.22,
};

export default function WeightTrackerScreen() {
  const [height, setHeight] = useState("");
  const [preWeight, setPreWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [week, setWeek] = useState("");
  const [result, setResult] = useState<null | {
    bmi: number;
    category: BMICategory;
    gained: number;
    recommended: { min: number; max: number };
    status: "적절" | "부족" | "과다";
  }>(null);

  const calculate = () => {
    const h = parseFloat(height) / 100;
    const pre = parseFloat(preWeight);
    const cur = parseFloat(currentWeight);
    const w = parseInt(week);

    if (!h || !pre || !cur || !w) return;

    const bmi = pre / (h * h);
    const category = getBMICategory(bmi);
    const gained = cur - pre;
    const weeklyRate = WEEKLY_GAIN[category];
    const expectedGain = w <= 13 ? 1 : 1 + weeklyRate * (w - 13);
    const minExpected = expectedGain * 0.8;
    const maxExpected = expectedGain * 1.2;

    let status: "적절" | "부족" | "과다" = "적절";
    if (gained < minExpected) status = "부족";
    else if (gained > maxExpected) status = "과다";

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      gained: Math.round(gained * 10) / 10,
      recommended: {
        min: Math.round(minExpected * 10) / 10,
        max: Math.round(maxExpected * 10) / 10,
      },
      status,
    });
  };

  const statusColor = result
    ? result.status === "적절" ? "#34d399" : result.status === "부족" ? "#60a5fa" : "#f87171"
    : "#34d399";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚖️ 주차별 몸무게 확인</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>내 정보 입력</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>키 (cm)</Text>
            <TextInput style={styles.input} placeholder="예: 162" keyboardType="numeric" value={height} onChangeText={setHeight} />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>임신 전 체중 (kg)</Text>
            <TextInput style={styles.input} placeholder="예: 55" keyboardType="numeric" value={preWeight} onChangeText={setPreWeight} />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>현재 체중 (kg)</Text>
            <TextInput style={styles.input} placeholder="예: 61" keyboardType="numeric" value={currentWeight} onChangeText={setCurrentWeight} />
          </View>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>현재 주수</Text>
            <TextInput style={styles.input} placeholder="예: 20" keyboardType="numeric" value={week} onChangeText={setWeek} />
          </View>
        </View>
        <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
          <Text style={styles.calcBtnText}>확인하기</Text>
        </TouchableOpacity>
      </View>

      {result && (
        <>
          <View style={[styles.resultCard, { borderColor: statusColor }]}>
            <Text style={[styles.resultStatus, { color: statusColor }]}>
              {result.status === "적절" ? "✅ 체중 증가 적절해요!" : result.status === "부족" ? "📉 조금 더 드세요" : "📈 식이 조절이 필요해요"}
            </Text>
            <Text style={styles.resultGained}>현재 증가량: <Text style={styles.resultGainedNum}>{result.gained}kg</Text></Text>
            <Text style={styles.resultRecommend}>
              이 시기 권장 증가량: {result.recommended.min} ~ {result.recommended.max}kg
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>내 BMI 정보</Text>
            <View style={styles.bmiRow}>
              <View style={styles.bmiItem}>
                <Text style={styles.bmiLabel}>임신 전 BMI</Text>
                <Text style={styles.bmiValue}>{result.bmi}</Text>
              </View>
              <View style={styles.bmiItem}>
                <Text style={styles.bmiLabel}>체형</Text>
                <Text style={[styles.bmiValue, { color: WEIGHT_GUIDE[result.category].color }]}>{result.category}</Text>
              </View>
              <View style={styles.bmiItem}>
                <Text style={styles.bmiLabel}>총 권장 증가</Text>
                <Text style={styles.bmiValue}>{WEIGHT_GUIDE[result.category].label}</Text>
              </View>
            </View>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📊 BMI별 권장 체중 증가량</Text>
        {(Object.entries(WEIGHT_GUIDE) as [BMICategory, typeof WEIGHT_GUIDE[BMICategory]][]).map(([cat, guide]) => (
          <View key={cat} style={styles.guideRow}>
            <View style={[styles.guideDot, { backgroundColor: guide.color }]} />
            <Text style={styles.guideCat}>{cat}</Text>
            <Text style={styles.guideLabel}>{guide.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>⚠️ 참고용이며 정확한 체중 관리는 담당 의사와 상담하세요.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf2f8" },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 16, marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#fce7f3" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#1f2937", marginBottom: 12 },
  inputRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  inputWrap: { flex: 1 },
  label: { fontSize: 12, color: "#374151", marginBottom: 4, fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#fce7f3", borderRadius: 10, padding: 10, fontSize: 14, backgroundColor: "#fdf2f8" },
  calcBtn: { backgroundColor: "#ec4899", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  calcBtnText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  resultCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 20,
    marginBottom: 16, borderWidth: 2, alignItems: "center",
  },
  resultStatus: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  resultGained: { fontSize: 14, color: "#374151", marginBottom: 4 },
  resultGainedNum: { fontWeight: "bold", fontSize: 16 },
  resultRecommend: { fontSize: 12, color: "#6b7280" },
  bmiRow: { flexDirection: "row", gap: 8 },
  bmiItem: { flex: 1, alignItems: "center", padding: 8, backgroundColor: "#fdf2f8", borderRadius: 10 },
  bmiLabel: { fontSize: 10, color: "#6b7280", marginBottom: 4 },
  bmiValue: { fontSize: 13, fontWeight: "bold", color: "#1f2937", textAlign: "center" },
  guideRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  guideDot: { width: 10, height: 10, borderRadius: 5 },
  guideCat: { width: 44, fontSize: 12, color: "#374151", fontWeight: "600" },
  guideLabel: { flex: 1, fontSize: 12, color: "#6b7280" },
  disclaimer: { backgroundColor: "#fce7f3", borderRadius: 12, padding: 12 },
  disclaimerText: { fontSize: 11, color: "#9d174d", textAlign: "center" },
});
