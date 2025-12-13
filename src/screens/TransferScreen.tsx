import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchAccounts,
  makeTransfer,
  getAccountIdByNumber,
  Account,
} from "../services/bankingApi";

const TransferScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  void language;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState<string>("");
  const [destinationAccountNumber, setDestinationAccountNumber] =
    useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [concept, setConcept] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingAccounts(true);
      try {
        if (!user?.id) {
          setAccounts([]);
          return;
        }
        const data = await fetchAccounts(user.id);
        setAccounts(data);
      } catch (err: any) {
        Alert.alert(
          i18n.t("errorTitle") ?? "Error",
          err?.message ?? "No se pudieron cargar las cuentas."
        );
      } finally {
        setLoadingAccounts(false);
      }
    };
    load();
  }, [user?.id, language]);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert("Error", "No hay usuario autenticado.");
      return;
    }

    if (!fromAccountId || !destinationAccountNumber.trim() || !amount.trim()) {
      Alert.alert(
        i18n.t("requiredField") ?? "Campos requeridos",
        "Selecciona la cuenta origen, la cuenta destino y el monto."
      );
      return;
    }

    const montoNumber = Number(amount.replace(",", "."));
    if (isNaN(montoNumber) || montoNumber <= 0) {
      Alert.alert("Error", "El monto debe ser mayor a 0.");
      return;
    }

    setLoading(true);
    try {
      // Resolve destination account id by number (can be another user's account)
      const cuentaDestinoId = await getAccountIdByNumber(
        destinationAccountNumber
      );

      if (fromAccountId === cuentaDestinoId) {
        Alert.alert(
          "Error",
          "La cuenta origen y destino no pueden ser la misma."
        );
        return;
      }

      await makeTransfer({
        usuarioId: user.id,
        cuentaOrigenId: fromAccountId,
        cuentaDestinoId,
        monto: montoNumber,
        concepto: concept || undefined,
      });

      Alert.alert(
        i18n.t("transferSentTitle") ?? "Éxito",
        i18n.t("transferSentBody", {
          amount: montoNumber,
          destination: destinationAccountNumber,
        }) ?? "La transferencia se realizó correctamente.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        e?.message ||
          "No se pudo realizar la transferencia. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = (
    item: Account,
    selected: string,
    onSelect: (id: string) => void
  ) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => onSelect(item.id)}
      style={[
        styles.accountRow,
        {
          borderColor: colors.border,
          backgroundColor:
            selected === item.id ? colors.primary + "22" : colors.card,
        },
      ]}
    >
      <Text style={[styles.accountName, { color: colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.accountNumber, { color: colors.textSecondary }]}>
        {item.number}
      </Text>
      <Text style={[styles.accountBalance, { color: colors.text }]}>
        {item.currency} {item.balance.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("transferTitle")}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>
        {i18n.t("transferFrom") ?? "Cuenta origen"}
      </Text>
      {loadingAccounts ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) =>
            renderAccountItem(item, fromAccountId, setFromAccountId)
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <Text style={[styles.label, { color: colors.text }]}>
        {i18n.t("transferDestinationNumber")}
      </Text>
      <CustomInput
        value={destinationAccountNumber}
        placeholder={
          i18n.t("transferDestination") ?? i18n.t("transferDestinationNumber")
        }
        onChange={setDestinationAccountNumber}
      />

      <CustomInput
        value={amount}
        placeholder={i18n.t("transferAmount") ?? "Monto"}
        onChange={setAmount}
        type="number"
      />
      <CustomInput
        value={concept}
        placeholder={i18n.t("transferDescription") ?? "Concepto (opcional)"}
        onChange={setConcept}
      />

      <CustomButton
        title={i18n.t("confirmTransfer") ?? "Confirmar transferencia"}
        onPress={handleConfirm}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 6,
    fontWeight: "600",
  },
  accountRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    minWidth: 200,
  },
  accountName: {
    fontWeight: "600",
  },
  accountNumber: {
    fontSize: 12,
    marginTop: 4,
  },
  accountBalance: {
    marginTop: 8,
    fontWeight: "700",
  },
});

export default TransferScreen;
