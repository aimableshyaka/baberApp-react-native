import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { resetPassword } from "../_api/auth";

const ResetPassword = ({ setMode }: { setMode?: any }) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = params.token as string;
  const email = params.email as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please enter both passwords");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword({
        email: email || "",
        token: token || "",
        newPassword: password,
      });

      Alert.alert(
        "Success",
        response.message || "Password reset successfully",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/screens/SigninScreen");
            },
          },
        ],
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset password";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => {
            setMode && setMode("signin");
            router.push("/screens/SigninScreen");
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#111"></Ionicons>
        </TouchableOpacity>
        {/* Title  */}
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Please Enter New Password</Text>
        {/* Password input  */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" />
          <TextInput
            placeholder="enter new password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          ></TextInput>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={18}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" />
          <TextInput
            placeholder="Confirm Your New password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          ></TextInput>
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={18}
              color="#999"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
  },
  backbtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f1f39",
  },
  subtitle: {
    fontSize: 14,
    color: "#9e9e9e",
    marginTop: 6,
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#111",
  },
  button: {
    backgroundColor: "#6c5ce7",
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ResetPassword;
