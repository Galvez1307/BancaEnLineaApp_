import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { useNavigation } from "@react-navigation/native";

const TransferScreen = () => {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const navigation = useNavigation<any>();

  const handleTransfer = () => {
    if (!destination.trim() || !amount.trim()) {
      Alert.alert("Campos incompletos", "Completa cuenta destino y monto.");
      return;
    }

    Alert.alert(
      "Transferencia enviada",
      `Enviaste L ${amount} a ${destination} (simulado)`
    );

    setDestination("");
    setAmount("");
    setDescription("");
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Nueva transferencia
      </Text>

      <CustomInput
        value={destination}
        placeholder="Cuenta destino o nombre"
        onChange={setDestination}
        required
      />
      <CustomInput
        type="number"
        value={amount}
        placeholder="Monto"
        onChange={setAmount}
        required
      />
      <CustomInput
        value={description}
        placeholder="Descripción (opcional)"
        onChange={setDescription}
      />

      <CustomButton title="Enviar transferencia" onPress={handleTransfer} />
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
