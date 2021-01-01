import React, { Component, createRef } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput, Text } from "react-native";
import { ReallifeAPI } from "../ApiHandler";
// Components
import { Modalize } from "react-native-modalize";

const reallifeRPG = new ReallifeAPI();

export default class Settings extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: null,
    };
    this.modalizeRef = createRef(null);
  }

  open = () => this.modalizeRef.current?.open();

  close = () => this.modalizeRef.current?.close();

  saveNewKey = async () => {
    const newKey = this.state.apiKey;
    reallifeRPG.saveApiKey(newKey);
    this.close();
  };

  async componentDidMount() {
    this.setState({ apiKey: await reallifeRPG.getApiKey() });
  }

  render() {
    return (
      <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
        <View style={modal.content}>
          <Text style={modal.heading}>{"Einstellungen".toUpperCase()}</Text>
          <Text style={modal.label}>API-Key</Text>
          <TextInput
            style={modal.input}
            onChangeText={(value) => this.setState({ apiKey: value })}
            placeholder={"API-Key eingeben"}
            value={this.state.apiKey}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
            }}
          >
            <TouchableOpacity onPress={this.close}>
              <Text style={modal.button}>Abbrechen</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={this.saveNewKey}>
              <Text style={{ ...modal.button, ...modal.save }}>Speichern</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modalize>
    );
  }
}

const modal = StyleSheet.create({
  content: {
    padding: 20,
  },
  heading: {
    marginBottom: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "#ccc",
  },
  label: {
    paddingTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  input: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
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
