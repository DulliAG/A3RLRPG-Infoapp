import React from "react";
// Components
import { View, StyleSheet } from "react-native";
import { ServerList } from "../components/Server";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ServerList />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});
