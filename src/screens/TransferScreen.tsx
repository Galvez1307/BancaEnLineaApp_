import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { i18n, useLanguage } from "../contexts/LanguageContext";

const TransferScreen = () => {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const navigation = useNavigation<any>();
  const { language } = useLanguage();
  void language; // re-render on language change for i18n

  const handleTransfer = () => {
    if (!destination.trim() || !amount.trim()) {
      Alert.alert(i18n.t("transferMissingTitle"), i18n.t("transferMissingBody"));
      return;
    }

    Alert.alert(
      i18n.t("transferSentTitle"),
      i18n.t("transferSentBody", { amount, destination })
    );

    setDestination("");
    setAmount("");
    setDescription("");
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("transferTitle")}
      </Text>

      <CustomInput
        value={destination}
        placeholder={i18n.t("transferDestination")}
        onChange={setDestination}
        required
      />
      <CustomInput
        type="number"
        value={amount}
        placeholder={i18n.t("transferAmount")}
        onChange={setAmount}
        required
      />
      <CustomInput
        value={description}
        placeholder={i18n.t("transferDescription")}
        onChange={setDescription}
      />

      <CustomButton title={i18n.t("transferSubmit")} onPress={handleTransfer} />
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
    marginBottom: 16,
    fontWeight: "600",
  },
});

export default TransferScreen;
