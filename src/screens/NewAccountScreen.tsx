import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n } from "../contexts/LanguageContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { createAccount } from "../services/bankingApi";
import { useNavigation } from "@react-navigation/native";

export default function NewAccountScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [type, setType] = useState<"ahorros" | "corriente">("ahorros");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!user?.id) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    if (!name.trim()) {
      Alert.alert(
        i18n.t("error") ?? "Error",
        i18n.t("accountNameRequired") ?? "Ingresa un nombre para la cuenta."
      );
      return;
    }

    try {
      setLoading(true);
      await createAccount({
        usuarioId: user.id,
        nombre: name.trim(),
        tipo: type,
        moneda: "HNL",
      });

      Alert.alert(
        i18n.t("accountCreatedTitle") ?? "Cuenta creada",
        i18n.t("accountCreatedMessage") ??
          "Tu nueva cuenta ha sido creada correctamente.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e: any) {
      console.error("NewAccountScreen create error:", e);
      Alert.alert(
        i18n.t("error") ?? "Error",
        i18n.t("accountCreateError") ??
          "No se pudo crear la cuenta. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background, flex: 1 }}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("newAccount") ?? "Nueva cuenta"}
      </Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {i18n.t("newAccountDescription") ??
          "Crea una nueva cuenta bancaria a tu nombre."}
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <CustomInput
          value={name}
          onChange={setName}
          placeholder={i18n.t("accountName") ?? "Nombre de la cuenta"}
        />

        <Text style={[styles.label, { color: colors.text }]}>
          {i18n.t("accountType") ?? "Tipo de cuenta"}
        </Text>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === "ahorros" && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setType("ahorros")}
          >
            <Text
              style={[
                styles.toggleText,
                type === "ahorros"
                  ? { color: colors.onPrimary }
                  : { color: colors.text },
              ]}
            >
              {i18n.t("savingsAccount") ?? "Cuenta de ahorros"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              type === "corriente" && { backgroundColor: colors.primary },
            ]}
            onPress={() => setType("corriente")}
          >
            <Text
              style={[
                styles.toggleText,
                type === "corriente"
                  ? { color: colors.onPrimary }
                  : { color: colors.text },
              ]}
            >
              {i18n.t("checkingAccount") ?? "Cuenta corriente"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.staticText, { color: colors.textSecondary }]}>
          Moneda: HNL
        </Text>

        <View style={{ marginTop: 10 }}>
          <View style={{ position: "relative" }}>
            <CustomButton
              title={i18n.t("createAccount") ?? "Crear cuenta"}
              onPress={loading ? () => {} : handleCreate}
            />
            {loading && (
              <View style={styles.loadingOverlay} pointerEvents="none">
                <ActivityIndicator size="small" color={colors.onPrimary} />
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700", marginBottom: 6 },
  description: { fontSize: 14, marginBottom: 12 },
  card: { borderRadius: 12, padding: 16 },
  label: { marginTop: 8, marginBottom: 6, fontWeight: "600" },
  toggleContainer: { flexDirection: "row", justifyContent: "space-between" },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleText: { fontWeight: "600" },
  staticText: { marginTop: 12, fontSize: 14 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
