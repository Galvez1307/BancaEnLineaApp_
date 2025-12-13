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
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { fetchAccounts, payLoan, Account } from "../services/bankingApi";

const LoanPaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { loan } = route.params ?? {};
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const { user } = useAuth();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState<string>(
    loan?.cuentaId ?? ""
  );
  const [amount, setAmount] = useState<string>("");
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

  const handlePay = async () => {
    if (!user) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        "No hay usuario autenticado."
      );
      return;
    }
    if (!fromAccountId || !amount.trim()) {
      Alert.alert(
        i18n.t("requiredField") ?? "Campo requerido",
        "Selecciona cuenta y monto."
      );
      return;
    }

    const montoNumber = Number(amount.replace(",", "."));
    if (isNaN(montoNumber) || montoNumber <= 0) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        "El monto debe ser mayor a 0."
      );
      return;
    }

    setLoading(true);
    try {
      await payLoan({
        usuarioId: user.id,
        prestamoId: loan.id,
        cuentaOrigenId: fromAccountId,
        montoPrincipal: montoNumber,
        montoInteres: 0,
      });

      Alert.alert(
        i18n.t("loanPaymentSuccess") ?? "Pago realizado",
        i18n.t("loanPaymentSuccessBody") ?? "El pago se realizó correctamente.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert(
        i18n.t("errorTitle") ?? "Error",
        e?.message ?? "No se pudo realizar el pago."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = (item: Account) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setFromAccountId(item.id)}
      style={[
        styles.accountRow,
        {
          borderColor: colors.border,
          backgroundColor:
            fromAccountId === item.id ? colors.primary + "22" : colors.card,
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
        {i18n.t("loanPaymentTitle") ?? "Pagar préstamo"}
      </Text>
      <Text style={[styles.label, { color: colors.text }]}>{loan?.name}</Text>
      <Text style={[styles.label, { color: colors.text }]}>
        {i18n.t("loanBalance")}: L {loan?.balance?.toLocaleString?.() ?? "--"}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>Cuenta origen</Text>
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

      <CustomInput
        value={amount}
        placeholder={i18n.t("paymentAmount") ?? "Monto a pagar"}
        onChange={setAmount}
        type="number"
      />

      <CustomButton
        title={i18n.t("loanPay") ?? "Pagar préstamo"}
        onPress={handlePay}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  accountRow: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    minWidth: 200,
  },
});

export default LoanPaymentScreen;
