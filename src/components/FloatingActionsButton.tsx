import React, { useState } from "react";
import {
  Alert,
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

type FloatingActionsButtonProps = {
  onTransferPress?: () => void;
  onCardPaymentPress?: () => void;
  onLoanPaymentPress?: () => void;
};

const FloatingActionsButton: React.FC<FloatingActionsButtonProps> = ({
  onTransferPress,
  onCardPaymentPress,
  onLoanPaymentPress,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [isVisible, setIsVisible] = useState(false);

  const closeSheet = () => setIsVisible(false);

  const triggerAction = (action?: () => void) => {
    closeSheet();
    setTimeout(() => {
      if (action) {
        action();
      } else {
        Alert.alert(i18n.t("soonTitle"), i18n.t("soonBody"));
      }
    }, 180);
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
              {
                backgroundColor: colors.card,
                shadowColor: colors.shadow,
              },
            ]}
          >
            <Text style={[styles.sheetTitle, { color: colors.text }]}>
              {i18n.t("quickActions")}
            </Text>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(onTransferPress)}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={24}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {i18n.t("actionTransfer")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(onCardPaymentPress)}
            >
              <Ionicons
                name="card-outline"
                size={24}
                color={colors.primary}
                style={styles.actionIcon}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {i18n.t("actionPayCard")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => triggerAction(onLoanPaymentPress)}
            >
              <Ionicons
                name="cash-outline"
                size={24}
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

      <View pointerEvents="box-none" style={styles.fabWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.fabButton,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.shadow,
            },
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
  fabWrapper: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
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

export default FloatingActionsButton;
