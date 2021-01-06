import React from "react";
import { View, Text } from "react-native";

export default class NoKey extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textAlign: "center", paddingHorizontal: 50 }}>
          Lege zuerst deinen API-Key in den Einstellungen fest!
        </Text>
      </View>
    );
  }
}
