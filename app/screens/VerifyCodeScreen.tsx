import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const VerifyCodeScreen = ({
  setMode,
  phoneNumber = "713-444-xxxx",
}: {
  setMode: (mode: "signup" | "signin" | "phone" | "verify") => void;
  phoneNumber?: string;
}) => {
  const [code, setCode] = useState("");
  const [resendTimer, setResendTimer] = useState(40);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (key: string) => {
    if (key === "backspace") {
      setCode(code.slice(0, -1));
    } else if (code.length < 4 && /^[0-9]$/.test(key)) {
      setCode(code + key);
    }
  };

  const renderCodeInput = () => {
    const inputs = [];
    for (let i = 0; i < 4; i++) {
      inputs.push(
        <View key={i} style={styles.codeInput}>
          <Text style={styles.codeInputText}>{code[i] ? "•" : "-"}</Text>
        </View>,
      );
    }
    return inputs;
  };

  const renderKeypad = () => {
    const rows = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["0", "backspace"],
    ];

    return rows.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.keypadRow}>
        {row.map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.keypadButton,
              key === "backspace" && styles.backspaceButton,
              key === "0" && { flex: 1 },
            ]}
            onPress={() => handleKeyPress(key)}
          >
            {key === "backspace" ? (
              <Ionicons name="backspace" size={24} color="#111" />
            ) : (
              <Text style={styles.keypadText}>{key}</Text>
            )}
          </TouchableOpacity>
        ))}
        {rowIndex === 3 && (
          <View
            style={[styles.keypadButton, { backgroundColor: "transparent" }]}
          />
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => setMode("phone")}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Verify phone</Text>
      <Text style={styles.subtitle}>
        Please enter the 4 digit security code we just sent you{" "}
        <Text style={styles.phoneHighlight}>{phoneNumber}</Text>
      </Text>

      {/* Code Input Display */}
      <View style={styles.codeContainer}>{renderCodeInput()}</View>

      {/* Resend Timer */}
      <Text style={styles.resendText}>
        {resendTimer > 0
          ? `Resend in ${resendTimer} Sec`
          : "You can resend now"}
      </Text>

      {/* Numeric Keypad */}
      <View style={styles.keypad}>{renderKeypad()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
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
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  phoneHighlight: {
    color: "#6c5ce7",
    fontWeight: "600",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 40,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  codeInputText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#111",
  },
  resendText: {
    textAlign: "center",
    color: "#6c5ce7",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 40,
  },
  keypad: {
    marginTop: "auto",
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  keypadButton: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  backspaceButton: {
    flex: 1,
  },
  keypadText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
  },
});
