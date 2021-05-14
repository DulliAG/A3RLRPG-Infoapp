import React, { Component } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import { CommunityProject, NoProjects } from "../components/CBS";
import { View, StyleSheet, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const reallifeRPG = new ReallifeAPI();

export default class CBSScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      selected: null,
    };
  }

  async refresh() {
    this.setState({ refreshing: true });
    const projects = await reallifeRPG.getCBS();
    this.setState({ refreshing: false, projects: projects.data });
  }

  async componentDidMount() {
    const projects = await reallifeRPG.getCBS();
    this.setState({ loading: false, projects: projects.data });
  }

  render() {
    const { loading, refreshing, projects } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.refresh}
                progressBackgroundColor={Colors.refreshController}
                colors={Colors.refreshControllerIndicator}
              />
            }
          >
            {projects.length > 0 ? (
              projects.map((project, index) => {
                return <CommunityProject key={index} project={project} expanded={index == 0} />;
              })
            ) : (
              <NoProjects />
            )}
          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
