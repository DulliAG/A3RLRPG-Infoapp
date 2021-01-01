import React from "react";
import { ReallifeAPI } from "../ApiHandler";
import Styled from "styled-components";
// Component
import Spinner from "../components/Spinner";
import { Image, ScrollView, RefreshControl } from "react-native";

const reallifeRPG = new ReallifeAPI();

export default class MarketItem extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      data: [],
    };
  }

  refresh = () => {
    this.setState({ refreshing: true });
    const server1 = reallifeRPG.getMarketPrices(1),
      server2 = reallifeRPG.getMarketPrices(2);

    Promise.all([server1, server2])
      .then((value) => {
        const market1 = value[0].data,
          market2 = value[1].data;
        let items = [];

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
      .then(() => this.setState({ refreshing: false }));
  };

  async componentDidMount() {
    const server1 = reallifeRPG.getMarketPrices(1),
      server2 = reallifeRPG.getMarketPrices(2);

    Promise.all([server1, server2])
      .then((value) => {
        const market1 = value[0].data,
          market2 = value[1].data;
        let items = [];

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
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, refreshing, data } = this.state;

    if (loading && !refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <ScrollView
          horizontal={false}
          showsVerticalScrollIndicator={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
        >
          {data.map((item, index) => {
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
                    <Price>
                      {item.price.server1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
                    </Price>
                  </Row>
                  <Row>
                    <Strong>Server 2: </Strong>
                    <Price>
                      {item.price.server2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
                    </Price>
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
  width: 90%;
  margin: 5px auto;
  padding: 5px 10px;
  background-color: #fff;
  border-left-width: 5px;
  border-color: #2f95dc;
  border-radius: 8px;
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
