import React from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Text,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "../components/Spinner";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";

export default class Houses extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      content: null,
      modalVisible: false,
      modalContent: null,
    };
  }

  getKey() {
    return new Promise((res, rej) => {
      try {
        res(AsyncStorage.getItem("@apiKey"));
      } catch (err) {
        rej(err);
      }
    });
  }

  getHouses(apiKey) {
    return new Promise((res, rej) => {
      fetch(`https://api.realliferpg.de/v1/player/${apiKey}/`)
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((err) => rej(err));
    });
  }

  setModalContent = (object) => {
    let updateState = new Promise((res) => {
      this.setState({ modalContent: object });
      res(object);
    });

    Promise.all([updateState]).then(() => {
      this.showModal();
    });
  };

  setModal = () => {
    let house = this.state.modalContent;
    var loc = house.location.substring(1, house.location.length - 1).split(",");
    return (
      <Modal
        isVisible={this.state.modalVisible}
        style={styles.bottomModal}
        backdropColor="rgba(0, 0, 0, 0)"
        backdropOpacity={1}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={200}
        animationOutTiming={200}
        onBackdropPress={() => this.closeModal()}
        onSwipeComplete={() => this.closeModal()}
        swipeDirection={"down"}
      >
        <View style={styles.modalContent}>
          <TouchableWithoutFeedback
            onPress={() => this.closeModal()}
            onPressIn={() => this.closeModal()}
          >
            <View
              style={{
                width: "10%",
                height: 5,
                marginBottom: 10,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                borderRadius: 50,
              }}
            />
          </TouchableWithoutFeedback>

          <ScrollView
            style={{
              width: "100%",
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 16,
                  paddingRight: 5,
                }}
              >
                {house.id}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "90%",
                marginTop: 5,
                marginLeft: "5%",
              }}
            >
              <Text style={{ ...styles.smallItem, width: "74%" }}>
                Gewartet für {house.payed_for / 24} Tage
              </Text>
              <Text
                style={{ ...styles.smallItem, width: "24%" }}
                onPress={() =>
                  Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                }
              >
                <Ionicons name="ios-map" size={19} color="black" />
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  componentDidMount() {
    this.getKey().then((key) => {
      this.getHouses(key).then((data) => {
        this.setState({ content: data.data[0].houses, loading: false });
      });
    });
  }

  render() {
    if (this.state.loading == true) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <FlatList
            data={this.state.content}
            renderItem={({ item }) => (
              <Text style={styles.item} onPress={this.setModalContent.bind(this, item)}>
                {item.id}
              </Text>
            )}
          />

          {this.state.modalContent != null ? this.setModal() : null}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  item: {
    display: "flex",
    alignItems: "center",
    width: "90%",
    textAlign: "center",
    marginLeft: "5%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
    borderColor: "#ededed",
    borderRadius: 8,
  },
  smallItem: {
    textAlign: "center",
    width: "49%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  projectItem: {
    textAlign: "center",
    width: "49%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  modalContent: {
    backgroundColor: "white",
    paddingTop: 15,
    paddingBottom: 0,
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
});
