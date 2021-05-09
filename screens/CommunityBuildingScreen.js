import React, { createRef } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import { CommunityProject, ProjectModal, NoProjects } from "../components/CBS";
import { View, StyleSheet, Text, RefreshControl } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";

const reallifeRPG = new ReallifeAPI();

export default class CBSScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
      selected: null,
    };
    this.modalizeRef = createRef(null);
  }

  openModal = (project) => {
    this.setState({ selected: project });
    this.modalizeRef.current?.open();
  };

  closeModal = () => this.modalizeRef.current?.close();

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
    const { loading, refreshing, projects, selected } = this.state;

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
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.9}
                    onPress={() => this.openModal(project)}
                  >
                    <CommunityProject project={project} />
                  </TouchableOpacity>
                );
              })
            ) : (
              <NoProjects />
            )}
          </ScrollView>
          <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
            <View style={modal.content}>
              <Text style={modal.heading}>{selected !== null && selected.title.toUpperCase()}</Text>
              {selected !== null && <ProjectModal project={selected} />}
            </View>
          </Modalize>
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
});
