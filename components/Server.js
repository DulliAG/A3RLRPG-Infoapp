import React from "react";
import { StyleSheet, View, Text, RefreshControl, ToastAndroid, Alert } from "react-native";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Layout from "../constants/Layout";
import Styled from "styled-components";
import Spinner from "../components/Spinner";

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

  refresh = () => {
    this.setState({ refreshing: true });
    this.getServer().then((serverList) => {
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
    });
  };

  getServer() {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/servers/")
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((err) => rej(err));
    });
  }

  componentDidMount() {
    this.getServer().then((serverList) => {
      this.setState({
        server: serverList.data,
        selectedServer: serverList.data[0],
        loading: false,
      });
    });
  }

  render() {
    if (this.state.loading == true || this.state.refreshing == true) {
      return <Spinner size="large" />;
    } else {
      return (
        <View>
          <ServerContainer>
            <Heading>Serverliste</Heading>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
              }
            >
              {this.state.server.map((server) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      this.setState({ selectedServer: server });
                    }}
                  >
                    <Server
                      id={server.Id}
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
          <InfoContainer style={{ marginTop: 10 }}>
            <Heading>Informationen</Heading>
            <PlayerList players={this.state.selectedServer.Players} />
          </InfoContainer>
        </View>
      );
    }
  }
}

export class Server extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    if (this.props.id <= 3) {
      return (
        <Card key={this.props.name}>
          <View>
            <Servername>{this.props.name}</Servername>
            <Online>
              Online: {this.props.online} / {this.props.slots}
            </Online>
          </View>
          <View style={styles.fractionContainer}>
            <View style={styles.fractionCard}>
              <Strong>Zivilisten: </Strong>
              <Text>{this.props.sides.civ}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>Polizei: </Strong>
              <Text>{this.props.sides.cop}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>Medic: </Strong>
              <Text>{this.props.sides.medic}</Text>
            </View>

            <View style={styles.fractionCard}>
              <Strong>RAC: </Strong>
              <Text>{this.props.sides.rac}</Text>
            </View>
          </View>
        </Card>
      );
    } else {
      return (
        <Card key={this.props.name}>
          <View>
            <Servername>{this.props.name}</Servername>
            <Online>
              Online: {this.props.online} / {this.props.slots}
            </Online>
          </View>
        </Card>
      );
    }
  }
}

export class PlayerList extends React.Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      <View>
        <ScrollView style={{ paddingHorizontal: "5%" }} showsVerticalScrollIndicator={true}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {this.props.players.length >= 1 ? (
              this.props.players.map((player) => {
                return (
                  <Text key={player} style={styles.item}>
                    {player}
                  </Text>
                );
              })
            ) : (
              <Text style={{ ...styles.item, width: "100%" }}>Keine Spieler gefunden</Text>
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
  width: ${Layout.window.width * 0.85};
  margin-left: 20px;
  padding: 15px 20px;
  border-radius: 5px;
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
    width: Layout.isSmallDevice == false ? "49%" : "100%",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "white",
    borderRadius: 8,
  },
});
