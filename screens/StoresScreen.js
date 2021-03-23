import React from "react";
// Components
import Store from "../components/StoreItem";
import TabBarIcon from "../components/TabBarIcon";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Vehicles";

const StoreScreen = () => {
  const VehicleStore = () => {
    return <Store category="vehicles" />;
  };
  const ItemStore = () => {
    return <Store category="items" />;
  };
  const routes = [
    {
      name: "Vehicles",
      title: "Fahrzeuge",
      component: VehicleStore,
      icon: "car-sports",
    },
    {
      name: "Items",
      title: "Gegenstände",
      component: ItemStore,
      icon: "cart-outline",
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

export default StoreScreen;
