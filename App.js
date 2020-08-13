require("react-native").unstable_enableLogBox();
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, TouchableWithoutFeedback, View, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useCachedResources from "./hooks/useCachedResources";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LinkingConfiguration from "./navigation/LinkingConfiguration";

const Stack = createStackNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator>
            <Stack.Screen
              name="Root"
              component={BottomTabNavigator}
              options={{
                headerStyle: {
                  backgroundColor: "#fff",
                },
                headerTintColor: "black",
                headerTitleStyle: {
                  fontWeight: "bold",
                  flexGrow: 1,
                  alignSelf: "center",
                  marginRight: -55 /* required to be in center bcause of the headerRight-element */,
                },
                headerRight: () => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      ToastAndroid.showWithGravityAndOffset(
                        "Einstellungen öffnen",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        150
                      );
                    }}
                  >
                    <Ionicons
                      style={{ marginRight: 25 }}
                      name="ios-settings"
                      size={28}
                      color="black"
                    />
                  </TouchableWithoutFeedback>
                ),
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
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
