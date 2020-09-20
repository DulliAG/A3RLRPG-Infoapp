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
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        style: {
          elevation: 0, // for android
          shadowOpacity: 0, // for iOS
          borderBottomWidth: 1,
          borderBottomColor: "#ededed",
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-home" />,
          // tabBarBadge: 3,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-contact" />,
        }}
      />
      <BottomTab.Screen
        name="Stores"
        component={StoresScreen}
        options={{
          title: "Händler",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-cart" />,
        }}
      />
      <BottomTab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          title: "Markt",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-trending-up" />,
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
