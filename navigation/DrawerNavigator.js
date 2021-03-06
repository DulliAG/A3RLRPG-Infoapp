import * as React from "react";
import Colors from "../constants/Colors";
// Routes
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoresScreen";
import MarketScreen from "../screens/MarketScreen";
import CBSScreen from "../screens/CommunityBuildingScreen";
import ChangelogScreen from "../screens/ChangelogScreen";
import SettingsScreen from "../screens/SettingsScreen";
// Components
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = "Home";
const Routes = [
  {
    name: "Home",
    title: "Serverliste",
    component: HomeScreen,
    icon: "ios-home",
  },
  {
    name: "Profile",
    title: "Profil",
    component: ProfileScreen,
    icon: "ios-contact",
  },
  {
    name: "Stores",
    title: "Händler",
    component: StoreScreen,
    icon: "md-cart",
  },
  {
    name: "Market",
    title: "Markt",
    component: MarketScreen,
    icon: "ios-trending-up",
  },
  {
    name: "CBS",
    title: "CBS",
    component: CBSScreen,
    icon: "ios-construct",
  },
  {
    name: "Changelogs",
    title: "Changelogs",
    component: ChangelogScreen,
    icon: "ios-journal",
  },
  {
    name: "Settings",
    title: "Einstellungen",
    component: SettingsScreen,
    icon: "ios-settings",
  },
];

const CustomDrawerComponents = (props) => {
  return (
    <DrawerContentScrollView {...props} style={{ paddingTop: 20 }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default function DrawerNavigator(props) {
  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      drawerContent={(props) => <CustomDrawerComponents {...props} />}
      drawerStyle={{ width: "75%" }}
    >
      {Routes.map((route, index) => {
        return (
          <Drawer.Screen
            key={index}
            name={route.name}
            options={{
              drawerLabel: route.title,
              drawerIcon: ({ focused }) => (
                <Ionicons
                  name={route.icon}
                  size={24}
                  color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
                />
              ),
              title: route.title,
              headerShown: true,
              title: route.title,
              headerStyle: {
                backgroundColor: "#fff",
                elevation: 0, // for android
                shadowOpacity: 0, // for iOS
                borderBottomWidth: 1,
                borderBottomColor: "#ededed",
              },
              headerTintColor: "black",
              headerTitleStyle: {
                fontWeight: "bold",
                flexGrow: 1,
                alignSelf: "center",
                marginLeft: -55,
                // marginRight: -55, // required to be in center bcause of the headerRight-element
              },
            }}
            component={route.component}
          />
        );
      })}
    </Drawer.Navigator>
  );
}
