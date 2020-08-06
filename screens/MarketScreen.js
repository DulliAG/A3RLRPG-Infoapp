import React from "react";
import { View, StyleSheet } from "react-native";
import MarketItem from "../components/MarketItem";

const YourApp = () => {
  return (
    <View style={styles.container}>
      <MarketItem />
    </View>
  );
};

export default YourApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
