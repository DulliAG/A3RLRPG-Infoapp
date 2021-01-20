import React, { Component, createRef } from "react";
import Layout from "../constants/Layout";
import { ReallifeAPI } from "../ApiHandler";
import styled from "styled-components";
// Components
import Spinner from "./Spinner";
import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";
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
          <ItemName>{item.name}</ItemName>
          <Row>
            <ItemInformation>Level: {item.level}</ItemInformation>
            <ItemLevel>{item.v_space} Kg</ItemLevel>
            <ItemPrice>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</ItemPrice>
          </Row>
        </ShopItem>
      );
    } else if (category === "items") {
      return (
        <ShopItem>
          <ItemName>{item.name}</ItemName>
          <Row>
            <ItemInformation style={{ width: "50%" }}>Level: {item.level}</ItemInformation>
            <ItemPrice style={{ width: "50%" }}>
              {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
            </ItemPrice>
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

    if (loading && !refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View>
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
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
const ItemName = styled.Text`
  display: flex;
  width: 100%;
  padding-top: 8px;
  font-weight: bold;
`;
const ItemInformation = styled.Text`
  width: ${100 / 3}%;
`;
const ItemLevel = styled.Text`
  text-align: center;
  width: ${100 / 3}%;
`;
const ItemPrice = styled.Text`
  width: ${100 / 3}%;
  text-align: right;
  font-weight: bold;
`;

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
    backgroundColor: "white",
    borderRadius: 8,
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
    fontWeight: "600",
    color: "#ccc",
  },
});
