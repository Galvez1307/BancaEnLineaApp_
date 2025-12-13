import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { i18n } from "../contexts/LanguageContext";
import { useNavigation } from "@react-navigation/native";

const QuickActionsTabButton: React.FC<any> = (_props) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation<any>();

  const closeSheet = () => setIsVisible(false);

  const triggerAction = (action?: () => void) => {
    closeSheet();
    setTimeout(() => {
      if (action) action();
    }, 180);
  };

  const goToTransfer = () => {
    const root = navigation.getParent?.() ?? navigation;
    root.navigate("Transfer");
  };

  const goToCards = () => {
    const root = navigation.getParent?.() ?? navigation;
    root.navigate("Cards");
  };

  const goToLoans = () => {
    const root = navigation.getParent?.() ?? navigation;
    root.navigate("Loans");
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent
        visible={isVisible}
        onRequestClose={closeSheet}
      >
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={closeSheet}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.card, shadowColor: colors.shadow },
            ]}
          >
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {i18n.t("quickActions")}
            </Text>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(goToTransfer)}
            >
              <Ionicons
                name="swap-horizontal"
                size={22}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {i18n.t("actionTransfer")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(goToCards)}
            >
              <Ionicons
                name="card-outline"
                size={22}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {i18n.t("actionPayCard")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(goToLoans)}
            >
              <Ionicons
                name="cash-outline"
                size={22}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {i18n.t("actionPayLoan")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.wrapper} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.fabButton,
            { backgroundColor: colors.primary, shadowColor: colors.shadow },
          ]}
          onPress={() => setIsVisible(true)}
        >
          <Ionicons
            name="swap-horizontal"
            size={28}
            color={colors.onPrimary ?? "#fff"}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    top: -28,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default QuickActionsTabButton;
