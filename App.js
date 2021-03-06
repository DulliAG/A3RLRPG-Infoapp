import React, { Component } from "react";
import { ReallifeAPI } from "./ApiHandler";
// Components
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { Platform, StyleSheet, View } from "react-native";
import Settings from "./components/Settings";

const RLRPG_API = new ReallifeAPI();

export default class App extends Component {
  openSettings = () => this.settingsRef.open();

  async componentDidMount() {
    const ApiKey = await RLRPG_API.getApiKey();
    if (ApiKey == null || ApiKey == "") this.openSettings();
  }

  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
        <NavigationContainer>
          <DrawerNavigator />
        </NavigationContainer>
        <Settings ref={(modal) => (this.settingsRef = modal)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
