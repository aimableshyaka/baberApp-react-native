import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "../api/auth";

export const SignupScreen = ({
  setMode,
}: {
  setMode: (mode: "signup" | "signin" | "phone") => void;
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Validation
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser({
        firstname: fullName,
        email,
        password: password,
      });

      Alert.alert("Success", "Account created successfully!");
      setMode("phone");
    } catch (error: any) {
      Alert.alert(
        "Signup Error",
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
      );
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => setMode("signin")}
      >
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create a new account</Text>

      {/* Full name */}
      <View style={styles.inputWrapper}>
        <Feather name="user" size={18} color="#999" />
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

      {/* Email */}
      <View style={styles.inputWrapper}>
        <Feather name="mail" size={18} color="#999" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password */}
      <View style={styles.inputWrapper}>
        <Feather name="lock" size={18} color="#999" />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity
        style={[styles.signInBtn, loading && styles.disabledBtn]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signInText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.termsText}>
        By continuing Sign up you agree to the following{" "}
        <Text style={styles.termsLink}>Terms & Conditions</Text> without
        reservation
      </Text>

      {/* Footer */}
      <Text style={styles.signupText}>
        Already have an account?{" "}
        <Text style={styles.signupLink} onPress={() => setMode("signin")}>
          Sign up
        </Text>
      </Text>
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
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
  },
  input: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
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
  termsText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 12,
    marginTop: 10,
    lineHeight: 18,
  },
  termsLink: {
    color: "#6c5ce7",
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    color: "#aaa",
  },
  signupLink: {
    color: "#6c5ce7",
    fontWeight: "600",
  },
  disabledBtn: {
    opacity: 0.6,
  },
});
