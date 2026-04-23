import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { Redirect, router, useRouter } from "expo-router";
import { useCurrentUser } from "@/context/UserContext";

export default function Index() {

  const router = useRouter();
  const user = useCurrentUser();

  if (!user) {
    return <Redirect href="/login" />;
  }


  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text>Accueil</Text>

      <Button mode="contained" onPress={() => router.push("/login")}>
        Se connecter
      </Button>
    </View>
  );
}


