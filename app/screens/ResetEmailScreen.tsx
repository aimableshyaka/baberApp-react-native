import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const router = useRouter();

export const ResetEmailScreen = ({
  setMode,
}: {
  setMode: (
    mode: "signup" | "signin" | "phone" | "verify" | "forgot" | "resetEmail",
  ) => void;
}) => {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setMode("forgot")}
      >
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot password</Text>
      <Text style={styles.subtitle}>
        Please enter your email address to reset your password instruction
      </Text>

      {/* Email Input */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#999" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Send Link Button */}
      <TouchableOpacity
        style={styles.sendBtn}
        onPress={() => router.push("/screens/Codesent")}
      >
        <Text style={styles.sendBtnText}>Send link</Text>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 25,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#6c5ce7",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  sendBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
