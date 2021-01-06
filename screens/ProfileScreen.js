import React from "react";
import Colors from "../constants/Colors";
// Routes
import Profile from "../components/Profile";
import Vehicles from "../components/Vehicles";
import House from "../components/Houses";
import CBS from "../components/CBS";
// Components
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const ProfileScreen = () => {
  const [index, setIndex] = React.useState(2);
  const [routes] = React.useState([
    { key: "profile", title: "Profil" },
    { key: "vehicles", title: "Fahrzeuge" },
    { key: "houses", title: "Gebäude" },
    { key: "cbs", title: "CBS" },
  ]);

  const ProfileRoute = () => {
    return <Profile />;
  };

  const VehicleRoute = () => {
    return <Vehicles />;
  };

  const HouseRoute = () => {
    return <House />;
  };

  const CBSRoute = () => {
    return <CBS />;
  };

  const renderScene = SceneMap({
    profile: ProfileRoute,
    vehicles: VehicleRoute,
    houses: HouseRoute,
    cbs: CBSRoute,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: "#fff" }}
            indicatorStyle={{
              backgroundColor: Colors.tabIconSelected,
              height: 5,
            }}
            renderLabel={({ route, focused, color }) => (
              <Text style={[focused ? styles.activeTabTextColor : styles.inactiveTabTextColor]}>
                {route.title}
              </Text>
            )}
          />
        )}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={Dimensions.get("window").width}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  Tab: {
    display: "flex",
    width: "90%",
    height: "100%",
  },
  activeTabTextColor: {
    fontWeight: "600",
    color: Colors.tabIconSelected,
  },
  inactiveTabTextColor: {
    color: "#000",
  },
});
