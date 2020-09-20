import React from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import Styled from "styled-components";
import Spinner from "../components/Spinner";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

export default class CBS extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      isModalvisible: false,
      content: null,
      cb: null,
    };
  }

  getCBS() {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/cbs/")
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((err) => rej(err));
    });
  }

  setItems = (object) => {
    let updateState = new Promise((res) => {
      this.setState({ cb: object });
      res(object);
    });

    Promise.all([updateState]).then(() => {
      this.showModal();
    });
  };

  // FIXME Get & display required project-items dynamicly
  setModalContent = () => {
    const project = this.state.cb;
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
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 16,
                  paddingRight: 5,
                }}
              >
                {project.title}
              </Text>
              {project.finished == 1 ? (
                <Ionicons name="ios-checkmark-circle-outline" size={24} color="black" />
              ) : (
                <Ionicons name="ios-construct" size={24} color="black" />
              )}
            </View>
            <Image
              source={{
                uri: project.image,
              }}
              style={{
                width: "90%",
                height: 100,
                marginLeft: "5%",
                borderWidth: 1,
                borderColor: "#ededed",
                borderRadius: 8,
              }}
            />
            <Text style={{ ...styles.item, marginBottom: 10 }}>{project.desc}</Text>
            <ProgressContainer>
              <ProgressBar
                style={{
                  width: `${(project.amount * 100) / project.funding_required}%`,
                  backgroundColor: Colors.tabIconSelected,
                }}
              />
            </ProgressContainer>
            <Text style={{ marginTop: 10, textAlign: "center", fontWeight: "bold" }}>
              {project.amount} € / {project.funding_required} €
            </Text>
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
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_u.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.rock_u} / {project.required.rock_u}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_wood_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.wood_r} / {project.required.wood_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_u.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.sand_u} / {project.required.sand_u}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.rock_r} / {project.required.rock_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_clay_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.clay_r} / {project.required.clay_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_copper_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.copper_r} / {project.required.copper_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_iron_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.iron_r} / {project.required.iron_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_r.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.sand_r} / {project.required.sand_r}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_plastic.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.plastic} / {project.required.plastic}
              </Text>
              <Text style={styles.projectItem}>
                <Image
                  source={{
                    uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_steel.png`,
                  }}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
                {project.delivered.steel} / {project.required.steel}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  componentDidMount() {
    this.getCBS().then((value) => {
      this.setState({ content: value.data, loading: false });
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
              <Text
                style={{
                  ...styles.item,
                  borderColor: item.finished == 1 ? "#ededed" : Colors.tabIconSelected,
                  backgroundColor: item.finished == 1 ? "#f8f9fa" : Colors.tabIconSelected,
                  color: item.finished == 1 ? "#000" : "#fff",
                }}
                onPress={this.setItems.bind(this, item)}
              >
                {item.title}
              </Text>
            )}
          />

          {this.state.cb != null ? this.setModalContent() : null}
        </View>
      );
    }
  }
}

const ProgressContainer = Styled.View`
  width: 90%;
  height: 25px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: #ededed;
`;

const ProgressBar = Styled.View`
  height: 100%;
  border-radius: 5px;
`;

const styles = StyleSheet.create({
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
