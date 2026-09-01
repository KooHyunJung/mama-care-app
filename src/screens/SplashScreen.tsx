import { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(opacity, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start(() => onFinish());
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity }]}>
        <Text style={styles.emoji}>🌸</Text>
        <Text style={styles.title}>마마케어</Text>
        <Text style={styles.desc}>임산부에게 필요한 모든 정보를 한곳에서</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf2f8",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { alignItems: "center" },
  emoji: { fontSize: 72, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: "bold", color: "#1f2937", marginBottom: 10 },
  desc: { fontSize: 15, color: "#6b7280", textAlign: "center" },
});
