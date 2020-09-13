import * as React from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Colors from "../constants/Colors";
import Store from "../components/StoreItem";

const YourApp = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "vehicles", title: "Fahrzeuge" },
    { key: "items", title: "Gegenstände" },
  ]);

  // FIXME Improve Store performance
  const VehicleRoute = () => {
    // return <Store category="vehicles" multpile={false} />;
    return <Store category="vehicles" />;
  };

  const ItemRoute = () => {
    // return <Store category="items" multpile={false} />;
    return <Store category="items" />;
  };

  const renderScene = SceneMap({
    vehicles: VehicleRoute,
    items: ItemRoute,
  });

  return (
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
  );
};

export default YourApp;

const styles = StyleSheet.create({
  Tab: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  activeTabTextColor: {
    fontWeight: "600",
    color: Colors.tabIconSelected,
  },
  inactiveTabTextColor: {
    color: "#000",
  },
});
