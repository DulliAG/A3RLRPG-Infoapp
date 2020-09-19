import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import CustomAlert from "./CustomAlert";
import Styled from "styled-components";
import Spinner from "../components/Spinner";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import { Ionicons } from "@expo/vector-icons";

// TODO This needs an re-design asap!!!
export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      profile: null,
    };
  }

  getKey() {
    return new Promise((res, rej) => {
      try {
        res(AsyncStorage.getItem("@apiKey"));
      } catch (err) {
        rej(err);
      }
    });
  }

  getProfile(apiKey) {
    return new Promise((res, rej) => {
      fetch(`https://api.realliferpg.de/v1/player/${apiKey}/`)
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((err) => rej(err));
    });
  }

  componentDidMount() {
    this.getKey().then((key) => {
      this.getProfile(key).then((profileData) => {
        this.setState({ profile: profileData.data[0], loading: false });
      });
    });
  }

  render() {
    if (this.state.loading == true) {
      return <Spinner size="large" />;
    } else {
      return (
        <View>
          {this.state.profile.suspended == 1 ? (
            <CustomAlert msg="Du wurdest gebannt!" bg="#dc3545" />
          ) : null}
          {this.state.profile.jail_time >= 1 ? (
            <CustomAlert
              msg={`Du sitzt derzeit im Bundesgefänigs von Nordholm ein. Deine Inhaftierung dauert noch ${
                this.state.profile.jail_time / 2
              } Monate an!`}
              bg="#dc3545"
            />
          ) : null}
          <ProfileContainer>
            <Image
              source={{
                uri: this.state.profile.avatar_full,
              }}
              style={styles.avatar}
            />
            <Username>{this.state.profile.name}</Username>
            <PlayerID>{this.state.profile.pid}</PlayerID>
          </ProfileContainer>
          <FractionContainer>
            <Fraction>
              <Ionicons name="ios-ribbon" size={24} color="black" />
              <Level>Level: {this.state.profile.coplevel}</Level>
            </Fraction>
            <Fraction>
              <Ionicons name="ios-medkit" size={24} color="black" />
              <Level>Level: {this.state.profile.mediclevel}</Level>
            </Fraction>
            <Fraction>
              <Ionicons name="ios-construct" size={24} color="black" />
              <Level>Level: {this.state.profile.adaclevel}</Level>
            </Fraction>
          </FractionContainer>
          <LevelContainer>
            <Row style={{ width: "90%", marginLeft: "5%" }}>
              <Level style={{ width: "25%", textAlign: "left" }}>{this.state.profile.level}</Level>
              <Level style={{ width: "50%", textAlign: "center" }}>
                {this.state.profile.skillpoint} Verfügbare Skillpunkte
              </Level>
              <Level style={{ width: "25%", textAlign: "right" }}>
                {this.state.profile.level + 1}
              </Level>
            </Row>
            <ProgressContainer>
              <ProgressBar
                style={{
                  width: `${this.state.profile.level_progress}%`,
                  backgroundColor: Colors.tabIconSelected,
                }}
              />
            </ProgressContainer>
          </LevelContainer>
          <Row>
            <Stats>
              <Ionicons name="ios-cash" size={24} color="black" />
              <Text style={styles.statsContent}>50.000 €</Text>
            </Stats>
            <Stats>
              <Ionicons name="ios-card" size={24} color="black" />
              <Text style={styles.statsContent}>1.150.000 €</Text>
            </Stats>

            <Stats>
              <Ionicons name="ios-time" size={24} color="black" />
              <Text style={styles.statsContent}>
                {(this.state.profile.play_time.active / 60).toFixed(2)} Stunden
              </Text>
            </Stats>

            <Stats>
              <Ionicons name="ios-clock" size={24} color="black" />
              <Text style={styles.statsContent}>
                {(this.state.profile.play_time.total / 60).toFixed(2)} Stunden
              </Text>
            </Stats>

            <Stats>
              <Ionicons name="ios-clipboard" size={24} color="black" />
              <Text style={styles.statsContent}>{this.state.profile.quest_row} / 39</Text>
            </Stats>

            <Stats>
              <Ionicons name="ios-calendar" size={24} color="black" />
              <Text style={styles.statsContent}>{this.state.profile.last_seen.date}</Text>
            </Stats>
          </Row>
        </View>
      );
    }
  }
}

const Row = Styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const ProfileContainer = Styled.View`
  display: flex;
  align-items: center;
  padding: 20px 0;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #ededed;
`;

const FractionContainer = Styled.View`
  display: flex; 
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #ededed;
`;

const Fraction = Styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 33.33%;
  padding: 10px 0;
`;

const Level = Styled.Text`
  text-align: center;
  width: 100%;
  font-weight: bold;
`;

const LevelContainer = Styled.View`
  display: flex; 
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #ededed;
`;

const ProgressContainer = Styled.View`
  width: 90%;
  height: 25px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: #ededed;
`;

const ProgressBar = Styled.View`
  height: 100%;
  border-radius: 5px;
`;

const Stats = Styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 50%;
  padding: 10px 0;
`;

const Username = Styled.Text`  
  font-weight: bold;
  font-size: 20px;
`;

const PlayerID = Styled.Text`
  font-size: 16px;
`;

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 130 / 2,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: Colors.tabIconSelected,
  },
  statsContent: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
