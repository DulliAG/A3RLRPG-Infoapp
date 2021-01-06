import React, { Component, createRef } from "react";
import Styled from "styled-components";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import { View, ScrollView, StyleSheet, Text, Image, RefreshControl } from "react-native";
import Spinner from "../components/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";

const reallifeRPG = new ReallifeAPI();

// TODO Need to verify that CBS works fine bcause I wasn't able to secure some old data
export default class CBS extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
    this.modalizeRef = createRef(null);
  }

  _renderModalContent = (project) => {
    return (
      <View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 16,
              paddingRight: 5,
            }}
          >
            {project.title}
          </Text>
          {project.finished == 1 ? (
            <Ionicons name="ios-checkmark-circle-outline" size={24} color="black" />
          ) : (
            <Ionicons name="ios-construct" size={24} color="black" />
          )}
        </View>
        <Image
          source={{
            uri: project.image,
          }}
          style={{
            width: "90%",
            height: 100,
            marginLeft: "5%",
            borderWidth: 1,
            borderColor: "#ededed",
            borderRadius: 8,
          }}
        />
        <Text style={{ ...styles.item, marginBottom: 10 }}>{project.desc}</Text>
        <ProgressContainer>
          <ProgressBar
            style={{
              width: `${(project.amount * 100) / project.funding_required}%`,
              backgroundColor: Colors.tabIconSelected,
            }}
          />
        </ProgressContainer>
        <Text style={{ marginTop: 10, textAlign: "center", fontWeight: "bold" }}>
          {project.amount} € / {project.funding_required} €
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "90%",
            marginTop: 5,
            marginLeft: "5%",
          }}
        >
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_u.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.rock_u} / {project.required.rock_u}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_wood_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.wood_r} / {project.required.wood_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_u.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.sand_u} / {project.required.sand_u}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.rock_r} / {project.required.rock_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_clay_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.clay_r} / {project.required.clay_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_copper_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.copper_r} / {project.required.copper_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_iron_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.iron_r} / {project.required.iron_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_r.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.sand_r} / {project.required.sand_r}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_plastic.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.plastic} / {project.required.plastic}
          </Text>
          <Text style={styles.projectItem}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_steel.png`,
              }}
              style={{
                width: 20,
                height: 20,
              }}
            />
            {project.delivered.steel} / {project.required.steel}
          </Text>
        </View>
      </View>
    );
  };

  _renderCBS = (project) => {
    return (
      <Card key={project.title} onPress={() => this.openModal(project)}>
        <Image
          style={styles.projectItemq}
          source={{
            uri: project.image,
          }}
        />
        <Text style={{ textAlign: "center", fontWeight: "bold", padding: 8 }}>{project.title}</Text>
      </Card>
    );
  };

  openModal = (project) => {
    this.setState({ selectedProject: project });
    this.modalizeRef.current?.open();
  };

  closeModal = () => this.modalizeRef.current?.close();

  refresh = async () => {
    this.setState({ refreshing: true });
    const projects = await reallifeRPG.getCBS();
    this.setState({ projects: projects.data, refreshing: false });
  };

  async componentDidMount() {
    const projects = await reallifeRPG.getCBS();
    this.setState({ projects: projects.data, loading: false });
  }

  render() {
    const { loading, refreshing, projects, selectedProject } = this.state;

    if (loading && !refreshing) {
      return <Spinner size="large" />;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={true}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
          >
            {projects.length > 0 ? (
              projects.map((project, index) => {
                return this._renderCBS(project);
              })
            ) : (
              <Card style={{ marginTop: 18, padding: 20 }}>
                <Text style={{ textAlign: "center", fontWeight: "bold" }}>
                  Kein Projekt gefunden
                </Text>
              </Card>
            )}
          </ScrollView>
          <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
            <View style={modal.content}>
              <Text style={modal.heading}>
                {selectedProject !== undefined ? selectedProject.title.toUpperCase() : null}
              </Text>
              {selectedProject !== undefined ? this._renderModalContent(selectedProject) : null}
            </View>
          </Modalize>
        </View>
      );
    }
  }
}

const Card = Styled.View`
  width: 90%;
  margin-left: 5%;
  background-color: white;
  border-top-width: 5px;
  border-color: ${Colors.tabIconSelected};
  border-radius: 8px;
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

const styles = StyleSheet.create({
  item: {
    display: "flex",
    alignItems: "center",
    width: "90%",
    textAlign: "center",
    marginLeft: "5%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    backgroundColor: "#f8f9fa",
    borderColor: "#ededed",
    borderRadius: 8,
  },
  projectItem: {
    textAlign: "center",
    width: "49%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
});

const modal = StyleSheet.create({
  content: {
    padding: 20,
  },
  projectImage: {
    borderRadius: 8,
  },
  heading: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#ccc",
  },
});
