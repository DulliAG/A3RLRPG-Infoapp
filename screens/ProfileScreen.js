import React from "react";
// Routes
import BankAccountScreen from "./BankAccountScreen";
import CompanyScreen from "./CompanyScreen";
// Components
import Profile from "../components/Profile";
import TabBarIcon from "../components/TabBarIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Colors from "../constants/Colors";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Profile";

const ProfileScreen = () => {
  const routes = [
    { name: "Profile", title: "Profil", component: Profile, icon: "account-circle-outline" },
    {
      name: "BankAccounts",
      title: "Konten",
      component: BankAccountScreen,
      icon: "credit-card-outline",
    },
    { name: "Company", title: "Unternehmen", component: CompanyScreen, icon: "store" },
  ];

  return (
    <BottomTab.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        style: {
          elevation: 0, // for android
          shadowOpacity: 0, // for iOS
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
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
