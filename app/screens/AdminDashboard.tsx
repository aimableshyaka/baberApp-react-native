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

export const AdminDashboard = () => {
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
      // Even if API call fails, clear local auth
      await authLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={40} color="#6c5ce7" />
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.firstname}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Ionicons name="people" size={32} color="#6c5ce7" />
          <Text style={styles.cardTitle}>Users</Text>
          <Text style={styles.cardValue}>1,234</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="briefcase" size={32} color="#10ac84" />
          <Text style={styles.cardTitle}>Salons</Text>
          <Text style={styles.cardValue}>54</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="trending-up" size={32} color="#ff7675" />
          <Text style={styles.cardTitle}>Revenue</Text>
          <Text style={styles.cardValue}>$12.5K</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="checkmark-circle" size={32} color="#fdcb6e" />
          <Text style={styles.cardTitle}>Bookings</Text>
          <Text style={styles.cardValue}>892</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Actions</Text>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>Manage Users</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="analytics" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>View Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.actionBtnText}>System Settings</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  card: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginTop: 4,
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
