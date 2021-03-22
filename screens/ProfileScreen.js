import React from "react";
// Routes
import Profile from "../components/Profile";
import Vehicles from "../components/Vehicles";
import House from "../components/Houses";
// Components
import TabBarIcon from "../components/TabBarIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Profile";

const ProfileScreen = () => {
  const routes = [
    { name: "Profile", title: "Profil", component: Profile, icon: "account-circle-outline" },
    { name: "Vehicles", title: "Fahrzeuge", component: Vehicles, icon: "garage-open" },
    {
      name: "Houses",
      title: "Häuser",
      component: House,
      icon: "home-city-outline",
    },
  ];

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
      {routes.map((route) => {
        return (
          <BottomTab.Screen
            key={route.name}
            name={route.name}
            component={route.component}
            options={{
              title: route.title,
              tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={route.icon} />,
            }}
          />
        );
      })}
    </BottomTab.Navigator>
  );
};

export default ProfileScreen;
