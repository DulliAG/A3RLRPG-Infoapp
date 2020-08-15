import React from "react";
import { Image, ToastAndroid, RefreshControl } from "react-native";
import Styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "../components/Spinner";

export default class MarketItem extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      refreshing: false,
      data: [],
    };
  }

  getMarket(server) {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/market/" + server)
        .then((response) => response.json())
        .then((response) => {
          res(response);
        })
        .catch((error) => rej(error));
    });
  }

  componentDidMount() {
    this.setState({ loading: true });
    const server1 = this.getMarket(1);
    const server2 = this.getMarket(2);
    Promise.all([server1, server2])
      .then((value) => {
        const market1 = value[0].data,
          market2 = value[1].data;
        var items = [];
        for (const key in market1) {
          items.push({
            item: market1[key].item,
            localized: market1[key].localized,
            price: { server1: parseInt(market1[key].price), server2: parseInt(market2[key].price) },
          });
        }
        this.setState({ data: items });
      })
      .then(() => this.setState({ loading: false }));
  }

  render() {
    if (this.state.loading == true && this.state.refreshing == false) {
      return <Spinner size="large" />;
    } else {
      const onRefresh = () => {
        this.setState({ refreshing: true });
        const server1 = this.getMarket(1);
        const server2 = this.getMarket(2);
        Promise.all([server1, server2])
          .then((value) => {
            const market1 = value[0].data,
              market2 = value[1].data;
            var items = [];
            for (const key in market1) {
              items.push({
                item: market1[key].item,
                localized: market1[key].localized,
                price: {
                  server1: parseInt(market1[key].price),
                  server2: parseInt(market2[key].price),
                },
              });
            }
            this.setState({ data: items });
          })
          .then(() => {
            ToastAndroid.showWithGravityAndOffset(
              "Marktpreise aktualisiert",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              150
            );
            this.setState({ refreshing: false });
          });
      };

      return (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={onRefresh} />
          }
        >
          {this.state.data.map((item, index) => {
            return (
              <Item key={index}>
                <Info>
                  <Image
                    source={{
                      uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_${item.item}.png`,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                  />
                  <Itemname>{item.localized}</Itemname>
                </Info>
                <PriceContainer>
                  <Row>
                    <Strong>Server 1: </Strong>
                    <Price>{item.price.server1} $</Price>
                  </Row>
                  <Row>
                    <Strong>Server 2: </Strong>
                    <Price>{item.price.server2} $</Price>
                  </Row>
                </PriceContainer>
              </Item>
            );
          })}
        </ScrollView>
      );
    }
  }
}

const Item = Styled.View`
  flex-direction: row;
  align-items: center;
  width: 95%;
  margin: 5px auto;
  padding: 5px 10px;
  background-color: #fff;
  border-left-width: 5px;
  border-color: #2f95dc;
  border-radius: 5px;
  `;

const Info = Styled.View`
  flex-direction: row;
  align-items: center;
  width: 60%;
`;

const Itemname = Styled.Text`
  margin-left: 5px;
  font-weight: bold;
  font-size: 16px;
`;

const PriceContainer = Styled.View`
  width: 40%;
`;

const Row = Styled.View`
  flex-direction: row;
`;
const Strong = Styled.Text`
  width: 50%;
  font-weight: bold;
  font-size: 14px;
`;

const Price = Styled.Text`
  width: 50%;
  text-align: right;
  font-size: 14px;
`;
