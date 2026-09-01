import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/HomeScreen";
import MoreScreen from "../screens/MoreScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";

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
import CalculatorScreen from "../screens/CalculatorScreen";
import BirthPrepScreen from "../screens/BirthPrepScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import ScheduleDetailScreen from "../screens/ScheduleDetailScreen";
import { useAuth } from "../context/AuthContext";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  SignUp: undefined;
  Calculator: undefined;
  BirthPrep: undefined;
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
  ScheduleDetail: {
    id: string; title?: string; emoji?: string; color: string;
    memo?: string; location?: string; date: string; isAuto: boolean;
  };
};

export type TabParamList = {
  홈: undefined;
  달력: undefined;
  일정: undefined;
  프로필: undefined;
  메뉴: undefined;
};

const ICONS = {
  홈: require("../../assets/icons/tab_home.png"),
  달력: require("../../assets/icons/tab_calendar.png"),
  일정: require("../../assets/icons/tab_schedule.png"),
  프로필: require("../../assets/icons/tab_profile.png"),
  메뉴: require("../../assets/icons/tab_menu.png"),
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MenuPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: "#f9fafb" }} />;
}

function TabIcon({ name, focused }: { name: keyof typeof ICONS; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      <Image
        source={ICONS[name]}
        style={{ width: 70, height: 70, tintColor: focused ? "#ec4899" : "#9ca3af" }}
        resizeMode="contain"
      />
    </View>
  );
}

function TabNavigator({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();

  const ThinHeader = () => (
    <View style={{ height: insets.top + 8, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#fce7f3" }} />
  );

  const authGuard = () => ({
    tabPress: (e: any) => {
      if (!isLoggedIn) {
        e.preventDefault();
        navigation.navigate("Login");
      }
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <ThinHeader />,
        tabBarStyle: {
          height: 72,
          borderTopWidth: 0,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 20,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="홈" focused={focused} /> }}
      />
      <Tab.Screen
        name="달력"
        component={ScheduleScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="달력" focused={focused} /> }}
        listeners={authGuard}
      />
      <Tab.Screen
        name="일정"
        component={BirthPrepScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="일정" focused={focused} /> }}
        listeners={authGuard}
      />
      <Tab.Screen
        name="프로필"
        component={MenuPlaceholder}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="프로필" focused={focused} /> }}
        listeners={authGuard}
      />
      <Tab.Screen
        name="메뉴"
        component={MoreScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="메뉴" focused={focused} /> }}
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
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "로그인", presentation: "modal" }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: "회원가입" }} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: "임신 주수 계산기" }} />
        <Stack.Screen name="BirthPrep" component={BirthPrepScreen} options={{ title: "출산 준비 체크리스트" }} />
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
        <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} options={{ title: "일정 상세" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
