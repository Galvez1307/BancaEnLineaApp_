import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { fetchPayments, Payment } from "../services/bankingApi";

const PaymentsScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchPayments();
      setPayments(data);
      setLoading(false);
    };
    load();
  }, [language]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{i18n.t("paymentsTitle")}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {i18n.t("paymentsSubtitle")}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: colors.border }]}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.description ?? i18n.t("paymentCard")}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  {item.type} • {item.status} {item.createdAt ? `• ${item.createdAt}` : ""}
                </Text>
              </View>
              <CustomButton title={i18n.t("paymentPay")} onPress={() => {}} />
            </View>
          )}
        />
      )}

      <CustomButton title={i18n.t("paymentNew")} onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 13 },
});

export default PaymentsScreen;
