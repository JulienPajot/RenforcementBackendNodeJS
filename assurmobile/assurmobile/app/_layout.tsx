import UserProvider from "@/context/UserContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
      </Stack>
      </UserProvider>
    </PaperProvider>
  );
}