import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { Card, fetchCards } from "../services/bankingApi";

const CardsScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchCards();
        if (isMounted) {
          setCards(data);
        }
      } catch (error) {
        console.warn("Error al cargar tarjetas:", error);
        if (isMounted) {
          setCards([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [language]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{i18n.t("cardsTitle")}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{i18n.t("cardsSubtitle")}</Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { borderColor: colors.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.type} **** {item.last4}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  {i18n.t("cardLimit")}: {item.limit ?? "--"} | {i18n.t("cardBalance")}: {item.balance ?? "--"}
                </Text>
              </View>
              <View style={styles.actions}>
                <CustomButton title={i18n.t("cardBlock")} onPress={() => {}} />
                <CustomButton title={i18n.t("cardMovements")} onPress={() => {}} variant="secondary" />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 13, marginBottom: 8 },
  actions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-start",
  },
});

export default CardsScreen;
