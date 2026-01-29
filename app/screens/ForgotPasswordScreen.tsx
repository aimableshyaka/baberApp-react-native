import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
const router = useRouter();
export const ForgotPasswordScreen = ({
  setMode,
}: {
  setMode: (
    mode: "signup" | "signin" | "phone" | "verify" | "forgot" | "resetEmail",
  ) => void;
}) => {
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setMode("signin")}
      >
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Select which contact details should we use to reset your password.
      </Text>

      {/* Via Email Option */}
      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => setMode("resetEmail")}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#111" />
        </View>
        <Text style={styles.optionText}>Via email</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>

      {/* Via SMS Option */}
      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => router.push("/screens/Codesent")}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="phone-portrait-outline" size={24} color="#111" />
        </View>
        <Text style={styles.optionText}>Via sms</Text>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 60,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginTop: 40,
    marginBottom: 12,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
});
