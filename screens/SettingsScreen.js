import React, { Component } from "react";
import { Updates } from "expo";
import { expo } from "../app.json";
// Components
import { View, StyleSheet, TouchableOpacity, Linking, TextInput } from "react-native";
import Text from "../components/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import { ReallifeAPI } from "../ApiHandler";

const reallifeRPG = new ReallifeAPI();

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      apiKey: null,
    };
    this.website = "https://dulliag.de";
    this.issues = "https://github.com/tklein1801/A3RLRPG-Infoapp/";
  }

  saveNewKey = async () => {
    const { apiKey, savedKey } = this.state;
    console.log(savedKey);
    if (apiKey !== savedKey) {
      reallifeRPG.saveApiKey(apiKey);
      Updates.reload();
    } else {
      console.log("need to change ur key");
    }
    // TODO Display an toast to show the user that the key was saved successfully
  };

  async componentDidMount() {
    var key = await reallifeRPG.getApiKey();
    this.setState({ apiKey: key, savedKey: key });
  }

  render() {
    const { apiKey } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
          <View style={styles.section}>
            <Text type="SemiBold" style={styles.heading}>
              Informationen
            </Text>
            <Text type="SemiBold" style={styles.label}>
              Name: <Text style={styles.text}>{expo.name}</Text>
            </Text>
            <Text type="SemiBold" style={styles.label}>
              Webseite:{" "}
              <Text style={styles.text} onPress={() => Linking.openURL(this.website)}>
                {this.website}
              </Text>
            </Text>
            <Text type="SemiBold" style={styles.label}>
              Quellcode:{" "}
              <Text style={styles.text} onPress={() => Linking.openURL(this.issues)}>
                GitHub
              </Text>
            </Text>
            <Text type="SemiBold" style={styles.label}>
              Version: <Text style={styles.text}>{expo.version}</Text>
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.formControl}>
              <Text type="SemiBold" style={styles.heading}>
                API-Key
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={(value) => this.setState({ apiKey: value })}
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
                <TouchableOpacity activeOpacity={0.9} onPress={this.saveNewKey}>
                  <Text style={{ ...styles.button, ...styles.save }}>Speichern</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  section: {
    width: "95%",
    marginTop: 10,
    marginLeft: "2.5%",
  },
  formControl: {
    width: "100%",
    marginTop: 16,
  },
  heading: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
  label: {},
  text: {
    fontWeight: "normal",
  },
  input: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ededed",
    fontFamily: "OpenSans-Regular",
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
