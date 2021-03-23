import React, { Component } from "react";
import { ReallifeAPI } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import CreditCard from "../components/CreditCard";
import NoKey from "../components/NoKey";
import { View, StyleSheet, Text, ScrollView, RefreshControl } from "react-native";

const reallifeRPG = new ReallifeAPI();

export default class BankAccountScreen extends Component {
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
    var profileData = profile.data[0];
    this.setState({ refreshing: false, profile: profileData });
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null && apiKey !== "") {
      const profile = await reallifeRPG.getProfile(apiKey);
      var profileData = profile.data[0];
      this.setState({ loading: false, profile: profileData, apiKey: apiKey });
    } else {
      this.setState({ loading: false, apiKey: false });
    }
  }

  render() {
    const { loading, refreshing, apiKey, profile } = this.state;

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
              {profile.bank_main.map((acc) => {
                return (
                  <CreditCard
                    key={acc.iban}
                    company={false}
                    iban={acc.iban}
                    owner={acc.pid}
                    balance={`${acc.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`}
                  />
                );
              })}

              {profile.company_owned.map((company) => {
                return (
                  company.disabled == 0 && (
                    <>
                      <CreditCard
                        key={company.bank_1}
                        company={true}
                        iban={company.bank_1}
                        owner={company.name}
                        balance={"UNBEKANNT"}
                      />
                      <CreditCard
                        key={company.bank_2}
                        company={true}
                        iban={company.bank_1}
                        owner={company.name}
                        balance={"UNBEKANNT"}
                      />
                    </>
                  )
                );
              })}
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
});
