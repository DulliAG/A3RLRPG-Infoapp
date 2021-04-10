import React, { Component } from "react";
import { ReallifeAPI } from "./ApiHandler";
import useCachedResources from "./hooks/useCachedResources";
// Components
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./navigation/DrawerNavigator";
import { Platform, StyleSheet, View } from "react-native";
// import * as Notifications from "expo-notifications";
import Settings from "./components/Settings";

const RLRPG_API = new ReallifeAPI();

class App extends Component {
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
    if (apiKey !== null && apiKey !== "") {
      try {
        var profile = await RLRPG_API.getProfile(apiKey);
        profile = profile.data[0];
        this.setState({
          avatar: profile.avatar_full,
          username: profile.name,
          playerId: profile.pid,
        });
      } catch (err) {
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

export default function A() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return <App />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
