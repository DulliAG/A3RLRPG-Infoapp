import React, { useState } from "react";
import Colors from "../constants/Colors";
// Components
import { StyleSheet, Dimensions, Text } from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import Store from "../components/StoreItem";

const StoreScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "vehicles", title: "Fahrzeuge" },
    { key: "items", title: "Gegenstände" },
  ]);

  const VehicleStores = () => {
    return <Store category="vehicles" />;
  };

  const ItemStores = () => {
    return <Store category="items" />;
  };

  const renderScene = SceneMap({
    vehicles: VehicleStores,
    items: ItemStores,
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

export default StoreScreen;

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
