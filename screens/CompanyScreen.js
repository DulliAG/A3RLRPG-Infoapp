import React, { Component } from "react";
import { ReallifeAPI, DateFormatter } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import NoKey from "../components/NoKey";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
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

export default class CompanyScreen extends Component {
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
      console.log(companyList);
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
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
            >
              {companies.length > 0 ? (
                companies.map((company) => {
                  return <Company company={company} />;
                })
              ) : (
                <View style={styles.companyCard}>
                  <Text type="SemiBold" style={{ ...styles.companyName, marginBottom: 0 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  companyCard: {
    width: "95%",
    marginHorizontal: "2.5%",
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
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
});
