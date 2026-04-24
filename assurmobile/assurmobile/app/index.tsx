import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useCurrentUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import fetchData from "@/hooks/fetchData";

type Sinister = {
  id: number;
  plate: string;
  driver_firstname: string;
  driver_lastname: string;
  sinister_datetime: string;
  requests: { id: number; status: string }[];
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:           { label: "En attente",         color: "#854F0B", bg: "#FAEEDA" },
  IN_PROGRESS:       { label: "En cours",            color: "#185FA5", bg: "#E6F1FB" },
  EXPERTISE_PLANNED: { label: "Expertise planifiée", color: "#3B6D11", bg: "#EAF3DE" },
  EXPERTISE_DONE:    { label: "Expertise faite",     color: "#3B6D11", bg: "#EAF3DE" },
  REPAIR_PLANNED:    { label: "Réparation planif.",  color: "#534AB7", bg: "#EEEDFE" },
  REPAIR_DONE:       { label: "Réparation faite",    color: "#534AB7", bg: "#EEEDFE" },
  CLOSED:            { label: "Clôturé",             color: "#5F5E5A", bg: "#F1EFE8" },
};

export default function Index() {
  const router = useRouter();
  const { user, token } = useCurrentUser();
  const [sinisters, setSinisters] = useState<Sinister[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user) return <Redirect href="/login" />;

  useEffect(() => {
    const fetchSinisters = async () => {
      try {
        const data = await fetchData(
          "sinisters",
          "GET",
          undefined,
          true
        );
        
        setSinisters(data.sinisters ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      
    };

    if (token) fetchSinisters();
    }, [token]);

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const getLatestStatus = (sinister: Sinister) => {
    if (!sinister.requests?.length) return null;
    return sinister.requests[sinister.requests.length - 1].status;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user.firstname} 👋</Text>
        <Text style={styles.subtitle}>Vos sinistres en cours</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#185FA5" style={{ marginTop: 40 }} />
      ) : sinisters.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun sinistre trouvé</Text>
        </View>
      ) : (
        sinisters.map((sinister) => {
          const status = getLatestStatus(sinister);
          const statusInfo = status ? STATUS_LABELS[status] : null;

          return (
            <TouchableOpacity
              key={sinister.id}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(`/sinister/${sinister.id}` as any)}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardId}>Sinistre #{sinister.id}</Text>
                {statusInfo && (
                  <View style={[styles.badge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.badgeText, { color: statusInfo.color }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.divider} />
              <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Plaque</Text>
                  <Text style={styles.infoValue}>{sinister.plate ?? "—"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Conducteur</Text>
                  <Text style={styles.infoValue}>
                    {sinister.driver_firstname} {sinister.driver_lastname}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date sinistre</Text>
                  <Text style={styles.infoValue}>{formatDate(sinister.sinister_datetime)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0" },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: "500", color: "#111111", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6B7280" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardId: { fontSize: 15, fontWeight: "500", color: "#111111" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: "500" },
  divider: { height: 0.5, backgroundColor: "#E0DED8", marginBottom: 12 },
  cardBody: { gap: 6 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  infoLabel: { fontSize: 13, color: "#6B7280" },
  infoValue: { fontSize: 13, color: "#111111", fontWeight: "500" },
  empty: { marginTop: 60, alignItems: "center" },
  emptyText: { fontSize: 15, color: "#6B7280" },
});