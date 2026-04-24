import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <UserProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Accueil", headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Login" }} />
          <Stack.Screen name="sinister/[id]"options={{title: "Sinister Detail"  }}
/>
        </Stack>
      </UserProvider>
    </PaperProvider>
  );
}