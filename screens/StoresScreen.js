import * as React from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { Store } from "../components/StoreItem";

const YourApp = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "vehicles", title: "Fahrzeuge" },
    { key: "items", title: "Gegenstände" },
  ]);

  // FIXME Improve Store performance
  const VehicleRoute = () => {
    return <Store category="vehicles" multpile={false} />;
  };

  const ItemRoute = () => {
    return <Store category="items" multpile={false} />;
  };

  const renderScene = SceneMap({
    vehicles: VehicleRoute,
    items: ItemRoute,
  });

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          /**
           * https://snack.expo.io/@tklein1801/react-native-tab-view-custom-tabbar
           * const color = Animated.color(
           *   Animated.round(
           *     Animated.interpolate(props.position, {
           *       inputRange,
           *       outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 255 : 0)),
           *     })
           *   ),
           *   0,
           *   0
           * );
           */
          return (
            <TouchableOpacity
              key={route.title}
              style={{ ...styles.tabItem }}
              onPress={() => setIndex(i)}
            >
              <Text style={{ color: "white" }}>{route.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // TODO Update style of renderTabBar
  return (
    <TabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={Dimensions.get("window").width}
    />
  );
};

export default YourApp;

const styles = StyleSheet.create({
  tabBar: {
    zIndex: 1,
    flexDirection: "row",
    backgroundColor: "#2f95dc",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  Tab: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
