import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Account, fetchAccounts } from "../services/bankingApi";
import CustomButton from "../components/CustomButton";

const AccountsScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { language } = useLanguage();
  const { user } = useAuth();
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
    if (isFocused) {
      load();
    }
  }, [language, user?.id, isFocused]);

  const handlePressAccount = (id: string) => {
    navigation.navigate("AccountDetail", { accountId: id });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("yourAccounts")}
      </Text>

      <CustomButton
        title={i18n.t("openNewAccount") ?? "Abrir nueva cuenta"}
        onPress={() => navigation.navigate("NewAccount")}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={accountList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { borderColor: colors.border }]}
              onPress={() => handlePressAccount(item.id)}
            >
              <Text style={[styles.accountName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.accountNumber, { color: colors.textSecondary }]}
              >
                {item.number}
              </Text>
              <Text style={[styles.balance, { color: colors.text }]}>
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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 16 },
  card: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  accountName: { fontWeight: "600", fontSize: 16, marginBottom: 4 },
  accountNumber: { fontSize: 12, marginBottom: 4 },
  balance: { fontWeight: "bold", fontSize: 16 },
});

export default AccountsScreen;
