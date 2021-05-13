import React, { Component } from "react";
import { ReallifeAPI, DateFormatter } from "../ApiHandler";
import Colors from "../constants/Colors";
// Components
import Spinner from "../components/Spinner";
import NoKey from "../components/NoKey";
import { ArmaItemIcon } from "../components/ArmaItem";
import { Accordion } from "../components/Accordion";
import { View, StyleSheet, ScrollView, RefreshControl, Image } from "react-native";
import Text from "../components/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const df = new DateFormatter();
const reallifeRPG = new ReallifeAPI();

const Company = (props) => {
  const { company } = props;
  return (
    <View key={company.id} style={styles.companyCard}>
      <Text type="SemiBold" style={styles.companyName}>
        {company.name}
      </Text>
      <View style={styles.row}>
        <View style={[styles.companyInformation, styles.row]}>
          <MaterialCommunityIcons style={styles.companyIcon} name="credit-card-outline" size={24} />
          <Text>{company.bank_1}</Text>
        </View>
        <View style={[styles.companyInformation, styles.row]}>
          <MaterialCommunityIcons style={styles.companyIcon} name="credit-card-outline" size={24} />
          <Text>{company.bank_2}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.companyInformation, styles.row]}>
          <MaterialCommunityIcons style={styles.companyIcon} name="cellphone-android" size={24} />
          <Text>{company.phone}</Text>
        </View>
        <View style={[styles.companyInformation, styles.row]}>
          <MaterialCommunityIcons style={styles.companyIcon} name="clock-outline" size={24} />
          <Text>{df.format(company.created_at)}</Text>
        </View>
      </View>
    </View>
  );
};

class CompanyShopsScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  refresh = async () => {};

  async componentDidMount() {
    var shopList = await reallifeRPG.getCompanyShops();
    this.setState({ loading: false, shops: shopList.data });
  }

  render() {
    const { loading, refreshing, shops } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            refreshing={refreshing}
            onRefresh={this.refresh}
            progressBackgroundColor={Colors.refreshController}
            colors={Colors.refreshControllerIndicator}
          >
            {shops.length > 0 ? (
              shops.map((shop, index) => {
                return (
                  <Accordion key={index} title={shop.company.name}>
                    {shop.shops.length > 0 ? (
                      shop.shops.map((item) => {
                        return (
                          <View
                            key={`${index}${item.item}`}
                            style={{
                              ...styles.shopItem,
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <View
                              style={{
                                ...styles.row,
                                alignItems: "center",
                                fontSize: 16,
                                marginLeft: 8,
                              }}
                            >
                              <ArmaItemIcon item={item.item} />
                              <Text type="SemiBold">{item.item_localized}</Text>
                            </View>
                            <View></View>
                            <View>
                              <Text>
                                {item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Stück{" "}
                                {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        type="SemiBold"
                        style={{
                          ...styles.shopItem,
                          textAlign: "center",
                          fontSize: 16,
                        }}
                      >
                        Keine Angebote gefunden
                      </Text>
                    )}
                  </Accordion>
                );
              })
            ) : (
              <Text
                type="SemiBold"
                style={{ ...styles.shopItem, fontSize: 16, textAlign: "center" }}
              >
                Keine Ankaufoptionen gefunden
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }
  }
}

class CompanyScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    const profile = await reallifeRPG.getProfile(apiKey);
    var companyList = profile.data[0].company_owned.filter((company) => {
      return company.disabled == 0;
    });
    this.setState({ refreshing: false, companies: companyList });
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null && apiKey !== "") {
      const profile = await reallifeRPG.getProfile(apiKey);
      var ownedCompanies = profile.data[0].company_owned;
      var companyList = ownedCompanies.filter((company) => {
        return company.disabled == 0;
      });
      this.setState({ loading: false, companies: companyList, apiKey: apiKey });
    } else {
      this.setState({ loading: false, apiKey: false });
    }
  }

  render() {
    const { loading, refreshing, apiKey, companies } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      if (apiKey !== false) {
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
              {companies.length > 0 ? (
                companies.map((company) => {
                  return <Company company={company} />;
                })
              ) : (
                <View style={{ ...styles.companyCard, marginTop: 16 }}>
                  <Text type="SemiBold" style={{ ...styles.companyName }}>
                    Keine Unternehmen gefunden
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

export { CompanyShopsScreen };
export default CompanyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  companyCard: {
    width: "95%",
    marginHorizontal: "2.5%",
    marginBottom: 8,
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  companyName: {
    textAlign: "center",
    marginBottom: 4,
    fontSize: 18,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  companyInformation: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  companyIcon: {
    marginRight: 8,
  },
  shopItem: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    marginBottom: 8,
    marginHorizontal: "2.5%",
    paddingVertical: 4,
    paddingHorizontal: "2.5%",
  },
});
