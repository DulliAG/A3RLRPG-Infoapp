import React from "react";
import { View, StyleSheet } from "react-native";
import { ServerList } from "../components/Server";

const YourApp = () => {
  return (
    <View style={styles.container}>
      <ServerList />
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
