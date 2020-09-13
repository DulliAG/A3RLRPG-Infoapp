import React from "react";
import {
  Dimensions,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  View,
  Text,
  ToastAndroid,
} from "react-native";
import styled from "styled-components";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";

export class SettingsModal extends React.Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: false,
      apiKey: null,
    };
  }

  saveKey = async (value) => {
    try {
      await AsyncStorage.setItem("@apiKey", value);
    } catch (err) {
      console.error(err);
    }
  };

  getKey = async () => {
    try {
      this.setState({ apiKey: await AsyncStorage.getItem("@apiKey") });
    } catch (err) {
      console.error(err);
    }
  };

  show = () => {
    this.setState({ isModalVisible: true });
  };

  close = () => {
    this.setState({ isModalVisible: false });
  };

  componentDidMount() {
    this.getKey();
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        style={styles.bottomModal}
        backdropColor="rgba(0, 0, 0, 0)"
        backdropOpacity={1}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        onBackdropPress={() => this.close()}
        onSwipeComplete={() => this.close()}
        swipeDirection="down"
      >
        <View style={styles.modalContent}>
          <View
            style={{
              width: "10%",
              height: 5,
              marginBottom: 10,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 50,
            }}
          />
          <Strong>API-Key</Strong>
          <TextInput
            style={styles.input}
            value={this.state.apiKey}
            onChangeText={(text) => {
              this.setState({ apiKey: text });
            }}
          />

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <TouchableHighlight
              style={{ ...styles.modalButton, backgroundColor: "#bdbdbd" }}
              onPress={() => {
                this.close();
              }}
            >
              <Text style={styles.modalButtonText}>Abbrechen</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.modalButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.close();
                this.saveKey(this.state.apiKey);
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
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: "#2f95dc",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContent: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
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
