import React, { Component } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import { RefreshControl, StyleSheet, View } from "react-native";
import Text from "../components/CustomText";
import { Accordion } from "../components/Accordion";
import { ScrollView } from "react-native-gesture-handler";
import Spinner from "../components/Spinner";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const reallifeRPG = new ReallifeAPI();

export default class ContactScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  _renderContact = (contact) => {
    return (
      <View key={`${contact.number}`} style={styles.contact}>
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

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null && apiKey !== "") {
      const PlayerProfile = await reallifeRPG.getProfile(apiKey);
      var profileData = PlayerProfile.data[0];
      var phones = profileData.phones;
      var phonebooks = profileData.phonebooks;
      this.setState({
        refreshing: false,
        phones: phones,
        phonebooks: phonebooks,
        apiKey: apiKey,
      });
    }
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null && apiKey !== "") {
      const PlayerProfile = await reallifeRPG.getProfile(apiKey);
      var profileData = PlayerProfile.data[0];
      var phones = profileData.phones;
      var phonebooks = profileData.phonebooks;
      this.setState({
        loading: false,
        phones: phones,
        phonebooks: phonebooks,
        apiKey: apiKey,
      });
    }
  }

  render() {
    const { loading, refreshing, phones, phonebooks } = this.state;

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
                colors={Colors.refreshControllerIndicator}
              />
            }
          >
            <Accordion title="Handynummern" expanded={false}>
              {phones.length > 0 ? (
                phones.map((phone) => {
                  var note;
                  switch (phone.note) {
                    case "default":
                      note = "Standardnummer";
                      break;

                    case "bought":
                      note = "Gekauft";
                      break;

                    default:
                      note = phone.note;
                      break;
                  }

                  return (
                    <View
                      key={phone.phone}
                      style={{
                        ...styles.contact,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text type="SemiBold" style={styles.contactName}>
                        {note}
                      </Text>
                      <Text style={{ fontSize: 15 }}>{phone.phone}</Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.contact}>Keine Handynummern gefunden</Text>
              )}
            </Accordion>

            {phonebooks.length > 0 ? (
              phonebooks.map((pb, index) => {
                var side = pb.side;
                var phonebookName;
                if (side === "CIV") {
                  phonebookName = "Zivilist";
                } else if (side === "COP") {
                  phonebookName = "Polizei";
                } else if (side === "EAST") {
                  phonebookName = "RAC";
                } else if (side === "MEDIC" || side === "GUER") {
                  phonebookName = "Abramier";
                } else {
                  phonebookName = "Unbekannt";
                }
                var contacts = pb.phonebook;
                return (
                  <Accordion key={index} title={phonebookName} expanded={index == 0}>
                    {contacts.length > 0 ? (
                      contacts.map((contact) => {
                        return this._renderContact(contact);
                      })
                    ) : (
                      <Text>Keine Kontakte gefunden</Text>
                    )}
                  </Accordion>
                );
              })
            ) : (
              <Text>Keine Kontaktbücher gefunden</Text>
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
    backgroundColor: "white",
  },
  contact: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
    marginBottom: 8,
    marginHorizontal: "2.5%",
    paddingVertical: 4,
    paddingHorizontal: "2.5%",
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
  phone: {},
  contactInformation: {
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  contactIcon: {
    marginRight: 8,
  },
});
