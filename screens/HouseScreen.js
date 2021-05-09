import React, { Component, createRef } from "react";
import Styled from "styled-components";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
import { NotifyHandler } from "../NotifyHandler";
// Components
import Spinner from "../components/Spinner";
import CustomAlert from "../components/CustomAlert";
import { View, ScrollView, StyleSheet, RefreshControl, Linking, ToastAndroid } from "react-native";
import Text from "../components/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";
import NoKey from "../components/NoKey";

const reallifeRPG = new ReallifeAPI();
const notifyHandler = new NotifyHandler();

export default class HouseScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      loadingModal: false,
    };
    this.modalizeRef = createRef(null);
  }

  // TODO Check if this function works
  deleteNotification = async (house) => {
    const allNotifications = await notifyHandler.getAllScheduledNotifications();
    const houseNotifications = allNotifications.filter((notification) => {
      if (notification.content.data.houseId === house.id) {
        return notification.identifier;
      }
    });
    houseNotifications.forEach((notificationIdentifier) => {
      notifyHandler.cancelScheduledNotification(notificationIdentifier);
    });
    ToastAndroid.showWithGravityAndOffset(
      "Benachrichtigungen gelöscht",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      150
    );
  };

  // TODO Check if this works
  setNotification = async (house) => {
    const apiKey = await reallifeRPG.getApiKey();
    const timeLeft = house.payed_for;
    const expireDate = reallifeRPG.getMaintenanceExpireDate(timeLeft);
    const isHouse = house.players !== undefined ? true : false;
    // TODO Schedule an notification at the start of the server period the maintenance expires
    // Check if there are 7 days or more left to schedule the notification
    const options = {
      title: isHouse ? "Hauswartung" : "Appartment Mietvertrag",
      message: isHouse
        ? `Die Wartung für dein Haus ${house.id} läuft in 7 Tagen aus!`
        : `Der Mietvertrag für dein Appartment ${house.id} läuft in 7 Tagen ab!`,
      data: { creatorApiKey: apiKey, id: house.id },
      trigger: expireDate,
    };
    if (timeLeft >= 7 * 24) {
      notifyHandler.schedulePushNotification(
        options.title,
        options.message,
        options.data,
        options.trigger
      );
    }
    // Check if there are 24 hours or more left to schedule the notification
    if (timeLeft >= 24) {
      notifyHandler.schedulePushNotification(
        options.title,
        options.message,
        options.data,
        options.trigger
      );
    }
    ToastAndroid.showWithGravityAndOffset(
      "Benachrichtigungen erstellt",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      150
    );
  };

  _renderModalContent = (selectedHouse) => {
    // TODO Use an WebView with Modalize instead of redirecting to an browser
    // https://github.com/jeremybarbet/react-native-modalize/blob/master/examples/expo/src/components/modals/FacebookWebView.js
    let icon,
      btnAction,
      loading = false;
    const { apiKey } = this.state;
    const loc = selectedHouse.location.substring(1, selectedHouse.location.length - 1).split(",");

    // FIXME Check if there aleady exists an scheduled notification & if yes we change the icon and make them deletable
    if (loading) {
      return <Spinner />;
    } else {
      return (
        <View>
          <Label>
            {`Gewartet für ${selectedHouse.payed_for / 24} ${
              selectedHouse.payed_for / 24 > 1 ? "Tage" : "Tag"
            }`}
          </Label>
          <View style={styles.row}>
            <View style={styles.btnContainer}>
              <Label>Position</Label>
              <TouchableHighlight
                style={modal.btn}
                underlayColor="#ededed"
                onPress={() =>
                  Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                }
              >
                <Ionicons
                  name="ios-map"
                  size={24}
                  color="black"
                  style={{ textAlign: "center", paddingVertical: 15 }}
                />
              </TouchableHighlight>
            </View>
            {/* 
            FIXME After we solved 
            <View style={styles.btnContainer}>
            <Label>Benachrichtigung</Label>
            <TouchableHighlight style={modal.btn} underlayColor="#ededed" onPress={btnAction}>
              <Ionicons
                name={"ios-notifications"}
                size={24}
                color="black"
                style={{ textAlign: "center", paddingVertical: 15 }}
              />
            </TouchableHighlight>
          </View> */}
          </View>
        </View>
      );
    }
  };

  _renderRental = (rental) => {
    return <Text key={rental.id} style={styles.item} onPress={() => this.openModal(rental)}></Text>;
    return (
      <TouchableWithoutFeedback key={rental.id} onPress={() => this.openModal(rental)}>
        <Card key={rental.id} style={{ marginTop: 18, padding: 20 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            Appartment Nr. {rental.id}
          </Text>
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  _renderHouse = (house) => {
    return (
      <Text key={house.id} style={styles.item} onPress={() => this.openModal(house)}>
        Haus Nr. {house.id}
      </Text>
    );
    return (
      <TouchableWithoutFeedback key={house.id} onPress={() => this.openModal(house)}>
        <Card key={house.id} style={{ marginTop: 18, padding: 20 }}>
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>Haus Nr. {house.id}</Text>
        </Card>
      </TouchableWithoutFeedback>
    );
  };

  _renderPlaceholder = (message) => {
    return <Text style={styles.item}>{message}</Text>;
  };

  openModal = (house) => {
    this.setState({ selectedHouse: house });
    this.modalizeRef.current?.open();
  };

  closeModal = () => this.modalizeRef.current?.close();

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const profile = await reallifeRPG.getProfile(apiKey);
      this.setState({ profile: profile.data[0], refreshing: false });
    } else {
      this.setState({ profile: null, refreshing: false });
    }
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const profile = await reallifeRPG.getProfile(apiKey);
      this.setState({ profile: profile.data[0], apiKey: apiKey, loading: false });
    } else {
      this.setState({ profile: null, loading: false });
    }
  }

  render() {
    const { loading, refreshing, loadingModal, profile, selectedHouse } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      // If profile equals null the key wasn't set
      if (profile !== null) {
        return (
          <View style={{ flex: 1 }}>
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
                msg={
                  "Hier werden nur Immobilien & Appartments angezeigt für welche du einen Schlüssel besitzt!"
                }
                bg={Colors.tabIconSelected}
              />
              {profile.houses.length > 0
                ? profile.houses.map((house) => {
                    return this._renderHouse(house);
                  })
                : this._renderPlaceholder("Kein Haus gefunden")}

              {profile.rentals.length > 0
                ? profile.rentals.map((rental) => {
                    return this._renderRental(rental);
                  })
                : this._renderPlaceholder("Kein Appartment gefunden")}
            </ScrollView>
            <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
              <View style={modal.content}>
                <Text style={modal.heading}>
                  {selectedHouse !== undefined
                    ? selectedHouse.players !== undefined
                      ? `Haus ${selectedHouse.id}`.toUpperCase()
                      : `Appartment ${selectedHouse.id}`.toUpperCase()
                    : null}
                </Text>
                {selectedHouse !== undefined ? this._renderModalContent(selectedHouse) : null}
              </View>
            </Modalize>
          </View>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

const Card = Styled.View`
  width: 90%;
  margin-left: 5%;
  background-color: white;
  border-top-width: 5px;
  border-color: ${Colors.tabIconSelected};
  border-radius: 8px;
`;
const Label = Styled.Text`
  margin-bottom: 6px;
  text-align: center;
  font-weight: bold;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  btnContainer: {
    width: "35%",
  },
  item: {
    width: "95%",
    textAlign: "center",
    marginLeft: "2.5%",
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
  btn: { backgroundColor: "#f8f9fa", borderRadius: 8 },
});
