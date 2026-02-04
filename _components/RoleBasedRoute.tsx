import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, UserRole } from "../_context/AuthContext";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  webDashboardUrl?: string;
}

/**
 * RoleBasedRoute Component
 *
 * Protects screens from ADMIN and SALON_OWNER users on mobile.
 * - ADMIN/SALON_OWNER: Shows alert to use web version
 * - CUSTOMER (USER): Renders the protected content
 *
 * Usage:
 * ```tsx
 * <RoleBasedRoute allowedRoles={[UserRole.CUSTOMER]}>
 *   <YourScreen />
 * </RoleBasedRoute>
 * ```
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  webDashboardUrl = "http://localhost:5173/",
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (!allowedRoles.includes(user.role)) {
        // User does not have permission
        if (
          user.role === UserRole.ADMIN ||
          user.role === UserRole.SALON_OWNER
        ) {
          Alert.alert(
            "Web Dashboard Required",
            "This account is designed to be used on the Web Dashboard. Please log in using the web version.",
            [
              {
                text: "Open Web Version",
                onPress: () => {
                  Linking.openURL(webDashboardUrl);
                },
              },
              {
                text: "Back to Login",
                onPress: () => {
                  router.replace("/");
                },
              },
            ],
            { cancelable: false },
          );
        } else {
          Alert.alert(
            "Access Denied",
            "You don't have permission to access this screen.",
            [
              {
                text: "Back",
                onPress: () => {
                  router.back();
                },
              },
            ],
          );
        }
      }
    }
  }, [user, isLoading, allowedRoles]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="lock-closed" size={60} color="#6c5ce7" />
          <Text style={styles.title}>Not Authenticated</Text>
          <Text style={styles.message}>Please sign in to continue</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="shield-alert" size={60} color="#ff7675" />
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.message}>
            You don't have permission to access this screen
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#f0f0f0",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
