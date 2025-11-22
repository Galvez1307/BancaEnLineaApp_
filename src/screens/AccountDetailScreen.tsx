import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { accounts, transactionsByAccount } from "../data/accounts";

type RouteParams = {
  accountId: string;
};

const AccountDetailScreen = () => {
  const route = useRoute<any>();
  const { accountId } = route.params as RouteParams;
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const account = accounts.find((a) => a.id === accountId);
  const transactions = account ? transactionsByAccount[account.id] || [] : [];

  if (!account) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No se encontró la cuenta.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{account.name}</Text>
      <Text style={[styles.number, { color: colors.textSecondary }]}>
        {account.number}
      </Text>
      <Text style={[styles.balance, { color: colors.text }]}>
        Saldo: {account.currency} {account.balance.toFixed(2)}
      </Text>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Movimientos recientes
      </Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
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
                  color: item.amount < 0 ? "#e53935" : "#2e7d32",
                },
              ]}
            >
              {item.amount < 0 ? "-" : "+"} {account.currency}{" "}
              {Math.abs(item.amount).toFixed(2)}
            </Text>
          </View>
        )}
      />
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
    borderBottomColor: "#eee",
  },
  txDesc: { fontWeight: "500" },
  txDate: { fontSize: 12 },
  txAmount: { fontWeight: "bold" },
});

export default AccountDetailScreen;
