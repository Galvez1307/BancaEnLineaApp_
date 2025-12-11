import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { Loan, fetchLoans } from "../services/bankingApi";

const LoansScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchLoans();
        if (isMounted) {
          setLoans(data);
        }
      } catch (error) {
        console.warn("Error al cargar préstamos:", error);
        if (isMounted) {
          setLoans([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [language]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{i18n.t("loansTitle")}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{i18n.t("loansSubtitle")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={loans}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                {i18n.t("loanBalance")}: L {item.balance.toLocaleString()}
              </Text>
              <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                {i18n.t("loanInstallment")}: {item.installment ?? "--"} / {i18n.t("loanDueDate")}: {item.dueDate ?? "--"}
              </Text>
              <View style={styles.actions}>
                <CustomButton title={i18n.t("loanPay")} onPress={() => {}} />
                <CustomButton title={i18n.t("loanDetail")} onPress={() => {}} variant="secondary" />
              </View>
            </View>
          )}
        />
      )}
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
  cardDesc: { fontSize: 13, marginBottom: 4 },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});

export default LoansScreen;
