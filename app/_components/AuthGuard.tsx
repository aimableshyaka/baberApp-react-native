import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth, UserRole } from "../_context/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles,
}) => {
  const { isSignedIn, isLoading, user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
      </View>
    );
  }

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="lock-closed" size={60} color="#6c5ce7" />
          <Text style={styles.title}>Access Denied</Text>
          <Text style={styles.message}>Please sign in to access this page</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/screens/SigninScreen")}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (requiredRoles && !requiredRoles.includes(user?.role as UserRole)) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="shield-alert" size={60} color="#ff7675" />
          <Text style={styles.title}>Unauthorized</Text>
          <Text style={styles.message}>
            You don't have permission to access this page
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#10ac84",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
