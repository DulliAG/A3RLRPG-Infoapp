import React from "react";
// Components
import { View, StyleSheet } from "react-native";
import MarketItem from "../components/MarketItem";

const MarketScreen = () => {
  return (
    <View style={styles.container}>
      <MarketItem />
    </View>
  );
};

export default MarketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
