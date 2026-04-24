import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import fetchData from "@/hooks/fetchData";

import {
  Text,
  Card,
  Button,
  Chip,
  Divider,
  ActivityIndicator,
  List,
} from "react-native-paper";

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

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  PENDING: { label: "En attente", color: "#854F0B", bg: "#FAEEDA" },
  IN_PROGRESS: { label: "En cours", color: "#185FA5", bg: "#E6F1FB" },
  EXPERTISE_PLANNED: {
    label: "Expertise planifiée",
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
  EXPERTISE_DONE: {
    label: "Expertise faite",
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
  REPAIR_PLANNED: {
    label: "Réparation planifiée",
    color: "#534AB7",
    bg: "#EEEDFE",
  },
  REPAIR_DONE: {
    label: "Réparation faite",
    color: "#534AB7",
    bg: "#EEEDFE",
  },
  CLOSED: { label: "Clôturé", color: "#5F5E5A", bg: "#F1EFE8" },
};

export default function SinisterDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sinister, setSinister] = useState<Sinister | null>(null);
  const [loading, setLoading] = useState(true);

  const [file, setFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] =
    useState<{ text: string; ok: boolean } | null>(null);

  const [label, setLabel] = useState("CNI");

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";

    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const reload = async () => {
    const data = await fetchData(`sinisters/${id}`, "GET", undefined, true);
    setSinister(data?.sinister ?? null);
  };

  useEffect(() => {
    const init = async () => {
      await reload();
      setLoading(false);
    };

    init();
  }, [id]);

  const pickDocument = async () => {
    setUploadMsg(null);

    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf,image/jpeg,image/png";

      input.onchange = (e: any) => {
        const f = e.target.files?.[0];

        if (f) {
          setFile({
            uri: URL.createObjectURL(f),
            name: f.name,
            size: f.size,
            mimeType: f.type,
            _webFile: f,
          } as any);
        }
      };

      input.click();
    } else {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        setFile(result.assets[0]);
      }
    }
  };

  const sendDocument = async () => {
    if (!file || !sinister) return;

    setUploading(true);
    setUploadMsg(null);

    try {
      const form = new FormData();

      if (Platform.OS === "web") {
        form.append("file", (file as any)._webFile);
      } else {
        form.append(
          "file",
          {
            uri: file.uri,
            name: file.name,
            type: file.mimeType ?? "application/octet-stream",
          } as any
        );
      }

      form.append("sinister_id", String(sinister.id));
      form.append("label", label);

      const res = await fetchData(
        `sinisters/${sinister.id}/documents`,
        "POST",
        form,
        true
      );

      setUploadMsg({
        text: res?.message ?? "Document envoyé",
        ok: true,
      });

      setFile(null);
    } catch (e: any) {
      setUploadMsg({
        text: e?.message ?? "Erreur lors de l'envoi",
        ok: false,
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator animating color="#185FA5" />
      </View>
    );
  }

  if (!sinister) {
    return (
      <View style={styles.centered}>
        <Text>Sinistre introuvable</Text>
      </View>
    );
  }

  const latestStatus = sinister.requests?.length
    ? sinister.requests[sinister.requests.length - 1].status
    : null;

  const statusInfo = latestStatus
    ? STATUS_LABELS[latestStatus]
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.topRow}>
            <View>
              <Text variant="titleMedium">
                Sinistre #{sinister.id}
              </Text>

              <Text style={styles.plate}>
                {sinister.plate ?? "—"}
              </Text>
            </View>

            <Chip
              compact
              style={{
                backgroundColor: sinister.validated
                  ? "#EAF3DE"
                  : "#F1EFE8",
              }}
              textStyle={{
                color: sinister.validated
                  ? "#3B6D11"
                  : "#5F5E5A",
              }}
            >
              {sinister.validated
                ? "✓ Validé"
                : "Non validé"}
            </Chip>
          </View>

          {statusInfo && (
            <Chip
              compact
              style={{
                backgroundColor: statusInfo.bg,
                alignSelf: "flex-start",
                marginTop: 14,
              }}
              textStyle={{ color: statusInfo.color }}
            >
              {statusInfo.label}
            </Chip>
          )}
        </Card.Content>
      </Card>

      <SectionTitle title="Conducteur" />

      <Card style={styles.card}>
        <Card.Content>
          <Row
            label="Nom"
            value={`${sinister.driver_firstname} ${sinister.driver_lastname}`}
          />
          <Divider />
          <Row
            label="Assuré"
            value={sinister.driver_is_insured ? "Oui" : "Non"}
          />
          <Divider />
          <Row
            label="Responsabilité"
            value={
              sinister.driver_responsability ? "Oui" : "Non"
            }
          />

          {sinister.driver_responsability && (
            <>
              <Divider />
              <Row
                label="Part engagée"
                value={`${sinister.driver_engaged_responsability}%`}
              />
            </>
          )}
        </Card.Content>
      </Card>

      <SectionTitle title="Dates" />

      <Card style={styles.card}>
        <Card.Content>
          <Row
            label="Date du sinistre"
            value={formatDate(
              sinister.sinister_datetime
            )}
          />
          <Divider />
          <Row
            label="Date d'appel"
            value={formatDate(
              sinister.call_datetime
            )}
          />
        </Card.Content>
      </Card>

      {!!sinister.context && (
        <>
          <SectionTitle title="Contexte" />

          <Card style={styles.card}>
            <Card.Content>
              <Text style={{ lineHeight: 22, color: "#111111" }}>
                {sinister.context}
              </Text>
            </Card.Content>
          </Card>
        </>
      )}

      <SectionTitle
        title={`Demandes (${sinister.requests?.length ?? 0})`}
      />

      {sinister.requests?.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={{ lineHeight: 22, color: "#111111" }}>Aucune demande</Text>
          </Card.Content>
        </Card>
      ) : (
        sinister.requests.map((req) => {
          const info = STATUS_LABELS[req.status];

          return (
            <Card
              key={req.id}
              style={styles.requestCard}
            >
              <Card.Content style={styles.requestRow}>
                <Text style={{ lineHeight: 22, color: "#111111" }}>
                  Demande #{req.id}
                </Text>

                {info && (
                  <Chip
                    compact
                    style={{
                      backgroundColor: info.bg,
                    }}
                    textStyle={{
                      color: info.color,
                    }}
                  >
                    {info.label}
                  </Chip>
                )}
              </Card.Content>
            </Card>
          );
        })
      )}

      <SectionTitle title="Dépôt de document" />

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>
            Libellé du document
          </Text>

          <View style={styles.chipsWrap}>
            {[
              {
                value: "CNI",
                label: "CNI conducteur",
              },
              {
                value: "REGISTRATION",
                label: "Carte grise",
              },
              {
                value: "INSURANCE",
                label:
                  "Attestation assurance",
              },
            ].map((item) => (
              <Chip
                key={item.value}
                selected={label === item.value}
                onPress={() =>
                  setLabel(item.value)
                }
                style={styles.docChip}
                textStyle={{ color: "#FFFFFF" }}
              >
                {item.label}
              </Chip>
            ))}
          </View>

          <Button
            mode="outlined"
            icon="paperclip"
            onPress={pickDocument}
            textColor="#111111"
            style={{ marginTop: 10 }}
          >
            {file
              ? file.name
              : "Sélectionner un fichier"}
          </Button>

          {file?.size && (
            <Text style={styles.fileSize}>
              {(file.size / 1048576).toFixed(1)} Mo
            </Text>
          )}

          {uploadMsg && (
            <Text
              style={{
                marginTop: 12,
                color: uploadMsg.ok
                  ? "#3B6D11"
                  : "#A32D2D",
              }}
            >
              {uploadMsg.text}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={sendDocument}
            disabled={!file || uploading}
            loading={uploading}
            style={{ marginTop: 16 }}
            buttonColor="#185FA5"
            textColor="#FFFFFF"
          >
            Envoyer
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <List.Item
      title={label}
      right={() => (
        <Text style={styles.value}>
          {value}
        </Text>
      )}
      titleStyle={styles.rowLabel}
      style={{ paddingHorizontal: 0 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
  },

  backBtn: {
    alignSelf: "flex-start",
    marginBottom: 12,
    marginLeft: -8,
  },

  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  requestCard: {
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  requestRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  plate: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "600",
    color: "#185FA5",
  },

  sectionTitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  rowLabel: {
    color: "#6B7280",
    fontSize: 14,
  },

  value: {
    fontWeight: "600",
    color: "#111111",
    marginTop: 6,
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  docChip: {
    marginBottom: 8,
    color: "#111111",
  },

  fileSize: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
});