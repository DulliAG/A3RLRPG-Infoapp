import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Colors from "../constants/Colors";
import Profile from "../components/Profile";
import Styled from "styled-components";

const YourApp = () => {
  const [index, setIndex] = React.useState(0);
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
    return (
      <View style={{ ...styles.Tab, justifyContent: "center", alignItems: "center" }}>
        <Text>Fahrzeuge</Text>
      </View>
    );
  };

  const HouseRoute = () => {
    return (
      <View style={{ ...styles.Tab, justifyContent: "center", alignItems: "center" }}>
        <Text>Gebäude</Text>
      </View>
    );
  };

  const CBSRoute = () => {
    return (
      <View style={{ ...styles.Tab, justifyContent: "center", alignItems: "center" }}>
        <Text>Community Buildings</Text>
      </View>
    );
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
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
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

export default YourApp;

const Strong = Styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const Link = Styled.Text`
  text-decoration: underline black;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  Tab: {
    display: "flex",
    width: "90%",
    height: "100%",
    backgroundColor: "red",
  },
  activeTabTextColor: {
    fontWeight: "600",
    color: Colors.tabIconSelected,
  },
  inactiveTabTextColor: {
    color: "#000",
  },
  StatsContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
    backgroundColor: "#fff",
    borderTopWidth: 5,
    borderTopColor: Colors.tabIconSelected,
    borderRadius: 5,
  },
});
