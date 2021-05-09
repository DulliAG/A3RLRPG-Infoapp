import React, { Component } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import { RefreshControl, StyleSheet, View, TextInput } from "react-native";
import Text from "../components/CustomText";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "../components/Spinner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const reallifeRPG = new ReallifeAPI();

export default class ContactScreen extends Component {
  constructor() {
    super();
    this.state = { loading: true, refreshing: false, keyword: null };
  }

  _renderContact = (contact) => {
    return (
      <View key={contact.id} style={styles.contactCard}>
        <Text type="SemiBold" style={styles.contactName}>
          {contact.name}
        </Text>
        <View style={styles.row}>
          <View style={[styles.contactInformation, styles.row]}>
            <MaterialCommunityIcons style={styles.contactIcon} name="cellphone-android" size={24} />
            <Text>{contact.number}</Text>
          </View>
          <View style={[styles.contactInformation, styles.row]}>
            <MaterialCommunityIcons
              style={styles.contactIcon}
              name="credit-card-outline"
              size={24}
            />
            <Text>{contact.iban !== "" ? contact.iban : "Keine Angabe"}</Text>
          </View>
        </View>
      </View>
    );
  };

  filterContact = (keyword) => {
    const { contacts } = this.state;
    var matches = contacts.filter((contact) => {
      return contact.name.toLowerCase().includes(keyword.toLowerCase());
    });
    this.setState({ displayedContacts: matches });
  };

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    const profile = await reallifeRPG.getProfile(apiKey);
    var phonebook = profile.data[0].phonebooks[0].phonebook;
    this.setState({ refreshing: false, contacts: phonebook, displayedContacts: phonebook });
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null && apiKey !== "") {
      const profile = await reallifeRPG.getProfile(apiKey);
      var phonebook = profile.data[0].phonebooks[0].phonebook;
      this.setState({
        loading: false,
        contacts: phonebook,
        displayedContacts: phonebook,
        apiKey: apiKey,
      });
    }
  }

  render() {
    const { loading, refreshing, displayedContacts } = this.state;

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
                progressBackgroundColor={Colors.tabIconSelected}
                colors={["white"]}
              />
            }
          >
            <TextInput
              style={styles.input}
              onChangeText={(value) => this.filterContact(value)}
              placeholder="Kontakt suchen"
            />
            {displayedContacts.length > 0 ? (
              displayedContacts.map((contact) => {
                return this._renderContact(contact);
              })
            ) : (
              <Text
                type="SemiBold"
                style={{
                  textAlign: "center",
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  width: "95%",
                  marginLeft: "2.5%",
                  paddingVertical: 8,
                }}
              >
                Keine Kontakte gefunden
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  input: {
    width: "95%",
    marginVertical: 16,
    marginHorizontal: "2.5%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 8,
    fontFamily: "OpenSans-Regular",
  },
  contactCard: {
    width: "95%",
    marginHorizontal: "2.5%",
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  contactName: {
    textAlign: "center",
    marginBottom: 4,
    fontSize: 16,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactInformation: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  contactIcon: {
    marginRight: 8,
  },
});
