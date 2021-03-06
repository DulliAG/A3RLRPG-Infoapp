import React, { Component } from "react";
import { ReallifeAPI } from "./ApiHandler";
import { NotifyHandler } from "./NotifyHandler";
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
    // Check is the ReallifeRPG API-Key was set
    const apiKey = await reallifeRPG.getApiKey();

    // TODO Check if this works
    if (apiKey !== null) {
      // Check if the expire date matches the notification date
      // const scheduledNotifications = await notifyHandler.getAllScheduledNotifications();
      // scheduledNotifications.forEach((notification) => {
      //   const creatorApiKey = notification.content.data.creatorKey; // Should return the Reallife API-Key
      //   const notificationIdentifier = notification.identifier;
      //   if (creatorApiKey === apiKey) {
      //     // TODO Check if the scheduled time still matches the house expiration
      //   } else {
      //     notifyHandler.cancelScheduledNotification(notificationIdentifier);
      //   }
      // });
    } else {
      this.openSettings();
      // notifyHandler.cancelAllScheduledNotifications();
    }
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
