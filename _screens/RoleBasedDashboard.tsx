import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth, UserRole } from "../_context/AuthContext";
import { AdminDashboard } from "./AdminDashboard";
import { HomeScreen } from "./HomeScreen";
import { SalonOwnerDashboard } from "./SalonDashboard";

export const RoleBasedDashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <HomeScreen />
      </View>
    );
  }

  // Render based on user role
  switch (user.role) {
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.SALON_OWNER:
      return <SalonOwnerDashboard />;
    case UserRole.CUSTOMER:
    default:
      return <HomeScreen />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
