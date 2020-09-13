import React from "react";
import { View, StyleSheet, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import Spinner from "./Spinner";
import { FlatList } from "react-native-gesture-handler";
import Layout from "../constants/Layout";
import Modal from "react-native-modal";

// TODO How can we increase the performance?
// FIXME Make the modal down-swipeable
export default class Store extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      isModalVisible: false,
      category: props.category,
      content: [],
      shopItems: null,
    };
  }

  getShops(category) {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/info/" + category + "_shoptypes")
        .then((response) => response.json())
        .then((response) => res(response.data))
        .catch((error) => rej(error));
    });
  }

  getShopItems(category, shopname) {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/info/" + category + "/" + shopname)
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((error) => rej(error));
    });
  }

  setItems = (items) => {
    let updateState = new Promise((res) => {
      this.setState({ shopItems: items.items });
      res(items.items);
    });

    Promise.all([updateState]).then(() => {
      this.showModal();
    });
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.getShops(this.state.category)
      .then((shops) => {
        this.setState({ content: shops });
      })
      .then(() => {
        var temp = [];
        for (const key in this.state.content) {
          const shop = this.state.content[key];
          this.getShopItems(this.state.category, shop.shoptype)
            .then((items) => {
              temp.push({
                shopname: shop.shopname,
                shoptype: shop.shoptype,
                items: items.data,
              });
            })
            .then(() => {
              this.setState({ content: temp, loading: false });
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }

  render() {
    while (this.state.loading == true) {
      return <Spinner size="large" />;
    }

    return (
      <View style={{ backgroundColor: "#fff" }}>
        <FlatList
          data={this.state.content}
          renderItem={({ item }) => (
            <Text style={styles.item} onPress={this.setItems.bind(this, item)}>
              {item.shopname}
            </Text>
          )}
        />
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
                maxHeight: Layout.window.height * 0.6,
                width: "90%",
              }}
              showsVerticalScrollIndicator={false}
            >
              {this.state.shopItems != null
                ? this.state.shopItems.map((item, index) => {
                    return (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          marginBottom: 5,
                          borderWidth: 1,
                          borderColor: "#ededed",
                          backgroundColor: "#f8f9fa",
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ width: "70%", fontWeight: "bold" }}>{item.name}</Text>
                        <Text style={{ width: "30%", textAlign: "right" }}>{item.price} €</Text>
                        <Text>Level: {item.level}</Text>
                        {this.state.category == "vehicles" ? (
                          <Text style={{ marginLeft: 10 }}>Kofferraum: {item.v_space} Kg.</Text>
                        ) : null}
                      </View>
                    );
                  })
                : null}
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width: "90%",
    textAlign: "center",
    marginLeft: "5%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
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
