import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCurrentUser } from "../context/UserContext";
import { router } from "expo-router";
import fetchData from "@/hooks/fetchData";
import { Card, TextInput, Button } from "react-native-paper";

export default function LoginScreen() {
  const { login } = useCurrentUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchData(
        "auth/login",
        "POST",
        { username, password },
        false
      );

      if (!data?.token) {
        setError("Identifiants invalides");
        return;
      }

      await login(data.token);
      router.replace("/");
    } catch (error) {
      console.error(error);
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Content>

          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Text style={styles.iconText}>👤</Text>
            </View>

            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Bienvenue, connectez-vous pour continuer
            </Text>
          </View>

          <View style={styles.fields}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>

              <TextInput
                mode="outlined"
                value={username}
                onChangeText={setUsername}
                placeholder="vous@exemple.com"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                contentStyle={styles.inputContent}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mot de passe</Text>

              <TextInput
                mode="outlined"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                style={styles.input}
                outlineStyle={styles.inputOutline}
                contentStyle={styles.inputContent}
              />
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonText}
          >
            Se connecter
          </Button>

          {error && <Text style={styles.error}>{error}</Text>}

        </Card.Content>
      </Card>
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
    padding: 8,
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
  },

  inputOutline: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
  },

  inputContent: {
    fontSize: 14,
    color: "#111111",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#185FA5",
    borderRadius: 14,
  },

  buttonContent: {
    paddingVertical: 6,
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