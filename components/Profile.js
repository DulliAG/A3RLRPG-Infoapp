import React, { createRef } from "react";
import * as Notifications from "expo-notifications";
import Colors from "../constants/Colors";
import { NotifyHandler } from "../NotifyHandler";
import { ReallifeAPI, DateFormatter } from "../ApiHandler";
import Layout from "../constants/Layout";
// Components
import { StyleSheet, Image, View, RefreshControl } from "react-native";
import Text from "../components/CustomText";
import CustomAlert from "./CustomAlert";
import Styled from "styled-components";
import Spinner from "../components/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import NoKey from "./NoKey";

const df = new DateFormatter();
const reallifeRPG = new ReallifeAPI();
const notifyHandler = new NotifyHandler();

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      profile: null,
      expoPushToken: "",
      notification: false,
    };
    this.notificationListener = createRef();
    this.responseListener = createRef();
  }

  _renderPhoneNumber = (phone) => {
    return (
      <ProfileStats key={phone.phone}>
        <Label>{phone.note !== "default" ? phone.note : "Standardnummer"}</Label>
        <Content>{phone.phone}</Content>
      </ProfileStats>
    );
  };

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const profileData = await reallifeRPG.getProfile(apiKey);
      this.setState({ profile: profileData.data[0], refreshing: false });
    } else {
      this.setState({ profile: null, refreshing: false });
    }
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const profileData = await reallifeRPG.getProfile(apiKey);
      this.setState({ profile: profileData.data[0], loading: false });
    } else {
      this.setState({ loading: false });
    }

    // Run Push Notifications
    // notifyHandler
    //   .registerForPushNotificationsAsync()
    //   .then((token) => this.setState({ expoPushToken: token }));
    // // registerForPushNotificationsAsync().then((token) => this.setState({ expoPushToken: token }));
    // this.notificationListener.current = Notifications.addNotificationReceivedListener(
    //   (notification) => {
    //     this.setState({ notification: notification });
    //   }
    // );
    // this.responseListener.current = Notifications.addNotificationResponseReceivedListener(
    //   (response) => {
    //     console.log(response);
    //   }
    // );
  }

  render() {
    const { loading, refreshing, profile } = this.state;

    /* <TouchableOpacity
              style={{ width: "50%", height: 50, backgroundColor: "red" }}
              onPress={() => {
                console.log("Run Push Notification");
                notifyHandler.schedulePushNotification(
                  "Hauswartungs Erinnerung",
                  "Dein Haus ${ID} ist noch für 7 Tage gewartet!",
                  { data: "goes here" },
                  {
                    seconds: 1,
                    repeats: false,
                  }
                );
              }}
            >
              <Text>Run Push Notification</Text>
            </TouchableOpacity> */

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      // If profile equals null the key wasn't set
      if (profile !== null) {
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
            {profile.suspended == 1 ? (
              <CustomAlert msg="Du wurdest gebannt!" bg={Colors.tabIconSelected} />
            ) : null}
            {profile.jail_time >= 1 ? (
              <CustomAlert
                msg={`Du sitzt derzeit im Bundesgefänigs von Nordholm ein. Deine Inhaftierung dauert noch ${
                  profile.jail_time / 2
                } Monate an!`}
                bg={Colors.tabIconSelected}
              />
            ) : null}

            <View style={{ ...styles.card, marginTop: 18 }}>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: profile.avatar_full,
                  }}
                />
              </View>

              <View style={styles.row}>
                <Text type="SemiBold" style={styles.level}>
                  Level {profile.level}
                </Text>
                <LevelBar>
                  <LevelProgress
                    style={{
                      width: `${profile.level_progress}%`,
                    }}
                  />
                </LevelBar>
              </View>

              <View style={{ ...styles.row, marginTop: 18 }}>
                <Text
                  style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "OpenSans-SemiBold",
                    fontSize: 16,
                  }}
                >
                  Fraktionen
                </Text>
                <Fraction style={{ borderRightWidth: 1, borderColor: "#ededed" }}>
                  <Ionicons name="ios-ribbon" size={24} color="black" style={styles.icon} />
                  <Badge>Level {profile.coplevel}</Badge>
                </Fraction>

                <Fraction style={{ borderRightWidth: 1, borderColor: "#ededed" }}>
                  <Ionicons name="ios-medkit" size={24} color="black" style={styles.icon} />
                  <Badge>Level {profile.mediclevel}</Badge>
                </Fraction>

                <Fraction>
                  <Ionicons name="ios-construct" size={24} color="black" style={styles.icon} />
                  <Badge>Level {profile.adaclevel}</Badge>
                </Fraction>
              </View>

              <ProfileStats style={{ marginTop: 18 }}>
                <Label>Name</Label>
                <Content>{profile.name}</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Player Id</Label>
                <Content>{profile.pid}</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Bargeld</Label>
                <Content>{profile.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Kontostand</Label>
                <Content>
                  {profile.bankacc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
                </Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Quest Fortschritt</Label>
                <Content>{profile.quest_row} / 39</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Skillpunkte</Label>
                <Content>{profile.skillpoint} Verfügbar</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Aktive Spielzeit</Label>
                <Content>{(profile.play_time.active / 60).toFixed(2)} Stunden</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Gesamte Spielzeit</Label>
                <Content>{(profile.play_time.total / 60).toFixed(2)} Stunden</Content>
              </ProfileStats>
              <ProfileStats>
                <Label>Zuletzt Online</Label>
                <Content>{df.format(profile.last_seen.date)}</Content>
              </ProfileStats>
            </View>

            <View style={styles.card}>
              <Text type="SemiBold" style={{ fontSize: 18, marginBottom: 8 }}>
                Handynummern
              </Text>
              {profile.phones.map((phoneNumber) => {
                return this._renderPhoneNumber(phoneNumber);
              })}
            </View>
          </ScrollView>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

const LevelBar = Styled.View`
  width: 100%;
  height: 25px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;
const LevelProgress = Styled.View`
  height: 100%;
  background-color: ${Colors.tabIconSelected};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;
const Fraction = Styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: ${100 / 3}%;
`;
const Badge = Styled.Text`
  text-align: center;
  width: 75%;
  margin: 0 auto;
  padding: 4px;
  font-family: "OpenSans-Regular";
  font-size: 14px;
  border-radius: 6px;
  background-color: ${Colors.tabIconSelected};
  color: white;
`;
const ProfileStats = Styled.View`
  padding: 4px 0;
  border-top-width: 1px;
  border-color: #ededed;
`;
const Label = Styled.Text`
  margin-bottom: 0;
  font-family: "OpenSans-SemiBold";
  font-size: 14px;
`;
const Content = Styled.Text`
  font-family: "OpenSans-Regular";
  font-size: 14px;
`;

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    width: "95%",
    marginRight: "2.5%",
    marginLeft: "2.5%",
    marginBottom: 18,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderTopWidth: 5,
    borderColor: Colors.tabIconSelected,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatar: {
    width: Layout.window.width * 0.3,
    height: Layout.window.width * 0.3,
    borderRadius: (Layout.window.width * 0.3) / 2,
    marginBottom: 15,
    borderWidth: 4,
    borderColor: Colors.tabIconSelected,
  },
  level: {
    marginBottom: 0,
  },
  icon: {
    textAlign: "center",
    width: "100%",
    margin: "auto",
    fontSize: 28,
  },
  statsContent: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
