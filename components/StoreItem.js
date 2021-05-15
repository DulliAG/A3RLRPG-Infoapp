import React, { Component, createRef } from "react";
import Layout from "../constants/Layout";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
import styled from "styled-components";
// Components
import Spinner from "./Spinner";
import { Accordion } from "./Accordion";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Text from "./CustomText";
import { Modalize } from "react-native-modalize";
import { FlatList } from "react-native-gesture-handler";

const reallifeRPG = new ReallifeAPI();

export default class Store extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      loadingItems: true,
      category: props.category, // should be vehicles or items
    };
    this.modalizeRef = createRef(null);
  }

  _renderShopItem = ({ item }) => {
    const { category } = this.state;
    if (category === "vehicles") {
      return (
        <ShopItem>
          <Text type="SemiBold" style={styles.itemname}>
            {item.name}
          </Text>
          <Row>
            <Text style={styles.level}>Level: {item.level}</Text>
            <Text style={styles.information}>{item.v_space} Kg</Text>
            <Text type="SemiBold" style={styles.price}>
              {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
            </Text>
          </Row>
        </ShopItem>
      );
    } else if (category === "items") {
      return (
        <ShopItem>
          <Text type="SemiBold" style={styles.itemname}>
            {item.name}
          </Text>
          <Row>
            <Text style={{ width: "50%" }}>Level: {item.level}</Text>
            <Text type="SemiBold" style={{ ...styles.price, width: "50%" }}>
              {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
            </Text>
          </Row>
        </ShopItem>
      );
    }
  };

  _renderShop = (category, shop) => {
    return (
      <Text
        key={shop.shoptype}
        style={styles.item}
        onPress={() => this.getShopItems(category, shop)}
      >
        {shop.shopname}
      </Text>
    );
  };

  getShopItems = async (category, shop) => {
    this.openShopModal();
    const items = await reallifeRPG.getShopItems(category, shop.shoptype);
    this.setState({
      activeShop: { name: shop.shopname, category: category },
      shopItems: items.data,
      loadingItems: false,
    });
  };

  openShopModal = () => this.modalizeRef.current?.open();

  closeShopModal = () => this.modalizeRef.current?.close();

  refresh = async () => {
    const { category } = this.state;
    this.setState({ refreshing: true });
    const shopList = await reallifeRPG.getShops(category);
    this.setState({ shops: shopList.data, refreshing: false });
  };

  async componentDidMount() {
    const { category } = this.state;
    const shopList = await reallifeRPG.getShops(category);
    this.setState({ shops: shopList.data, loading: false });
  }

  render() {
    const { category } = this.props;
    const { loading, refreshing, loadingItems, shops, activeShop, shopItems } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.refresh}
                progressBackgroundColor={Colors.refreshController}
                colors={Colors.refreshControllerIndicator}
              />
            }
          >
            {shops.length > 0 ? (
              shops.map((shop) => {
                return this._renderShop(category, shop);
              })
            ) : (
              <Text style={styles.item}>Keine Shops gefunden</Text>
            )}
          </ScrollView>
          <Modalize
            ref={this.modalizeRef}
            adjustToContentHeight={false}
            snapPoint={Layout.window.height * 0.35}
          >
            {!loadingItems ? (
              <View style={modal.content}>
                <Text style={modal.heading}>{activeShop.name.toUpperCase()}</Text>
                <FlatList
                  data={shopItems}
                  keyExtractor={(item) => item.id}
                  renderItem={this._renderShopItem}
                />
              </View>
            ) : (
              <View style={modal.content}>
                <Spinner size="large" />
              </View>
            )}
          </Modalize>
        </View>
      );
    }
  }
}

const ShopItem = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const Row = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
const ItemInformation = styled.Text`
  width: ${100 / 3}%;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    width: "95%",
    textAlign: "center",
    marginLeft: "2.5%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.lightGray,
    borderRadius: 5,
  },
  itemname: {
    display: "flex",
    width: "100%",
    paddingTop: 8,
  },
  information: {
    textAlign: "center",
    width: `${100 / 3}%`,
  },
  level: {
    width: `${100 / 3}%`,
  },
  price: {
    width: `${100 / 3}%`,
    textAlign: "right",
  },
});

const modal = StyleSheet.create({
  content: {
    padding: 20,
  },
  heading: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 16,
    color: "#ccc",
  },
});
