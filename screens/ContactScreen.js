import React, { Component, createRef } from "react";
import Layout from "../constants/Layout";
import { ReallifeAPI, DulliAPI } from "../ApiHandler";
// Components
import {
  StyleSheet,
  RefreshControl,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "../components/Spinner";
import { Modalize } from "react-native-modalize";
import { SwipeItem, SwipeButtonsContainer } from "react-native-swipe-item";

const reallifeAPI = new ReallifeAPI();
const dulliAPI = new DulliAPI();

export default class ContactScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
    this.modalizeRef = createRef(null);
  }

  openModal = () => this.modalizeRef.current?.open();

  closeModal = () => this.modalizeRef.current?.close();

  async removeContact(contactId) {
    const { displayedContacts } = this.state;
    try {
      const result = await dulliAPI.deleteContact(contactId);
      if (result.error === null) {
        const newList = displayedContacts.filter((contact) => {
          return contact.id !== contactId;
        });
        this.setState({ displayedContacts: newList });
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.log(err);
    }
  }

  submitForm = async () => {
    const { profile, displayedContacts, phoneNumber } = this.state;
    try {
      const result = await dulliAPI.createContact(
        profile.name,
        profile.pid,
        profile.avatar_full,
        phoneNumber,
        profile.bank_main[0].iban
      );
      if (result.error === null) {
        console.log(result);
        // Display the inserted contact
        displayedContacts.push({
          id: result.inserted_id,
          playerName: profile.name,
          playerId: profile.pid,
          avatarUrl: profile.avatar_full,
          telNo: phoneNumber,
          iban: profile.bank_main[0].phoneNumber,
        });
        this.refresh();
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
    this.closeModal();
  };

  _renderDeleteButton = () => {
    return (
      <SwipeButtonsContainer
        style={{
          alignSelf: "center",
          height: "100%",
          aspectRatio: 1,
          flexDirection: "column",
          padding: 1,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#db2d43",
            borderRadius: 5,
          }}
          onPress={() => console.log("Delete contact")}
        >
          <Ionicons name="ios-trash" size={32} color="white" />
        </TouchableOpacity>
      </SwipeButtonsContainer>
    );
  };

  _renderContact = (contact) => {
    const { profile } = this.state;
    // FIXME Fix swipeable component
    return (
      <View
        key={contact.id}
        style={{
          width: Layout.window.width * 0.9,
          marginLeft: Layout.window.width * 0.05,
          marginTop: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#ededed",
          borderRadius: 8,
          backgroundColor: "white",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
          <View
            style={{
              width: "100%",
              paddingBottom: 8,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={{
                uri: contact.avatarUrl,
              }}
              style={{ width: 40, height: 40, borderRadius: 40 / 2, marginRight: 8 }}
            />
            <Text style={{ fontWeight: "bold" }}>{contact.playerName}</Text>
          </View>
          <View
            style={{ width: "50%", display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="ios-phone-portrait" size={24} color="black" />
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>{contact.telNo}</Text>
          </View>
          <View
            style={{ width: "50%", display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="ios-card" size={24} color="black" />
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>{contact.iban}</Text>
          </View>
        </View>
      </View>
    );
  };

  filterContacts = (keyword) => {
    const { contacts } = this.state;
    const result = contacts.filter((contact) => {
      const playerName = contact.playerName.toLowerCase();
      return playerName.includes(keyword.toLowerCase());
    });
    this.setState({ displayedContacts: result });
  };

  refresh = async () => {
    this.setState({ refreshing: true });
    const contacts = await dulliAPI.getAllContacts();
    this.setState({ contacts: contacts, displayedContacts: contacts, refreshing: false });
  };

  async componentDidMount() {
    const apiKey = await reallifeAPI.getApiKey();
    if (apiKey !== null) {
      const profile = await reallifeAPI.getProfile(apiKey);
      const contacts = await dulliAPI.getAllContacts();
      this.setState({
        contacts: contacts,
        displayedContacts: contacts,
        profile: profile.data[0],
        loading: false,
      });
    } else {
      // TODO Do something if the key wasn't set
    }
  }

  // TODO Add swipe gestures to delete your contact entry
  render() {
    const { loading, refreshing, profile, contacts, displayedContacts } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={styles.container}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "stretch",
              width: Layout.window.width * 0.9,
              marginTop: 16,
              marginLeft: Layout.window.width * 0.05,
            }}
          >
            <TextInput
              style={{
                width: "70%",
                paddingVertical: 7,
                paddingHorizontal: 10,
                backgroundColor: "white",
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderWidth: 1,
                borderColor: "#ededed",
              }}
              onChangeText={(value) => this.filterContacts(value)}
              placeholder={"Kontakt suchen"}
            />
            <TouchableOpacity activeOpacity={0.9} style={{ width: "30%" }} onPress={this.openModal}>
              <Text style={{ ...styles.button, ...styles.save, textAlign: "center" }}>
                Eintragen
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
          >
            {/* <SwipeItem
              style={{
                width: "90%",
                height: 100,
                alignSelf: "center",
                borderRadius: 8,
              }}
              swipeContainerStyle={styles.swipeContentContainerStyle}
              rightButtons={this._renderDeleteButton()}
            >
              <Text>Swipe me!</Text>
            </SwipeItem> */}

            {displayedContacts.length > 0 ? (
              displayedContacts.map((contact) => {
                return this._renderContact(contact);
              })
            ) : (
              <View
                style={{
                  width: Layout.window.width * 0.9,
                  marginLeft: Layout.window.width * 0.05,
                  marginTop: 16,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#ededed",
                  borderRadius: 8,
                  backgroundColor: "white",
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  Keinen Kontakt gefunden
                </Text>
              </View>
            )}
          </ScrollView>
          <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
            <View style={modal.content}>
              <Text style={modal.heading}>{"Kontakt erstellen".toUpperCase()}</Text>

              <View style={{ ...styles.formGroup, marginBottom: 16 }}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.formControl} value={profile.name} editable={false} />
              </View>
              <View style={{ ...styles.formGroup, marginBottom: 16 }}>
                <Text style={styles.label}>Telefon</Text>
                <TextInput
                  style={styles.formControl}
                  placeholder="Telefonnummer eintragen"
                  onChangeText={(value) => this.setState({ phoneNumber: value })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>IBAN</Text>
                <TextInput
                  style={styles.formControl}
                  value={profile.bank_main[0].iban}
                  editable={false}
                />
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity onPress={this.closeModal}>
                  <Text style={modal.button}>Abbrechen</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={this.submitForm}>
                  <Text style={{ ...modal.button, ...modal.save }}>Speichern</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modalize>
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
  label: {
    marginBottom: 0,
    fontSize: 14,
    fontWeight: "bold",
  },
  formGroup: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  formControl: {
    width: "100%",
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  swipeContentContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderColor: "#e3e3e3",
    borderWidth: 1,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginLeft: -7,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  save: {
    backgroundColor: "#2196F3",
    color: "white",
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
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  save: {
    backgroundColor: "#2196F3",
    color: "white",
  },
});
