require("react-native").unstable_enableLogBox();
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ToastAndroid,
  Modal,
  TouchableHighlight,
  TextInput,
  Text,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCachedResources from "./hooks/useCachedResources";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import AsyncStorage from "@react-native-community/async-storage";
import styled from "styled-components";
import Colors from "./constants/Colors";

const Stack = createStackNavigator();

export default function App() {
  const isLoadingComplete = useCachedResources();
  const [showSettings, setShowSettings] = React.useState(false);
  const [key, setKey] = React.useState("Placeholder");
  const [isDark, setDark] = React.useState(false);

  const saveKey = async (value) => {
    try {
      await AsyncStorage.setItem("@apiKey", value);
    } catch (err) {
      console.error(err);
    }
  };

  const getKey = async () => {
    try {
      setKey(await AsyncStorage.getItem("@apiKey"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getKey();
  }, []);

  // TODO Create an external component for the settings
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
                  elevation: 0, // for android
                  shadowOpacity: 0, // for iOS
                  borderBottomWidth: 1,
                  borderBottomColor: "#ededed",
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
                      setShowSettings(!showSettings);
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
        <Modal animationType="slide" transparent={true} visible={showSettings}>
          <View style={styles.modalView}>
            <Strong>API-Key</Strong>
            <TextInput
              style={styles.input}
              value={key}
              onChangeText={(text) => {
                setKey(text);
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Switch
                trackColor={{ false: "#767577", true: "#bdbdbd" }}
                thumbColor={isDark ? Colors.tabIconSelected : "#f4f3f4"}
                onValueChange={() => {
                  setDark(!isDark);
                }}
                value={isDark}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Dark-Mode</Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#bdbdbd" }}
                onPress={() => {
                  setShowSettings(!showSettings);
                }}
              >
                <Text style={styles.modalButtonText}>Abbrechen</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={{ ...styles.modalButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setShowSettings(!showSettings);
                  saveKey(key);
                  ToastAndroid.showWithGravityAndOffset(
                    "API-Key gespeichert",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    150
                  );
                }}
              >
                <Text style={styles.modalButtonText}>Speichern</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const Strong = styled.Text`
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 18px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#2f95dc",
    borderWidth: 2,
  },
  modalView: {
    backgroundColor: "#fff",
    padding: 35,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalButton: {
    elevation: 2,
    padding: 10,
    width: "48%",
    borderRadius: 5,
  },
  modalButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
});
