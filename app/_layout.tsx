import { Slot } from "expo-router";
import { AuthProvider } from "./_context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
