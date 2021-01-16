import React, { Component } from "react";
import { ReallifeAPI } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import { StyleSheet, View, RefreshControl } from "react-native";
import { ChangelogAccordion } from "../components/Accordion";
import { ScrollView } from "react-native-gesture-handler";

const reallifeRPG = new ReallifeAPI();

export default class ChangelogScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
    };
  }
  refresh = async () => {
    this.setState({ refreshing: true });
    const changelogs = await reallifeRPG.getChangelogs();
    this.setState({ changelogs: changelogs.data, refreshing: false });
  };

  _renderAccordion = (changelog) => {
    const { version, release_at } = changelog;
    return <ChangelogAccordion title={`Update ${version} • ${release_at}`} data={changelog} />;
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
          >
            {changelogs.map((changelog) => {
              return this._renderAccordion(changelog);
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
    backgroundColor: "#f8f9fa",
  },
});
