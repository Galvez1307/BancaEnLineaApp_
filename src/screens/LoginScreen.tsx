import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();

  const rawPlaceholder = i18n.t("emailPlaceholder");
  const placeholder =
    rawPlaceholder &&
    typeof rawPlaceholder === "string" &&
    !rawPlaceholder.startsWith("[missing")
      ? rawPlaceholder
      : language === "es"
      ? "Ingresa tu correo"
      : "Enter your email";

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos incompletos", "Ingresa usuario y contraseña.");
      return;
    }

    const isOk = login(email);

    if (isOk) {
      navigation.navigate("Tabs", { email });
    } else {
      Alert.alert(
        "Acceso denegado",
        "No tienes permisos para acceder a la banca en línea."
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Banco en Linea</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Inicia sesión para ver tus cuentas
      </Text>

      <CustomInput
        type="email"
        value={email}
        placeholder={placeholder}
        onChange={setEmail}
        required
      />

      <CustomInput
        type="password"
        value={password}
        placeholder="Contraseña"
        onChange={setPassword}
        required
      />

      <CustomButton title="Ingresar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
  },
});

export default LoginScreen;
