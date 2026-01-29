import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const ResetPassord = ({ setMode }: { setMode?: any }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backbtn}
          onPress={() => setMode && setMode("signin")}
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
            secureTextEntry
            style={styles.input}
          ></TextInput>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={18} color="#999" />
          <TextInput
            placeholder="Confim Your New password"
            placeholderTextColor="#aaa"
            secureTextEntry
            style={styles.input}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Passsword</Text>
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

export default ResetPassord;
