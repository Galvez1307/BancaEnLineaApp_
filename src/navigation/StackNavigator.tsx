import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TabsNavigator from "./TabsNavigator";
import TransferScreen from "../screens/TransferScreen";
import AccountDetailScreen from "../screens/AccountDetailScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import CardsScreen from "../screens/CardsScreen";
import LoansScreen from "../screens/LoansScreen";
import LoanRequestScreen from "../screens/LoanRequestScreen";
import LoanPaymentScreen from "../screens/LoanPaymentScreen";
import { i18n, useLanguage } from "../contexts/LanguageContext";

export type RootStackParamList = {
  Login: undefined;
  Tabs: { email: string };
  Home: undefined;
  Transfer: undefined;
  Payments: undefined;
  Cards: undefined;
  Loans: undefined;
  LoanRequest: undefined;
  LoanPayment: { loan: any };
  AccountDetail: { accountId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { language } = useLanguage();

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Tabs" component={TabsNavigator} />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{ headerShown: true, title: i18n.t("transferTitle") }}
      />
      <Stack.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{ headerShown: true, title: i18n.t("paymentsTitle") }}
      />
      <Stack.Screen
        name="Cards"
        component={CardsScreen}
        options={{ headerShown: true, title: i18n.t("cardsTitle") }}
      />
      <Stack.Screen
        name="Loans"
        component={LoansScreen}
        options={{ headerShown: true, title: i18n.t("loansTitle") }}
      />
      <Stack.Screen
        name="LoanRequest"
        component={LoanRequestScreen}
        options={{
          headerShown: true,
          title: i18n.t("requestLoan") ?? "Solicitar préstamo",
        }}
      />
      <Stack.Screen
        name="LoanPayment"
        component={LoanPaymentScreen}
        options={{
          headerShown: true,
          title: i18n.t("loanPaymentTitle") ?? "Pagar préstamo",
        }}
      />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetailScreen}
        options={{ headerShown: true, title: i18n.t("accountDetailTitle") }}
      />
    </Stack.Navigator>
  );
}
