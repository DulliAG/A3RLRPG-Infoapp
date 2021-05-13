import React, { Component } from "react";
import Styled from "styled-components";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
import { NotifyHandler } from "../NotifyHandler";
// Components
import Spinner from "../components/Spinner";
import CustomAlert from "../components/CustomAlert";
import { Accordion } from "../components/Accordion";
import { View, ScrollView, StyleSheet, RefreshControl, Linking, ToastAndroid } from "react-native";
import Text from "../components/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
    };
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
      const profileData = profile.data[0];
      var houseList = profileData.houses;
      var rentalList = profileData.rentals;
      this.setState({
        profile: profile.data[0],
        houses: houseList,
        rentals: rentalList,
        apiKey: apiKey,
        loading: false,
      });
    } else {
      this.setState({ apiKey: null, loading: false });
    }
  }

  render() {
    const { loading, refreshing, apiKey, houses, rentals } = this.state;

    const HouseAccordion = (props) => {
      const { house } = props;
      var payedForDays = house.payed_for / 24;
      var payedFor = `Gewartet für ${payedForDays} ${payedForDays > 1 ? "Tage" : "Tag"}`;
      var loc = house.location.substring(1, house.location.length - 1).split(",");
      return (
        <Accordion title={`Haus ${house.id}`}>
          <View style={styles.a}>
            <Text type="SemiBold" style={{ textAlign: "center", fontSize: 14 }}>
              {payedFor}
            </Text>

            <View style={styles.row}>
              <View style={styles.btnContainer}>
                <Text type="SemiBold" style={{ textAlign: "center" }}>
                  Position
                </Text>
                <TouchableHighlight
                  style={modal.btn}
                  underlayColor={Colors.border}
                  onPress={() =>
                    Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                  }
                >
                  <MaterialCommunityIcons
                    name="map-search-outline"
                    size={24}
                    color="black"
                    style={{ textAlign: "center", paddingVertical: 15 }}
                  />
                </TouchableHighlight>
              </View>

              {/* <View style={styles.btnContainer}>
                <Text type="SemiBold" style={{ textAlign: "center" }}>
                  Benachrichtigung
                </Text>
                <TouchableHighlight
                  style={modal.btn}
                  underlayColor="#ededed"
                  onPress={() =>
                    Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                  }
                >
                  <MaterialCommunityIcons
                    name="bell-plus-outline"
                    size={24}
                    color="black"
                    style={{ textAlign: "center", paddingVertical: 15 }}
                  />
                </TouchableHighlight>
              </View> */}
            </View>
          </View>
        </Accordion>
      );
    };

    const RentalAccordion = (props) => {
      const { rental } = props;
      var payedForDays = rental.payed_for / 24;
      var payedFor = `Gewartet für ${payedForDays} ${payedForDays > 1 ? "Tage" : "Tag"}`;
      var loc = rental.location.substring(1, rental.location.length - 1).split(",");
      return (
        <Accordion title={`Appartment ${rental.id}`}>
          <View style={styles.a}>
            <Text type="SemiBold" style={{ textAlign: "center", fontSize: 14 }}>
              {payedFor}
            </Text>

            <View style={styles.row}>
              <View style={styles.btnContainer}>
                <Text type="SemiBold" style={{ textAlign: "center" }}>
                  Position
                </Text>
                <TouchableHighlight
                  style={modal.btn}
                  underlayColor={Colors.border}
                  onPress={() =>
                    Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                  }
                >
                  <MaterialCommunityIcons
                    name="map-search-outline"
                    size={24}
                    color="black"
                    style={{ textAlign: "center", paddingVertical: 15 }}
                  />
                </TouchableHighlight>
              </View>

              {/* <View style={styles.btnContainer}>
                <Text type="SemiBold" style={{ textAlign: "center" }}>
                  Benachrichtigung
                </Text>
                <TouchableHighlight
                  style={modal.btn}
                  underlayColor="#ededed"
                  onPress={() =>
                    Linking.openURL(`https://info.realliferpg.de/map?x=${loc[0]}&y=${loc[1]}`)
                  }
                >
                  <MaterialCommunityIcons
                    name="bell-plus-outline"
                    size={24}
                    color="black"
                    style={{ textAlign: "center", paddingVertical: 15 }}
                  />
                </TouchableHighlight>
              </View> */}
            </View>
          </View>
        </Accordion>
      );
    };

    const NoResults = (props) => {
      const { message } = props;
      return (
        <View style={styles.a}>
          <Text type="SemiBold" style={{ textAlign: "center" }}>
            {message}
          </Text>
        </View>
      );
    };

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      if (apiKey !== null) {
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
              <CustomAlert
                msg={
                  "Hier werden nur Immobilien & Appartments angezeigt für welche du einen Schlüssel besitzt!"
                }
                bg={Colors.tabIconSelected}
              />

              {houses.length > 0 ? (
                houses.map((house) => {
                  return <HouseAccordion house={house} />;
                })
              ) : (
                <NoResults message="Keine Häuser gefunden" />
              )}

              {rentals.length > 0 ? (
                rentals.map((rental) => {
                  return <RentalAccordion rental={rental} />;
                })
              ) : (
                <NoResults message="Keine Appartments gefunden" />
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
    backgroundColor: "#fff",
  },
  a: {
    marginTop: 8,
    marginHorizontal: "2.5%",
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  btnContainer: {
    width: "40%",
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
