import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";

type Props = {
  clientName: string;
  service: string;
  time: string;
}

export default function AppointmentCard({ clientName, service, time }: Props) {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{clientName}</Text>
      <Text style={{ color: colors.textSecondary }}>{service}</Text>
      <Text style={{ color: colors.textSecondary }}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
