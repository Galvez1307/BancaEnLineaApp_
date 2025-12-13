import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../utils/theme";
import { useAuth } from "../contexts/AuthContext";
import { fetchNotifications } from "../services/bankingApi";

type NotificationBellProps = {
  onPress: () => void;
};

const POLLING_INTERVAL = 30_000;

const NotificationBell: React.FC<NotificationBellProps> = ({ onPress }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let interval: ReturnType<typeof setInterval> | null = null;

    const loadNotifications = async () => {
      if (!user?.id) {
        if (isMounted) {
          setUnreadCount(0);
        }
        return;
      }

      try {
        const notifications = await fetchNotifications(user.id);
        if (isMounted) {
          const unread = notifications.filter((notification) => !notification.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.warn("Failed to load notifications:", error);
      }
    };

    loadNotifications();
    interval = setInterval(loadNotifications, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user?.id]);

  const iconColor = (colors as any).icon ?? colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.touchable}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="notifications-outline" size={22} color={iconColor} />
      {unreadCount > 0 && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: colors.primary,
              borderColor: colors.card,
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  dot: {
    position: "absolute",
    top: 4,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
});

export default NotificationBell;
