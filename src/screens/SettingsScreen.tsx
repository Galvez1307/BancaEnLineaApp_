import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setClientProfile } from "../store/clientSlice";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const colors = getThemeColors(theme);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const dispatch = useAppDispatch();
  const savedProfile = useAppSelector((state) => state.client);

  const [clientName, setClientName] = useState(savedProfile.name);
  const [phone, setPhone] = useState(savedProfile.phone);
  const [favoriteService, setFavoriteService] = useState(
    savedProfile.favoriteService
  );
  const [notes, setNotes] = useState(savedProfile.notes);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {i18n.t("settings")}
        </Text>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            {i18n.t("darkMode")}
          </Text>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            thumbColor={colors.primary}
          />
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>
            {i18n.t("language")}
          </Text>
          <View style={styles.langButtons}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "es"
                  ? { borderColor: colors.primary }
                  : { borderColor: colors.border },
              ]}
              onPress={() => changeLanguage("es")}
            >
              <Text
                style={{
                  color: language === "es" ? colors.primary : colors.text,
                }}
              >
                ES
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "en"
                  ? { borderColor: colors.primary }
                  : { borderColor: colors.border },
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text
                style={{
                  color: language === "en" ? colors.primary : colors.text,
                }}
              >
                EN
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowAdvanced(!showAdvanced)}>
          <Text style={[styles.advancedToggle, { color: colors.text }]}>
            {i18n.t("advanced")}
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                {i18n.t("notifications")}
              </Text>
              <Switch
                value={false}
                onValueChange={() => {}}
                thumbColor={colors.primary}
              />
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                {i18n.t("systemLanguage")}
              </Text>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {language.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        <View
          style={[styles.card, { backgroundColor: colors.card, marginTop: 18 }]}
        >
          <Text style={[styles.titleSmall, { color: colors.text }]}>
            {i18n.t("clientProfile")}
          </Text>

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {i18n.t("clientName")}
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={clientName}
            onChangeText={setClientName}
            placeholder={i18n.t("clientName")}
            placeholderTextColor="rgba(148,163,184,0.9)"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {i18n.t("phoneContact")}
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder={i18n.t("phoneContact")}
            placeholderTextColor="rgba(148,163,184,0.9)"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {i18n.t("favoriteService")}
          </Text>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={favoriteService}
            onChangeText={setFavoriteService}
            placeholder={i18n.t("favoriteService")}
            placeholderTextColor="rgba(148,163,184,0.9)"
          />

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {i18n.t("notes")}
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={notes}
            onChangeText={setNotes}
            placeholder={i18n.t("notes")}
            placeholderTextColor="rgba(148,163,184,0.9)"
            multiline
          />

          <CustomButton
            title={i18n.t("saveProfile")}
            onPress={() => {
              if (!clientName || !phone || !favoriteService) {
                Alert.alert(
                  i18n.t("profileIncompleteTitle"),
                  i18n.t("profileIncompleteBody")
                );
                return;
              }
              dispatch(
                setClientProfile({
                  name: clientName,
                  phone,
                  favoriteService,
                  notes,
                })
              );
              Alert.alert(i18n.t("profileSaved"));
            }}
            variant="primary"
          />
        </View>

        <CustomButton
          title={i18n.t("backToPanel")}
          onPress={() => navigation.navigate("Home")} // Regreso a HomeScreen (Stack)
          variant="secondary"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
  advancedToggle: {
    fontSize: 16,
    fontWeight: "500",
  },
  advancedSection: {
    marginTop: 20,
    gap: 10,
  },
  langButtons: {
    flexDirection: "row",
    gap: 10,
  },
  langButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 8,
    marginLeft: 8,
  },
  titleSmall: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});

export default SettingsScreen;
