import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Linking } from "react-native";
import { useAuth, UserRole } from "../../_context/AuthContext";
import { UserDashboard } from "../../_screens/UserDashboard";

export default function UserDashboardScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.replace("/");
        return;
      }

      // If user is ADMIN or SALON_OWNER, redirect to login with alert
      if (user.role === UserRole.ADMIN || user.role === UserRole.SALON_OWNER) {
        Alert.alert(
          "Access Denied",
          "This account is designed to be used on the Web Dashboard. Please log in using the web version.",
          [
            {
              text: "Open Web Version",
              onPress: () => {
                Linking.openURL("http://localhost:5173/");
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
      }
    }
  }, [user, isLoading]);

  return <UserDashboard />;
}
