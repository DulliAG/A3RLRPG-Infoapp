import React from "react";
import { ReallifeAPI } from "../ApiHandler";
import Layout from "../constants/Layout";
import Styled from "styled-components";
// Components
import { StyleSheet, View, Text, RefreshControl, ToastAndroid, Alert } from "react-native";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Spinner from "../components/Spinner";

const reallifeRPG = new ReallifeAPI();

export class ServerList extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      server: null,
      selectedServer: null,
    };
  }

  refresh = async () => {
    this.setState({ refreshing: true });
    const serverList = await reallifeRPG.getServerList();
    this.setState({
      server: serverList.data,
      selectedServer: serverList.data[0],
      refreshing: false,
    });
    ToastAndroid.showWithGravityAndOffset(
      "Serverliste aktualisert",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      150
    );
  };

  async componentDidMount() {
    const serverList = await reallifeRPG.getServerList();
    this.setState({ server: serverList.data, selectedServer: serverList.data[0], loading: false });
  }

  render() {
    const { loading, refreshing, server, selectedServer } = this.state;

    if (loading && !refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ServerContainer>
            <Heading>Serverliste</Heading>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
            >
              {server.map((server, index) => {
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => {
                      this.setState({ selectedServer: server });
                    }}
                  >
                    <Server
                      id={server.Id}
                      width={
                        server.length > 1 ? Layout.window.width * 0.85 : Layout.window.width * 0.9
                      }
                      name={server.Servername}
                      online={server.Playercount}
                      slots={server.Slots}
                      sides={{
                        civ: server.Civilians,
                        cop: server.Cops,
                        rac: server.Adac,
                        medic: server.Medics,
                      }}
                    />
                  </TouchableWithoutFeedback>
                );
              })}
            </ScrollView>
          </ServerContainer>
          <InfoContainer style={{ flex: 1, marginTop: 10 }}>
            <Heading>Spielerliste</Heading>
            <PlayerList players={selectedServer.Players} />
          </InfoContainer>
        </View>
      );
    }
  }
}

export class Server extends React.Component {
  render() {
    const { id, name, width, online, slots, sides } = this.props;

    if (id <= 3) {
      return (
        <Card key={name} style={{ width: width }}>
          <View>
            <Servername>{name}</Servername>
            <Online>
              Online: {online} / {slots}
            </Online>
          </View>
          <View style={styles.fractionContainer}>
            <View style={styles.fractionCard}>
              <Strong>Zivilisten: </Strong>
              <Text>{sides.civ}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>Polizei: </Strong>
              <Text>{sides.cop}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>Medic: </Strong>
              <Text>{sides.medic}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>RAC: </Strong>
              <Text>{sides.rac}</Text>
            </View>
          </View>
        </Card>
      );
    } else {
      return (
        <Card key={name}>
          <View>
            <Servername>{name}</Servername>
            <Online>
              Online: {online} / {slots}
            </Online>
          </View>
        </Card>
      );
    }
  }
}

export class PlayerList extends React.Component {
  render() {
    const { players } = this.props;
    const sortedPlayers = players.length > 1 ? players.sort() : players;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ paddingHorizontal: "5%" }} showsVerticalScrollIndicator={true}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {players.length >= 1 ? (
              players.map((player) => {
                return (
                  <Text key={player} style={styles.item}>
                    {player}
                  </Text>
                );
              })
            ) : (
              <Text style={{ ...styles.item }}>Keine Spieler gefunden</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const ServerContainer = Styled.View`
  margin-top: 10px;
`;

const InfoContainer = Styled.View`
  margin-top: 10px;
`;

const Heading = Styled.Text`
  width: 100%;
  margin-left: 5%;
  margin-bottom: 5px;
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const Card = Styled.View`
  margin-left: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: white;
  border-top-width: 5px;
  border-color: #2f95dc;
`;

const Servername = Styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const Strong = Styled.Text`
  font-weight: bold;
`;

const Online = Styled.Text`
  font-size: 15px;
  font-weight: bold;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fractionContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fractionCard: {
    flexDirection: "row",
    width: "50%",
  },
  item: {
    width: "100%",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
