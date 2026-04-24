import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  ActivityIndicator,
  FAB,
  Modal,
  Portal,
  TextInput,
  Button,
  Switch,
  SegmentedButtons,
  HelperText,
  Card,
  Chip,
  Divider,
} from "react-native-paper";
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

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

export default function Index() {
  const router = useRouter();
  const { user, token } = useCurrentUser();

  const [sinisters, setSinisters]       = useState<Sinister[]>([]);
  const [loading, setLoading]           = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Champs du formulaire
  const [plate, setPlate]               = useState("");
  const [firstname, setFirstname]       = useState("");
  const [lastname, setLastname]         = useState("");
  const [isInsured, setIsInsured]       = useState(false);
  const [responsible, setResponsible]   = useState(false);
  const [engagedPart, setEngagedPart]   = useState("100");
  const [context, setContext]           = useState("");
  const [sinisterDate, setSinisterDate] = useState("");
  const [callDate, setCallDate]         = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError]     = useState<string | null>(null);

  if (!user) return <Redirect href="/login" />;

  const fetchSinisters = async () => {
    try {
      const data = await fetchData("sinisters", "GET", undefined, true);
      setSinisters(data?.sinisters ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSinisters();
  }, [token]);

  const resetForm = () => {
    setPlate(""); setFirstname(""); setLastname("");
    setIsInsured(false); setResponsible(false);
    setEngagedPart("100"); setContext("");
    setSinisterDate(""); setCallDate("");
    setCreateError(null);
  };

  const handleCreate = async () => {
    setCreateError(null);
    if (!plate || !firstname || !lastname || !sinisterDate || !callDate) {
      setCreateError("Veuillez remplir tous les champs obligatoires *");
      return;
    }
    setCreateLoading(true);
    try {
      const res = await fetchData("sinisters", "POST", {
        plate,
        driver_firstname:              firstname,
        driver_lastname:               lastname,
        driver_is_insured:             isInsured,
        driver_responsability:         responsible,
        driver_engaged_responsability: responsible ? parseInt(engagedPart) : 0,
        context,
        sinister_datetime: new Date(sinisterDate).toISOString(),
        call_datetime:     new Date(callDate).toISOString(),
      }, true);

      if (res?.sinister) {
        setModalVisible(false);
        resetForm();
        setLoading(true);
        await fetchSinisters();
      } else {
        setCreateError("Erreur lors de la création");
      }
    } catch {
      setCreateError("Erreur serveur");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <Portal.Host>
      <View style={styles.root}>

        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.greeting}>
              Bonjour, {user.firstname} 👋
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Vos sinistres en cours
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator animating color="#185FA5" style={{ marginTop: 40 }} />
          ) : sinisters.length === 0 ? (
            <View style={styles.empty}>
              <Text variant="bodyMedium" style={styles.emptyText}>Aucun sinistre trouvé</Text>
            </View>
          ) : (
            sinisters.map((sinister) => {
              const latestStatus = sinister.requests?.length
                ? sinister.requests[sinister.requests.length - 1].status
                : null;
              const statusInfo = latestStatus ? STATUS_LABELS[latestStatus] : null;

              return (
                <Card
                  key={sinister.id}
                  style={styles.card}
                  onPress={() => router.push(`/sinister/${sinister.id}` as any)}
                >
                  <Card.Content>
                    <View style={styles.cardTop}>
                      <Text variant="titleMedium" style={styles.cardId}>
                        Sinistre #{sinister.id}
                      </Text>
                      {statusInfo && (
                        <Chip
                          compact
                          style={{ backgroundColor: statusInfo.bg }}
                          textStyle={{ color: statusInfo.color, fontSize: 12, fontWeight: "500" }}
                        >
                          {statusInfo.label}
                        </Chip>
                      )}
                    </View>
                    <Divider style={styles.divider} />
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
                  </Card.Content>
                </Card>
              );
            })
          )}
        </ScrollView>

        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => { setModalVisible(false); resetForm(); }}
            contentContainerStyle={styles.modal}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text variant="titleLarge" style={styles.modalTitle}>Nouveau sinistre</Text>

              <Text style={styles.sectionLabel}>Véhicule</Text>
              <TextInput
                textColor="#000000"
                label="Plaque d'immatriculation *"
                value={plate}
                onChangeText={setPlate}
                mode="outlined"
                autoCapitalize="characters"
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />

              <Text style={styles.sectionLabel}>Conducteur</Text>
              <TextInput
                textColor="#000000"
                label="Prénom *"
                value={firstname}
                onChangeText={setFirstname}
                mode="outlined"
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />
              <TextInput
                textColor="#000000"
                label="Nom *"
                value={lastname}
                onChangeText={setLastname}
                mode="outlined"
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Assuré</Text>
                <Switch value={isInsured} onValueChange={setIsInsured} color="#185FA5" />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Responsable</Text>
                <Switch value={responsible} onValueChange={setResponsible} color="#185FA5" />
              </View>

              {responsible && (
                <>
                  <Text style={styles.fieldLabel}>Part de responsabilité</Text>
                  <SegmentedButtons
                    value={engagedPart}
                    onValueChange={setEngagedPart}
                    buttons={[
                      { value: "25",  label: "25%" },
                      { value: "50",  label: "50%" },
                      { value: "75",  label: "75%" },
                      { value: "100", label: "100%" },
                    ]}
                    style={{ marginBottom: 12 }}
                  />
                </>
              )}

              <Text style={styles.sectionLabel}>Dates</Text>
              <TextInput
               textColor="#000000"
                label="Date du sinistre * (YYYY-MM-DD)"
                value={sinisterDate}
                onChangeText={setSinisterDate}
                mode="outlined"
                placeholder="2024-01-15"
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />
              <TextInput
                textColor="#000000"
                label="Date d'appel * (YYYY-MM-DD)"
                value={callDate}
                onChangeText={setCallDate}
                mode="outlined"
                placeholder="2024-01-15"
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />

              <Text style={styles.sectionLabel}>Contexte</Text>
              <TextInput
                textColor="#000000"
                label="Description de l'incident"
                value={context}
                onChangeText={setContext}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />

              <HelperText type="error" visible={!!createError}>
                {createError}
              </HelperText>

              <View style={styles.modalActions}>
                <Button
                  mode="text"
                  onPress={() => { setModalVisible(false); resetForm(); }}
                  textColor="#000000"
                  style={{ flex: 1 }}
                >
                  Annuler
                </Button>
                <Button
                 textColor="#FFFFFF"
                  mode="contained"
                  onPress={handleCreate}
                  loading={createLoading}
                  disabled={createLoading}
                  buttonColor="#185FA5"
                  style={{ flex: 1, borderRadius: 12 }}
                >
                  Créer
                </Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>

        <FAB
          icon="plus"
          style={styles.fab}
          color="#FFFFFF"
          onPress={() => setModalVisible(true)}
        />

      </View>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: "#F5F5F0" },
  container: { flex: 1 },
  content:   { padding: 20, paddingBottom: 100 },

  header:   { marginBottom: 24 },
  greeting: { color: "#111111", fontWeight: "500", marginBottom: 4 },
  subtitle: { color: "#000000" },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 12,
    elevation: 0,
    borderWidth: 0.5,
    borderColor: "#E0DED8",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardId:    { color: "#111111", fontWeight: "500" },
  divider:   { marginBottom: 12, backgroundColor: "#E0DED8" },
  infoRow:   { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  infoLabel: { fontSize: 13, color: "#000000" },
  infoValue: { fontSize: 13, color: "#111111", fontWeight: "500" },

  empty:     { marginTop: 60, alignItems: "center" },
  emptyText: { color: "#000000" },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#185FA5",
    borderRadius: 16,
  },

  modal: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalTitle:   { color: "#111111", fontWeight: "500", marginBottom: 20 },
  sectionLabel: {
    fontSize: 12, fontWeight: "500", color: "#000000",
    textTransform: "uppercase", letterSpacing: 0.5,
    marginBottom: 8, marginTop: 8,
  },
  input:        { marginBottom: 12, backgroundColor: "#F9F9F7"},
  inputOutline: { borderRadius: 12, borderColor: "#E0DED8" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#F0EEE8",
  },
  switchLabel:  { fontSize: 14, color: "#000000" },
  fieldLabel:   { fontSize: 13, color: "#000000", marginTop: 10, marginBottom: 8 },
  modalActions: { flexDirection: "row", gap: 12, marginTop: 8, paddingBottom: 8 },
});
