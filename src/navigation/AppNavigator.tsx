import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import CalculatorScreen from "../screens/CalculatorScreen";
import BirthPrepScreen from "../screens/BirthPrepScreen";
import MoreScreen from "../screens/MoreScreen";

import NutritionScreen from "../screens/NutritionScreen";
import WeightTrackerScreen from "../screens/WeightTrackerScreen";
import HappyCardScreen from "../screens/HappyCardScreen";
import WorkRightsScreen from "../screens/WorkRightsScreen";
import MaternityLeaveScreen from "../screens/MaternityLeaveScreen";
import ParentalLeaveScreen from "../screens/ParentalLeaveScreen";
import ChildSubsidyScreen from "../screens/ChildSubsidyScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import ContactScreen from "../screens/ContactScreen";
import TermsScreen from "../screens/TermsScreen";

export type RootStackParamList = {
  Main: undefined;
  Nutrition: undefined;
  WeightTracker: undefined;
  HappyCard: undefined;
  WorkRights: undefined;
  MaternityLeave: undefined;
  ParentalLeave: undefined;
  ChildSubsidy: undefined;
  Privacy: undefined;
  Contact: undefined;
  Terms: undefined;
};

export type TabParamList = {
  홈: undefined;
  계산기: undefined;
  출산준비: undefined;
  더보기: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ec4899",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { paddingBottom: 6, height: 60 },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text> }}
      />
      <Tab.Screen
        name="계산기"
        component={CalculatorScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🗓️</Text> }}
      />
      <Tab.Screen
        name="출산준비"
        component={BirthPrepScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🎒</Text> }}
      />
      <Tab.Screen
        name="더보기"
        component={MoreScreen}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>☰</Text> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#ec4899",
          headerTitleStyle: { fontWeight: "bold" },
          headerBackTitle: "뒤로",
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Nutrition" component={NutritionScreen} options={{ title: "주차별 영양제 가이드" }} />
        <Stack.Screen name="WeightTracker" component={WeightTrackerScreen} options={{ title: "주차별 몸무게 확인" }} />
        <Stack.Screen name="HappyCard" component={HappyCardScreen} options={{ title: "국민행복카드" }} />
        <Stack.Screen name="WorkRights" component={WorkRightsScreen} options={{ title: "단축근무 안내" }} />
        <Stack.Screen name="MaternityLeave" component={MaternityLeaveScreen} options={{ title: "출산휴가 안내" }} />
        <Stack.Screen name="ParentalLeave" component={ParentalLeaveScreen} options={{ title: "육아휴직 안내" }} />
        <Stack.Screen name="ChildSubsidy" component={ChildSubsidyScreen} options={{ title: "자녀장려금 안내" }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: "개인정보처리방침" }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: "문의하기" }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: "이용약관" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
