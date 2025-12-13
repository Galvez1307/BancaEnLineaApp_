import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { fetchAccounts, requestLoan, Account } from "../services/bankingApi";

const LoanRequestScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [depositAccountId, setDepositAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [rate, setRate] = useState<string>("4");
  const [months, setMonths] = useState<string>("12");
  const [name, setName] = useState<string>("Préstamo personal");
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoadingAccounts(true);
      try {
        if (!user?.id) return;
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

  const handleRequest = async () => {
    if (!user) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        "No hay usuario autenticado."
      );
      return;
    }
    if (!depositAccountId || !amount.trim()) {
      Alert.alert(
        i18n.t("requiredField") ?? "Campo requerido",
        "Selecciona cuenta y monto."
      );
      return;
    }

    const montoNumber = Number(amount.replace(",", "."));
    const plazoNumber = Number(months);

    if (isNaN(montoNumber) || montoNumber <= 0) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        i18n.t("loanAmountInvalid") ?? "Enter a valid loan amount."
      );
      return;
    }

    if (montoNumber > 100000) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        i18n.t("loanAmountTooHigh") ?? "Loan amount cannot exceed 100,000."
      );
      return;
    }

    setLoading(true);
    try {
      const result = await requestLoan({
        usuarioId: user.id,
        cuentaDepositoId: depositAccountId,
        nombre: name,
        montoPrincipal: montoNumber,
        tasaInteres: 4,
        plazoMeses: isNaN(plazoNumber) ? 12 : plazoNumber,
      });

      const cuota = result?.cuota_mensual ?? result?.cuota ?? null;

      Alert.alert(
        i18n.t("requestLoanSuccess") ?? "Préstamo solicitado",
        cuota
          ? `Cuota mensual: L ${cuota}`
          : "Préstamo solicitado correctamente",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        e?.message ?? "No se pudo solicitar el préstamo."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = (item: Account) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setDepositAccountId(item.id)}
      style={[
        styles.accountRow,
        {
          borderColor: colors.border,
          backgroundColor:
            depositAccountId === item.id ? colors.primary + "22" : colors.card,
        },
      ]}
    >
      <Text style={{ color: colors.text, fontWeight: "600" }}>{item.name}</Text>
      <Text style={{ color: colors.textSecondary }}>{item.number}</Text>
      <Text style={{ color: colors.text }}>
        {item.currency} {item.balance.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("requestLoan") ?? "Solicitar préstamo"}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>
        Cuenta depósito
      </Text>
      {loadingAccounts ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={accounts}
          horizontal
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => renderAccountItem(item)}
        />
      )}

      <Text style={[styles.label, { color: colors.text }]}>{i18n.t("loanAmount") ?? "Loan amount"}</Text>
      <CustomInput
        value={amount}
        placeholder={i18n.t("loanAmount") ?? "Monto"}
        onChange={setAmount}
        type="number"
      />

      <Text style={[styles.label, { color: colors.text }]}>{i18n.t("interestRate") ?? "Interest rate"}</Text>
      <CustomInput
        value={rate}
        placeholder={i18n.t("loanRate") ?? "Tasa (%)"}
        onChange={() => {}}
        type="number"
        editable={false}
      />

      <Text style={[styles.label, { color: colors.text }]}>{i18n.t("loanTermMonths") ?? "Term (months)"}</Text>
      <CustomInput
        value={months}
        placeholder={i18n.t("loanTerm") ?? "Plazo (meses)"}
        onChange={setMonths}
        type="number"
      />

      <Text style={[styles.label, { color: colors.text }]}>{i18n.t("loanName") ?? "Loan name"}</Text>
      <CustomInput
        value={name}
        placeholder={i18n.t("loanName") ?? "Nombre del préstamo"}
        onChange={setName}
      />

      <CustomButton
        title={i18n.t("requestLoan") ?? "Solicitar préstamo"}
        onPress={handleRequest}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  accountRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    minWidth: 200,
  },
});

export default LoanRequestScreen;
