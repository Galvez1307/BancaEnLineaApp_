import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { Account, Transaction, fetchAccounts, fetchAccountMovements } from "../services/bankingApi";

type RouteParams = {
  accountId: string;
};

const AccountDetailScreen = () => {
  const route = useRoute<any>();
  const { accountId } = route.params as RouteParams;
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();

  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [accountsData, tx] = await Promise.all([
        fetchAccounts(),
        fetchAccountMovements(accountId),
      ]);
      setAccount(accountsData.find((a) => a.id === accountId) || null);
      setTransactions(tx);
      setLoading(false);
    };
    load();
  }, [accountId, language]);

  if (!account && !loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>{i18n.t("accountNotFound")}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : account ? (
        <>
          <Text style={[styles.title, { color: colors.text }]}>{account.name}</Text>
          <Text style={[styles.number, { color: colors.textSecondary }]}>
            {account.number}
          </Text>
          <Text style={[styles.balance, { color: colors.text }]}>
            {i18n.t("balanceLabel")}: {account.currency} {account.balance.toFixed(2)}
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t("recentMovements")}
          </Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.txItem, { borderBottomColor: colors.border }]}>
                <View>
                  <Text style={[styles.txDesc, { color: colors.text }]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    {
                      color: item.amount < 0 ? colors.danger : colors.success,
                    },
                  ]}
                >
                  {item.amount < 0 ? "-" : "+"} {account.currency}{" "}
                  {Math.abs(item.amount).toFixed(2)}
                </Text>
              </View>
            )}
          />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  number: { fontSize: 12, marginTop: 4, marginBottom: 4 },
  balance: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  txItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  txDesc: { fontWeight: "500" },
  txDate: { fontSize: 12 },
  txAmount: { fontWeight: "bold" },
});

export default AccountDetailScreen;
