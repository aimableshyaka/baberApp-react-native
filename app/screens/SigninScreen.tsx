import { Feather, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const twitterIcon = require("../../assets/images/customImages/twitter-icon.png");

export const SigninScreen = ({
  setMode,
}: {
  setMode: (mode: "signup" | "signin" | "phone") => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => {}}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

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

      {/* Remember me */}
      <TouchableOpacity
        style={styles.rememberRow}
        onPress={() => setRemember(!remember)}
      >
        <View style={[styles.checkbox, remember && styles.checkboxActive]}>
          {remember && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={styles.rememberText}>Remember me</Text>
      </TouchableOpacity>

      {/* Sign in button */}
      <TouchableOpacity style={styles.signInBtn}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Or continue with</Text>

      {/* Social buttons */}
      <View style={styles.socialRow}>
        {/* Google */}
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={24} color="#111" />
        </TouchableOpacity>
        {/* Twitter */}
        <TouchableOpacity style={styles.socialBtn}>
          <Image
            source={twitterIcon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot your password?</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account?{" "}
        <Text style={styles.signupLink} onPress={() => setMode("signup")}>
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
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: "#6c5ce7",
    borderColor: "#6c5ce7",
  },
  rememberText: {
    color: "#555",
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
  orText: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 15,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  forgot: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: 10,
  },
  signupText: {
    textAlign: "center",
    color: "#aaa",
  },
  signupLink: {
    color: "#6c5ce7",
    fontWeight: "600",
  },
});
