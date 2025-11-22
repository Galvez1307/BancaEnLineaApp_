// src/screens/HomeScreen.tsx
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { i18n } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { accounts } from "../data/accounts";

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const total = accounts.reduce((acc, item) => acc + item.balance, 0);

  const handleTransfer = () => {
    navigation.navigate("Transfer");
  };

  const handleGoToAccount = (id: string) => {
    navigation.navigate("AccountDetail", { accountId: id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.greeting, { color: colors.text }]}>
        {i18n.t("welcome") || "Hola"},
        {user?.email ? ` ${user.email}` : " cliente"}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Resumen de tu banca en línea
      </Text>

      <View style={styles.summaryCard}>
        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
          Saldo total
        </Text>
        <Text style={[styles.summaryAmount, { color: colors.text }]}>
          L {total.toFixed(2)}
        </Text>
        <Text style={[styles.summaryHelper, { color: colors.textSecondary }]}>
          Este es el saldo combinado de todas tus cuentas.
        </Text>
      </View>

      <CustomButton title="Hacer transferencia" onPress={handleTransfer} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Tus cuentas
      </Text>
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.accountCard, { borderColor: colors.border }]}
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
    backgroundColor: "#ffffff22",
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
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
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
