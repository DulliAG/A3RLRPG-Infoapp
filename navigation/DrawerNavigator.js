import * as React from "react";
import Colors from "../constants/Colors";
import { createStackNavigator } from "@react-navigation/stack";
// Routes
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StoreScreen from "../screens/StoresScreen";
import MarketScreen from "../screens/MarketScreen";
import CBSScreen from "../screens/CommunityBuildingScreen";
import ContactScreen from "../screens/ContactScreen";
import ChangelogScreen from "../screens/ChangelogScreen";
import SettingsScreen from "../screens/SettingsScreen";
// Components
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = "Home";
const routes = [
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
    name: "Contacts",
    title: "Kontaktbuch",
    component: ContactScreen,
    icon: "ios-contacts",
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

export default function DrawerNavigator({ navigation, route }) {
  const Stack = createStackNavigator();

  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      drawerContent={(props) => <CustomDrawerComponents {...props} />}
      drawerStyle={{ width: "75%" }}
    >
      {routes.map((route, index) => {
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
            }}
            component={() => {
              return (
                <Stack.Navigator>
                  <Stack.Screen
                    name={route.name}
                    component={route.component}
                    options={({ navigation }) => ({
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
                      headerLeft: () => {
                        return (
                          <TouchableWithoutFeedback
                            onPress={() => {
                              navigation.toggleDrawer();
                            }}
                          >
                            <Ionicons
                              style={{ marginLeft: 28 }}
                              name="ios-menu"
                              size={28}
                              color="black"
                            />
                          </TouchableWithoutFeedback>
                        );
                      },
                      // headerRight: () => (
                      //   <TouchableWithoutFeedback
                      //     onPress={() => {
                      //       console.log("Open settings");
                      //     }}
                      //   >
                      //     <Ionicons
                      //       style={{ marginRight: 25 }}
                      //       name="ios-settings"
                      //       size={28}
                      //       color="black"
                      //     />
                      //   </TouchableWithoutFeedback>
                      // ),
                    })}
                  />
                </Stack.Navigator>
              );
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
}
