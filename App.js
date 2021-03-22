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
  constructor() {
    super();
    this.state = {
      avatar: "https://files.dulliag.de/web/images/logo.jpg",
      username: "Benutzername",
      playerId: "PlayerID",
    };
  }

  openSettings = () => this.settingsRef.open();

  async componentDidMount() {
    const apiKey = await RLRPG_API.getApiKey();
    if (apiKey !== null || apiKey !== "") {
      try {
        var profile = await RLRPG_API.getProfile(apiKey);
        profile = profile.data[0];
        this.setState({
          avatar: profile.avatar_full,
          username: profile.name,
          playerId: profile.pid,
        });
      } catch (err) {
        // This means the saved api-key is invalid
        // TODO Show an alert which informs the user about the validation about his saved key
        console.error(err);
      }
    } else {
      this.openSettings();
    }
  }

  render() {
    const { avatar, username, playerId } = this.state;
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
        <NavigationContainer>
          <DrawerNavigator avatar={avatar} username={username} playerId={playerId} />
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
