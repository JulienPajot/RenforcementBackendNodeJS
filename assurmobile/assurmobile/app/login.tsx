import { useState } from "react";
import { View, Text } from "react-native";
import { Card, TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);


  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log(await response.json());
      if (!response.ok) setError("Invalid credentials");
      setError(null);
      const token = (await response.json()).token;
      await AsyncStorage.setItem("token", token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20 }}>
      <Card>
        <Card.Content>
          <Text>Connexion</Text>

          <TextInput
            label="Email"
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            label="Mot de passe"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button mode="contained" onPress={login}>
            Se connecter
          </Button>
        </Card.Content>
        <Text style={{ color: "red", textAlign:"center" }}>{error}</Text>
      </Card>
    </View>
  );
}

function setError(arg0: string) {
    throw new Error("Function not implemented.");
}
