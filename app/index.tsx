import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PhoneVerificationScreen } from "./screens/PhoneVerificationScreen";
import { SigninScreen } from "./screens/SigninScreen";
import { SignupScreen } from "./screens/SignupScreen";
import { VerifyCodeScreen } from "./screens/VerifyCodeScreen";

const BaberApp = () => {
  const [mode, setMode] = useState<"signup" | "signin" | "phone" | "verify">(
    "signin",
  );
  const [step, setStep] = useState(1);

  if (mode === "verify") {
    return <VerifyCodeScreen setMode={setMode} />;
  }

  if (mode === "phone") {
    return <PhoneVerificationScreen setMode={setMode} />;
  }

  if (mode === "signup") {
    return <SignupScreen step={step} setStep={setStep} setMode={setMode} />;
  }

  return <SigninScreen setMode={setMode} />;
};

const AuthModeScreen = ({
  onSelectMode,
}: {
  onSelectMode: (mode: "signup" | "signin") => void;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BaberApp</Text>
      <Text style={styles.subtitle}>Get started with your account</Text>

      <TouchableOpacity
        style={styles.signInBtn}
        onPress={() => onSelectMode("signup")}
      >
        <Text style={styles.signInText}>Create account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.signInBtn, styles.outlineBtn]}
        onPress={() => onSelectMode("signin")}
      >
        <Text style={[styles.signInText, styles.outlineText]}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
  },
  subtitle: {
    color: "#aaa",
    marginBottom: 30,
  },
  signInBtn: {
    backgroundColor: "#6c5ce7",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineBtn: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#6c5ce7",
  },
  outlineText: {
    color: "#6c5ce7",
  },
});

export default BaberApp;
