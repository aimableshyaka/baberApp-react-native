import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logout } from "../_api/auth";
import { useAuth } from "../_context/AuthContext";

/**
 * EXAMPLE USER DASHBOARD
 * This is the dashboard shown to regular users (role: USER)
 *
 * It replaces your existing HomeScreen logic with logout capability
 */
export const UserDashboard = () => {
  const { user, logout: authLogout } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      await authLogout();
      Alert.alert("Success", "Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if API fails, clear local auth
      await authLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person" size={40} color="#6c5ce7" />
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>Hi, {user?.firstname}</Text>
      </View>

      {/* You can keep your existing HomeScreen content here */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Account</Text>

        <View style={styles.infoCard}>
          <Ionicons name="mail" size={20} color="#6c5ce7" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color="#6c5ce7" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Account Type</Text>
            <Text style={styles.infoValue}>{user?.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="calendar" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Settings</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutBtn, loading && styles.disabledBtn]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#6c5ce7",
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: "#6c5ce7",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  logoutBtn: {
    backgroundColor: "#ff7675",
    padding: 16,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 30,
  },
  logoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  disabledBtn: {
    opacity: 0.6,
  },
});
