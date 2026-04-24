// app/sinister/[id].tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import fetchData from "@/hooks/fetchData";

type Request = {
  id: number;
  status: string;
};

type Sinister = {
  id: number;
  plate: string;
  driver_firstname: string;
  driver_lastname: string;
  driver_is_insured: boolean;
  call_datetime: string;
  sinister_datetime: string;
  context: string;
  driver_responsability: boolean;
  driver_engaged_responsability: number;
  validated: boolean;
  requests: Request[];
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

export default function SinisterDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [sinister, setSinister] = useState<Sinister | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchData(`sinisters/${id}`, "GET", undefined, true);
      setSinister(data?.sinister ?? null);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#185FA5" />
      </View>
    );
  }

  if (!sinister) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Sinistre introuvable</Text>
      </View>
    );
  }

  const latestStatus = sinister.requests?.length
    ? sinister.requests[sinister.requests.length - 1].status
    : null;
  const statusInfo = latestStatus ? STATUS_LABELS[latestStatus] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.sinisterNumber}>Sinistre #{sinister.id}</Text>
            <Text style={styles.plate}>{sinister.plate ?? "—"}</Text>
          </View>
          <View style={styles.validatedBadge}>
            <Text style={styles.validatedText}>
              {sinister.validated ? "✓ Validé" : "Non validé"}
            </Text>
          </View>
        </View>

        {statusInfo && (
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Conducteur</Text>
      <View style={styles.card}>
        <Row label="Nom" value={`${sinister.driver_firstname} ${sinister.driver_lastname}`} />
        <Divider />
        <Row label="Assuré" value={sinister.driver_is_insured ? "Oui" : "Non"} />
        <Divider />
        <Row label="Responsabilité" value={sinister.driver_responsability ? "Oui" : "Non"} />
        {sinister.driver_responsability && (
          <>
            <Divider />
            <Row label="Part engagée" value={`${sinister.driver_engaged_responsability}%`} />
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Dates</Text>
      <View style={styles.card}>
        <Row label="Date du sinistre" value={formatDate(sinister.sinister_datetime)} />
        <Divider />
        <Row label="Date d'appel" value={formatDate(sinister.call_datetime)} />
      </View>

      {sinister.context && (
        <>
          <Text style={styles.sectionTitle}>Contexte</Text>
          <View style={styles.card}>
            <Text style={styles.contextText}>{sinister.context}</Text>
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Demandes ({sinister.requests?.length ?? 0})</Text>
      {sinister.requests?.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucune demande</Text>
        </View>
      ) : (
        sinister.requests?.map((req) => {
          const info = STATUS_LABELS[req.status];
          return (
            <View key={req.id} style={styles.requestCard}>
              <Text style={styles.requestId}>Demande #{req.id}</Text>
              {info && (
                <View style={[styles.statusBadge, { backgroundColor: info.bg }]}>
                  <Text style={[styles.statusText, { color: info.color }]}>{info.label}</Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0" },
  content: { padding: 20, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F0" },

  backButton: { marginBottom: 16 },
  backText: { fontSize: 14, color: "#185FA5", fontWeight: "500" },

  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    padding: 20,
    marginBottom: 24,
    gap: 12,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sinisterNumber: { fontSize: 18, fontWeight: "500", color: "#111111", marginBottom: 4 },
  plate: { fontSize: 22, fontWeight: "500", color: "#185FA5", letterSpacing: 1 },
  validatedBadge: {
    backgroundColor: "#EAF3DE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  validatedText: { fontSize: 12, fontWeight: "500", color: "#3B6D11" },

  statusBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "500" },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rowLabel: { fontSize: 14, color: "#6B7280" },
  rowValue: { fontSize: 14, fontWeight: "500", color: "#111111" },
  divider: { height: 0.5, backgroundColor: "#E0DED8" },

  contextText: { fontSize: 14, color: "#374151", lineHeight: 22, paddingVertical: 14 },

  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestId: { fontSize: 14, fontWeight: "500", color: "#111111" },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: { fontSize: 14, color: "#6B7280" },
});