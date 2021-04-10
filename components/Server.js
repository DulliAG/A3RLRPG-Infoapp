import React from "react";
import { ReallifeAPI } from "../ApiHandler";
import Layout from "../constants/Layout";
import Styled from "styled-components";
// Components
import { StyleSheet, View, RefreshControl, ToastAndroid } from "react-native";
import Text from "./CustomText";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Spinner from "../components/Spinner";

const reallifeRPG = new ReallifeAPI();

const Server = (props) => {
  const { id, name, width, online, slots, sides } = props;
  if (id <= 3) {
    return (
      <Card key={name} style={{ width: width }}>
        <View>
          <Text type="Bold" style={styles.servername}>
            {name}
          </Text>
          <Text type="Bold" style={styles.online}>
            Online: {online} / {slots}
          </Text>
        </View>
        <View style={styles.fractionContainer}>
          <View style={styles.fractionCard}>
            <Text type="SemiBold">Zivilisten: </Text>
            <Text>{sides.civ}</Text>
          </View>

          <View style={styles.fractionCard}>
            <Text type="SemiBold">Polizei: </Text>
            <Text>{sides.cop}</Text>
          </View>

          <View style={styles.fractionCard}>
            <Text type="SemiBold">Medic: </Text>
            <Text>{sides.medic}</Text>
          </View>

          <View style={styles.fractionCard}>
            <Text type="SemiBold">RAC: </Text>
            <Text>{sides.rac}</Text>
          </View>
        </View>
      </Card>
    );
  } else {
    return (
      <Card key={name}>
        <View>
          <Text type="Bold" style={styles.servername}>
            {name}
          </Text>
          <Text type="SemiBold" style={styles.online}>
            Online: {online} / {slots}
          </Text>
        </View>
      </Card>
    );
  }
};

const Player = (props) => {
  const { playername } = props;
  return <Text style={styles.item}>{playername}</Text>;
};

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
    var serverList = await reallifeRPG.getServerList();
    serverList = serverList.data.filter(
      (server) => !server.Servername.toLowerCase().includes("gungame")
    );
    this.setState({ servers: serverList, selectedServer: serverList[0], refreshing: false });

    ToastAndroid.showWithGravityAndOffset(
      "Serverliste aktualisert",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      150
    );
  };

  async componentDidMount() {
    var serverList = await reallifeRPG.getServerList();
    serverList = serverList.data.filter(
      (server) => !server.Servername.toLowerCase().includes("gungame")
    );
    this.setState({ servers: serverList, selectedServer: serverList[0], loading: false });
  }

  render() {
    const { loading, refreshing, servers, selectedServer } = this.state;

    if (loading && !refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ServerContainer>
            <Text type="Bold" style={styles.heading}>
              Serverliste
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
            >
              {servers.map((server, index) => {
                var width =
                  servers.length > 1 ? Layout.window.width * 0.8 : Layout.window.width * 0.95;
                return (
                  <TouchableWithoutFeedback
                    key={index}
                    onPress={() => {
                      this.setState({ selectedServer: server });
                    }}
                  >
                    <Server
                      id={server.Id}
                      width={width}
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
            <Text type="Bold" style={styles.heading}>
              Spielerliste
            </Text>
            <PlayerList players={selectedServer.Players} />
          </InfoContainer>
        </View>
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
        <ScrollView style={{ paddingHorizontal: "2.5%" }} showsVerticalScrollIndicator={false}>
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
                return <Player key={player} playername={player} />;
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

const Card = Styled.View`
  margin-left: 10px;
  padding: 15px 20px;
  border-radius: 8px;
  background-color: white;
  border-top-width: 5px;
  border-width: 1px;
  border-top-color: #2f95dc;
  border-color: #ededed;
`;

const styles = StyleSheet.create({
  heading: {
    width: "100%",
    marginLeft: "2.5%",
    marginBottom: 5,
    fontSize: 20,
    color: "#000",
  },
  servername: {
    fontSize: 20,
    color: "#000",
  },
  online: {
    fontSize: 15,
  },
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
