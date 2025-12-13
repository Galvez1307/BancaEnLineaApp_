import React from "react";
import { View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountsScreen from "../screens/AccountsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import QuickActionsTabButton from "../components/QuickActionsTabButton";
import NotificationsScreen from "../screens/NotificationsScreen";
import { i18n } from "../contexts/LanguageContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getThemeColors } from "../utils/theme";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "../components/NotificationBell";

export type TabsParamList = {
  Home: undefined;
  Accounts: undefined;
  QuickActions: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

const HeaderActions: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      const rootNavigation = navigation?.getParent?.() ?? navigation;
      rootNavigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch {
      // ignore logout errors
    }
  };

  const iconColor = (colors as any).icon ?? colors.text;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <NotificationBell onPress={() => navigation.navigate("Notifications")} />
      <TouchableOpacity
        onPress={handleLogout}
        style={{ paddingHorizontal: 8 }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="log-out-outline" size={22} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const TabsNavigator = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const colors = getThemeColors(theme);

  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitleStyle: { color: colors.text },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerRight: () => <HeaderActions navigation={navigation} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: i18n.t("homeTab"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{
          title: i18n.t("accountsTab"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="account-balance-wallet"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="QuickActions"
        component={() => null}
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => <QuickActionsTabButton {...props} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: i18n.t("notificationsTab"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: i18n.t("settingsTab"),
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
