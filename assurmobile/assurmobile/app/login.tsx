import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from "react-native";
import { useCurrentUser } from "../context/UserContext";
import { router } from "expo-router";
import fetchData from "@/hooks/fetchData";

export default function LoginScreen() {
  const { login } = useCurrentUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
  try {
    const data = await fetchData("auth/login", "POST", { username, password }, false);

    if (!data?.token) {
      setError("Identifiants invalides");
      return;
    }

    await login(data.token);
    return router.replace("/");
  } catch (error) {
    console.error(error);
    setError("Erreur serveur");
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Text style={styles.iconText}>👤</Text>
          </View>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Bienvenue, connectez-vous pour continuer</Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <RNTextInput
              style={styles.input}
              placeholder="vous@exemple.com"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <RNTextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E6F1FB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconText: {
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  fields: {
    gap: 12,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9F9F7",
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111111",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#185FA5",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  error: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 13,
    color: "#A32D2D",
  },
});