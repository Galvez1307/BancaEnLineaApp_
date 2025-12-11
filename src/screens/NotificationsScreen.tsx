import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n, useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Notification, fetchNotifications } from "../services/bankingApi";

const NotificationsScreen = () => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { language } = useLanguage();
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!user?.id) {
        setItems([]);
        setLoading(false);
        return;
      }
      const data = await fetchNotifications(user.id);
      setItems(data);
      setLoading(false);
    };
    load();
  }, [language, user?.id]);

  const toggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>{i18n.t("notificationsTitle")}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {i18n.t("notificationsSubtitle")}
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleRead(item.id)}
              style={[
                styles.card,
                { borderColor: colors.border, backgroundColor: item.read ? colors.backgroundAlt : colors.card },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>
                  {item.body}
                </Text>
                <Text style={[styles.cardDate, { color: colors.textSecondary }]}>
                  {item.date}
                </Text>
              </View>
              <Text style={{ color: colors.textSecondary }}>
                {item.read ? i18n.t("notificationsRead") : i18n.t("notificationsMark")}
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  cardDesc: { fontSize: 13 },
  cardDate: { fontSize: 12, marginTop: 4 },
});

export default NotificationsScreen;
