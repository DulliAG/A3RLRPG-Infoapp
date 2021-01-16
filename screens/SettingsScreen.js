import React, { useEffect, useState } from "react";
// Components
import { View, StyleSheet, TouchableOpacity, Text, TextInput } from "react-native";
import { ReallifeAPI } from "../ApiHandler";

const reallifeRPG = new ReallifeAPI();

const SettingsScreen = () => {
  const [apiKey, setApiKey] = useState();

  const saveNewKey = async () => {
    const newKey = apiKey;
    reallifeRPG.saveApiKey(newKey);
    // this.close();
    // We're gonna delete all scheduled push notifications because we're now selecting data from a new player
    // notifyHandler.cancelAllScheduledNotification();
  };

  useEffect(async () => {
    // setState({ apiKey: await reallifeRPG.getApiKey() });
    setApiKey(await reallifeRPG.getApiKey());
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.formControl}>
        <Text style={styles.label}>API-Key</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) => setApiKey(value)}
          placeholder={"API-Key eingeben"}
          value={apiKey}
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <TouchableOpacity activeOpacity={0.9} onPress={saveNewKey}>
            <Text style={{ ...styles.button, ...styles.save }}>Speichern</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formControl: {
    width: "90%",
    marginLeft: "5%",
    marginTop: 16,
  },
  label: {
    paddingTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 22,
    color: "#333",
  },
  input: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ededed",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  save: {
    backgroundColor: "#2196F3",
    color: "white",
  },
});
