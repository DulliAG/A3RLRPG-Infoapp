import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as React from "react";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoresScreen from "../screens/StoresScreen";
import MarketScreen from "../screens/MarketScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
        }}
      />
      <BottomTab.Screen
        name="Stores"
        component={StoresScreen}
        options={{
          title: "Händler",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-wallet" />,
        }}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          title: "Markt",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-trending-up" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {
    case "Home":
      return "Serverliste";
    case "Profile":
      return "Spielerprofil";
    case "Stores":
      return "Händler";
    case "Market":
      return "Marktpreise";
  }
}
