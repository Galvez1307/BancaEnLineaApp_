import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TabsNavigator from "./TabsNavigator";
import TransferScreen from "../screens/TransferScreen";
import AccountDetailScreen from "../screens/AccountDetailScreen";

export type RootStackParamList = {
  Login: undefined;
  Tabs: { email: string };
  Home: undefined;
  Transfer: undefined;
  AccountDetail: { accountId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{ headerShown: true, title: "Nueva transferencia" }}
      />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{ headerShown: true, title: "Detalle de cuenta" }}
      />
    </Stack.Navigator>
  );
}
