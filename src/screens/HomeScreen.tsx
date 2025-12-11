// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { fetchAccounts, Account } from "../services/bankingApi";

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();

  const [accountList, setAccountList] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!user?.id) {
        setAccountList([]);
        setLoading(false);
        return;
      }
      const data = await fetchAccounts(user.id);
      setAccountList(data);
      setLoading(false);
    };
    load();
  }, [language, user?.id]);

  const total = accountList.reduce((acc, item) => acc + item.balance, 0);

  const handleTransfer = () => {
    navigation.navigate("Transfer");
  };

  const handleGoToAccount = (id: string) => {
    navigation.navigate("AccountDetail", { accountId: id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {i18n.t("welcome") || "Hola"}
        {user?.email ? `, ${user.email}` : ""}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {i18n.t("homeSubtitle")}
      </Text>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          {i18n.t("totalBalance")}
        </Text>
        <Text style={[styles.summaryAmount, { color: colors.text }]}>
          L {total.toFixed(2)}
        </Text>
        <Text style={[styles.summaryHelper, { color: colors.textSecondary }]}>
          {i18n.t("totalBalanceHelper")}
        </Text>
      </View>

      <CustomButton title={i18n.t("makeTransfer")} onPress={handleTransfer} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {i18n.t("yourAccounts")}
      </Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={accountList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.accountCard,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={() => handleGoToAccount(item.id)}
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
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  summaryHelper: {
    fontSize: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  accountCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  accountName: {
    fontWeight: "600",
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 12,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
