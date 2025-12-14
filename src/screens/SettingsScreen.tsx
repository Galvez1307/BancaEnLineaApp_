import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../components/CustomInput";
import { fetchRate } from "../services/exchangeApi";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const colors = getThemeColors(theme);
  const { language, changeLanguage } = useLanguage();

  const DEFAULT_RATE = 24.5;
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_RATE);
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [usdAmount, setUsdAmount] = useState("");
  const [hnlAmount, setHnlAmount] = useState("");

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    const n = Number(value.replace(",", "."));
    if (!isNaN(n)) {
      setHnlAmount((n * exchangeRate).toFixed(2));
    } else {
      setHnlAmount("");
    }
  };

  const handleHnlChange = (value: string) => {
    setHnlAmount(value);
    const n = Number(value.replace(",", "."));
    if (!isNaN(n) && exchangeRate > 0) {
      setUsdAmount((n / exchangeRate).toFixed(2));
    } else {
      setUsdAmount("");
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadRate = async () => {
      setIsFetchingRate(true);
      try {
        const r = await fetchRate("USD", "HNL");
        if (mounted && typeof r === "number") {
          setExchangeRate(r);
          console.log("Fetched exchange rate USD->HNL:", r);
        } else {
          console.log(
            "Exchange rate not available; keeping default:",
            DEFAULT_RATE
          );
        }
      } catch (err) {
        console.log("Could not fetch exchange rate, keeping default:", err);
      } finally {
        if (mounted) setIsFetchingRate(false);
      }
    };
    loadRate();
    return () => {
      mounted = false;
    };
  }, []);

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

        {/* Exchange rate card */}
        <View style={[styles.exchangeCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {i18n.t("exchangeRate") ?? "Tasa de cambio"}
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.textSecondary }]}
          >
            USD ↔ HNL
          </Text>

          <Text
            style={[styles.rateText, { color: colors.text }]}
          >{`1 USD = ${exchangeRate.toFixed(2)} HNL`}</Text>

          <View style={styles.exchangeRow}>
            <Text style={[styles.label, { color: colors.text }]}>USD</Text>
            <CustomInput
              value={usdAmount}
              onChange={handleUsdChange}
              type="number"
              placeholder="0.00"
            />
          </View>

          <View style={styles.exchangeRow}>
            <Text style={[styles.label, { color: colors.text }]}>HNL</Text>
            <CustomInput
              value={hnlAmount}
              onChange={handleHnlChange}
              type="number"
              placeholder="0.00"
            />
          </View>
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
  exchangeCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginBottom: 12,
  },
  rateText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 12,
  },
  exchangeRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
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
