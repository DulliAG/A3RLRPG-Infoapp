import React, { Component } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI, DateFormatter } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import { StyleSheet, View, RefreshControl } from "react-native";
import Text from "../components/CustomText";
import { Accordion } from "../components/Accordion";
import { ScrollView } from "react-native-gesture-handler";

const df = new DateFormatter();
const reallifeRPG = new ReallifeAPI();

export default class ChangelogScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
    };
  }

  _renderChanges = (heading, changes) => {
    return (
      <View
        style={{
          paddingHorizontal: "2.5%",
          paddingVertical: 4,
          marginTop: 8,
          marginHorizontal: "2.5%",
          borderWidth: 1,
          borderColor: Colors.border,
          backgroundColor: Colors.lightGray,
          borderRadius: 5,
        }}
      >
        <Text type="SemiBold" style={{ fontSize: 16 }}>
          {heading}
        </Text>
        {changes.map((change, index) => {
          return <Text key={index}>• {change}</Text>;
        })}
      </View>
    );
  };

  _renderChangelog = (changelog) => {
    var { version, release_at, change_mission, change_map, change_mod } = changelog;
    var formattedReleaseDate = df.format(release_at);
    var changelogHeading = `Update ${version} • ${formattedReleaseDate} Uhr`;

    return (
      <Accordion key={changelog.version} title={changelogHeading}>
        {change_mission.length > 0 && this._renderChanges("Mission", change_mission)}
        {change_map.length > 0 && this._renderChanges("Karte", change_map)}
        {change_mod.length > 0 && this._renderChanges("Mod", change_mod)}
      </Accordion>
    );
  };

  refresh = async () => {
    this.setState({ refreshing: true });
    const changelogs = await reallifeRPG.getChangelogs();
    this.setState({ changelogs: changelogs.data, refreshing: false });
  };

  async componentDidMount() {
    const changelogs = await reallifeRPG.getChangelogs();
    this.setState({ changelogs: changelogs.data, loading: false });
  }

  render() {
    const { loading, refreshing, changelogs } = this.state;

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
                progressBackgroundColor={Colors.refreshController}
                colors={Colors.refreshControllerIndicator}
              />
            }
          >
            {changelogs.map((changelog) => {
              return this._renderChangelog(changelog);
            })}
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
});
