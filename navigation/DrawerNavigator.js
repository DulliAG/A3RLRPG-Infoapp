import * as React from "react";
import Colors from "../constants/Colors";
import { expo } from "../app.json";
// Routes
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import VehicleScreen from "../screens/VehicleScreen";
import HouseScreen from "../screens/HouseScreen";
import StoreScreen from "../screens/StoresScreen";
import ContactScreen from "../screens/ContactScreen";
import MarketScreen from "../screens/MarketScreen";
import CBSScreen from "../screens/CommunityBuildingScreen";
import ChangelogScreen from "../screens/ChangelogScreen";
import SettingsScreen from "../screens/SettingsScreen";
// Components
import { View, Text, Image, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const INITIAL_ROUTE_NAME = "Home";
const Routes = [
  {
    name: "Home",
    title: "Serverliste",
    component: HomeScreen,
    icon: "server",
  },
  {
    name: "Profile",
    title: "Profil",
    component: ProfileScreen,
    icon: "account-circle-outline",
  },
  {
    name: "Vehicle",
    title: "Fahrzeuge",
    component: VehicleScreen,
    icon: "car-pickup",
  },
  {
    name: "House",
    title: "Häuser",
    component: HouseScreen,
    icon: "home-city-outline",
  },
  {
    name: "Stores",
    title: "Händler",
    component: StoreScreen,
    icon: "cart-outline",
  },
  {
    name: "Contact",
    title: "Kontakte",
    component: ContactScreen,
    icon: "contacts",
  },
  {
    name: "Market",
    title: "Markt",
    component: MarketScreen,
    icon: "trending-up",
  },
  {
    name: "CBS",
    title: "CBS",
    component: CBSScreen,
    icon: "hammer",
  },
  {
    name: "Changelogs",
    title: "Changelogs",
    component: ChangelogScreen,
    icon: "format-list-bulleted",
  },
  {
    name: "Settings",
    title: "Einstellungen",
    component: SettingsScreen,
    icon: "settings-outline",
  },
];

const CustomDrawerComponents = (props) => {
  const { avatar, username, playerId } = props;
  return (
    <>
      <DrawerContentScrollView {...props} style={{ paddingTop: 20 }}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Image
                source={{
                  uri: avatar,
                }}
                style={{ width: 60, height: 60, borderRadius: 8 }}
              />
              <View
                style={{
                  marginLeft: 8,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.playerId}>{playerId}</Text>
              </View>
            </View>
          </View>

          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
        <Text style={{ color: Colors.tabIconDefault }}>Version: {expo.version}</Text>
      </View>
    </>
  );
};

export default function DrawerNavigator(props) {
  const { avatar, username, playerId } = props;
  return (
    <Drawer.Navigator
      initialRouteName={INITIAL_ROUTE_NAME}
      drawerContent={(props) => (
        <CustomDrawerComponents
          avatar={avatar}
          username={username}
          playerId={playerId}
          {...props}
        />
      )}
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
                <MaterialCommunityIcons
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

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    marginTop: 3,
    marginBottom: 4,
    fontWeight: "bold",
  },
  playerId: {
    fontSize: 15,
    lineHeight: 14,
    color: "#ccc",
  },
  bottomDrawerSection: {
    alignItems: "center",
    paddingTop: 8,
    marginBottom: 8,
    borderTopColor: "#ededed",
    borderTopWidth: 1,
  },
});
