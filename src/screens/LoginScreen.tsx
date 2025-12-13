import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(i18n.t("loginMissingTitle"), i18n.t("loginMissingBody"));
      return;
    }

    const isOk = await login(email, password);

    if (isOk) {
      navigation.navigate("Tabs", { email });
    } else {
      Alert.alert(i18n.t("loginDeniedTitle"), i18n.t("loginDeniedBody"));
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(i18n.t("loginMissingTitle"), i18n.t("loginMissingBody"));
      return;
    }

    if (!supabase) {
      Alert.alert("Error", "Supabase no está configurado.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(i18n.t("requiredField"), i18n.t("invalidEmail"));
      return;
    }

    if (password.length < 6) {
      Alert.alert(i18n.t("requiredField"), i18n.t("weakPassword"));
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert(
        i18n.t("signupErrorTitle"),
        error.message || i18n.t("signupErrorBody")
      );
      return;
    }

    const isOk = await login(email, password);
    if (isOk) {
      Alert.alert(i18n.t("signupSuccessTitle"), i18n.t("signupSuccessBody"));
      navigation.navigate("Tabs", { email });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {i18n.t("appName")}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {i18n.t("loginTitle")}
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
        placeholder={i18n.t("passwordPlaceholder")}
        onChange={setPassword}
        required
      />

      <CustomButton title={i18n.t("login")} onPress={handleLogin} />

      <View style={{ marginTop: 16, alignItems: "center" }}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {i18n.t("noAccountQuestion")}
        </Text>
        <CustomButton
          title={i18n.t("signup")}
          onPress={handleRegister}
          variant="secondary"
        />
      </View>
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
