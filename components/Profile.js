import React from "react";
import Colors from "../constants/Colors";
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

const Side = (props) => {
  const { icon, level } = props;
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        width: 100 / 3.2 + "%",
        padding: 8,
        backgroundColor: Colors.lightGray,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 5,
      }}
    >
      <Ionicons name={icon} size={24} color="black" style={styles.icon} />
      <Badge>Level {level}</Badge>
    </View>
  );
};

const PlayerStats = (props) => {
  const { label, text } = props;
  return (
    <View
      style={{
        marginBottom: 8,
        marginHorizontal: "2.5%",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: Colors.lightGray,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <Label>{label}</Label>
      <Content>{text}</Content>
    </View>
  );
};

export default class Profile extends React.Component {
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
  }

  render() {
    const { loading, refreshing, profile } = this.state;

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
            {profile.suspended == 1 && (
              <CustomAlert msg="Du wurdest gebannt!" bg={Colors.tabIconSelected} />
            )}

            {profile.jail_time >= 1 && (
              <CustomAlert
                msg={`Du sitzt derzeit im Bundesgefänigs von Nordholm ein. Deine Inhaftierung dauert noch ${
                  profile.jail_time / 2
                } Monate an!`}
                bg={Colors.tabIconSelected}
              />
            )}

            <View style={styles.container}>
              <View style={{ ...styles.avatarContainer, marginTop: 16 }}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: profile.avatar_full,
                  }}
                />
              </View>

              <View style={{ ...styles.row, marginHorizontal: "2.5%" }}>
                <Text type="SemiBold" style={styles.level}>
                  Level {profile.level}
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 25,
                    backgroundColor: Colors.lightGray,
                    borderWidth: 1,
                    borderColor: Colors.border,
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      width: `${profile.level_progress}%`,
                      height: "100%",
                      backgroundColor: Colors.tabIconSelected,
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }}
                  />
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Text type="SemiBold" style={{ textAlign: "center", fontSize: 16 }}>
                  Fraktionen
                </Text>

                <View
                  style={{
                    ...styles.row,
                    justifyContent: "space-between",
                    marginHorizontal: "2.5%",
                    marginBottom: 16,
                  }}
                >
                  <Side icon="ios-ribbon" level={profile.coplevel} />
                  <Side icon="ios-medkit" level={profile.mediclevel} />
                  <Side icon="ios-construct" level={profile.adaclevel} />
                </View>

                <PlayerStats label="Name" text={profile.name} />
                <PlayerStats label="Player Id" text={profile.pid} />
                <PlayerStats
                  label="Bargeld"
                  text={`${profile.cash.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`}
                />
                <PlayerStats
                  label="Kontostand"
                  text={`${profile.bankacc.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`}
                />
                <PlayerStats label="Quest Fortschritt" text={`${profile.quest_row} / 39`} />
                <PlayerStats label="Skillpunkte" text={`${profile.skillpoint} Verfügbar`} />
                <PlayerStats
                  label="Aktive Spielzeit"
                  text={`${(profile.play_time.active / 60).toFixed(2)} Stunden`}
                />
                <PlayerStats
                  label="Gesamte Spielzeit"
                  text={`${(profile.play_time.total / 60).toFixed(2)} Stunden`}
                />
                <PlayerStats label="Zuletzt Online" text={df.format(profile.last_seen.date)} />
              </View>
            </View>
          </ScrollView>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

const Badge = Styled.Text`
  text-align: center;
  width: 90%;
  margin: 0 auto;
  padding: 4px;
  font-family: "OpenSans-Regular";
  font-size: 14px;
  border-radius: 6px;
  background-color: ${Colors.tabIconSelected};
  color: white;
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
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
