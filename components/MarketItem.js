import React from "react";
import { bonus as itemBonus, illegalItems } from "../config.json";
import { ReallifeAPI } from "../ApiHandler";
import Colors from "../constants/Colors";
import Styled from "styled-components";
// Component
import Spinner from "../components/Spinner";
import { Image, ScrollView, RefreshControl, StyleSheet } from "react-native";
import Text from "../components/CustomText";
import CustomAlert from "./CustomAlert";

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
    const s1 = {
      information: reallifeRPG.getServer(1),
      market: reallifeRPG.getMarketPrices(1),
    };
    const s2 = {
      information: reallifeRPG.getServer(2),
      market: reallifeRPG.getMarketPrices(2),
    };
    Promise.all([s1.information, s1.market, s2.information, s2.market])
      .then((value) => {
        var s1 = {
          information: value[0],
          market: value[1].data,
          copAmount: reallifeRPG.getCopAmount(value[0]),
        };
        var s2 = {
          information: value[2],
          market: value[3].data,
          copAmount: reallifeRPG.getCopAmount(value[2]),
        };
        var bonus = {
          s1: itemBonus.filter((boni) => boni.amount === s1.copAmount)[0].multiplier,
          s2: itemBonus.filter((boni) => boni.amount === s2.copAmount)[0].multiplier,
        };
        var items = [];
        for (const key in s1.market) {
          if (illegalItems.includes(s1.market[key].item)) {
            items.push({
              item: s1.market[key].item,
              localized: s1.market[key].localized,
              price: {
                server1: parseInt(s1.market[key].price * bonus.s1),
                server2: parseInt(s2.market[key].price * bonus.s2),
              },
            });
          } else {
            items.push({
              item: s1.market[key].item,
              localized: s1.market[key].localized,
              price: {
                server1: parseInt(s1.market[key].price),
                server2: parseInt(s2.market[key].price),
              },
            });
          }
        }
        this.setState({ data: items });
      })
      .then(() => this.setState({ refreshing: false }));
  };

  async componentDidMount() {
    const s1 = {
      information: reallifeRPG.getServer(1),
      market: reallifeRPG.getMarketPrices(1),
    };
    const s2 = {
      information: reallifeRPG.getServer(2),
      market: reallifeRPG.getMarketPrices(2),
    };
    Promise.all([s1.information, s1.market, s2.information, s2.market])
      .then((value) => {
        var s1 = {
          information: value[0],
          market: value[1].data,
          copAmount: reallifeRPG.getCopAmount(value[0]),
        };
        var s2 = {
          information: value[2],
          market: value[3].data,
          copAmount: reallifeRPG.getCopAmount(value[2]),
        };
        var bonus = {
          s1: itemBonus.filter((boni) => boni.amount === s1.copAmount)[0].multiplier,
          s2: itemBonus.filter((boni) => boni.amount === s2.copAmount)[0].multiplier,
        };
        var items = [];
        for (const key in s1.market) {
          if (illegalItems.includes(s1.market[key].item)) {
            items.push({
              item: s1.market[key].item,
              localized: s1.market[key].localized,
              price: {
                server1: parseInt(s1.market[key].price * bonus.s1),
                server2: parseInt(s2.market[key].price * bonus.s2),
              },
            });
          } else {
            items.push({
              item: s1.market[key].item,
              localized: s1.market[key].localized,
              price: {
                server1: parseInt(s1.market[key].price),
                server2: parseInt(s2.market[key].price),
              },
            });
          }
        }
        this.setState({ data: items });
      })
      .then(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, refreshing, data } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
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
          <CustomAlert
            bg={Colors.noticeBackground}
            msg="Der Bonus für illegale Items wird automatisch berechnet!"
          />
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
  width: 95%;
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
  font-family: "OpenSans-SemiBold";
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
  font-family: "OpenSans-SemiBold";
  font-size: 14px;
`;

const Price = Styled.Text`
  width: 50%;
  text-align: right;
  font-size: 14px;
`;
