import React from "react";
import Colors from "../constants/Colors";
// Components
import styled from "styled-components";
import { View, StyleSheet, Image } from "react-native";
import Text from "./CustomText";
import { ArmaItemIcon } from "../components/ArmaItem";

const CommunityProject = (props) => {
  const project = props.project;
  // We won't use the original image-height because it would be to big for mobile devices
  // var img = {
  //   width: 0,
  //   height: 0,
  // };
  // Image.getSize(
  //   project.image,
  //   (width, height) => {
  //     img = { width: width, height: height };
  //   },
  //   (err) => console.error(err)
  // );
  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: project.image,
        }}
        style={{
          width: "100%",
          height: 120,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      />
      <Text type="SemiBold" style={styles.projectName}>
        {project.title}
      </Text>
    </View>
  );
};

const ProjectModal = (props) => {
  const project = props.project;

  const Item = (props) => {
    return (
      <Text style={styles.material}>
        <ArmaItemIcon item={props.item} width={20} height={20} />
        {props.delivered} / {props.required}
      </Text>
    );
  };

  return (
    <View>
      <Image
        source={{
          uri: project.image,
        }}
        style={styles.modalImage}
      />
      <Text style={{ ...styles.item, marginBottom: 10 }}>{project.desc}</Text>

      <Text type="SemiBold" style={styles.modalLabel}>
        Gesammelt {project.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} € von{" "}
        {project.funding_required.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €
      </Text>
      <ProgressContainer>
        <ProgressBar
          style={{
            width: `${(project.amount * 100) / project.funding_required}%`,
            backgroundColor: Colors.tabIconSelected,
          }}
        />
      </ProgressContainer>

      <Text type="SemiBold" style={styles.modalLabel}>
        Gesammelte Materialien
      </Text>
      <View style={styles.materialRow}>
        <Item
          item="rock_u"
          delivered={project.delivered.rock_u}
          required={project.delivered.rock_u}
        />

        <Item
          item="wood_r"
          delivered={project.delivered.wood_r}
          required={project.delivered.wood_r}
        />

        <Item
          item="sand_u"
          delivered={project.delivered.sand_u}
          required={project.delivered.sand_u}
        />

        <Item
          item="rock_r"
          delivered={project.delivered.rock_r}
          required={project.delivered.rock_r}
        />

        <Item
          item="clay_r"
          delivered={project.delivered.clay_r}
          required={project.delivered.clay_r}
        />

        <Item
          item="copper_r"
          delivered={project.delivered.copper_r}
          required={project.delivered.copper_r}
        />

        <Item
          item="iron_r"
          delivered={project.delivered.iron_r}
          required={project.delivered.iron_r}
        />

        <Item
          item="sand_r"
          delivered={project.delivered.sand_r}
          required={project.delivered.sand_r}
        />

        <Item
          item="plastic"
          delivered={project.delivered.plastic}
          required={project.delivered.plastic}
        />

        <Item item="steel" delivered={project.delivered.steel} required={project.delivered.steel} />
      </View>
    </View>
  );
};

const NoProjects = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.projectName}>Kein Projekt gefunden</Text>
    </View>
  );
};

export { CommunityProject, ProjectModal, NoProjects };

const ProgressContainer = styled.View`
  width: 100%;
  height: 25px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: #ededed;
`;
const ProgressBar = styled.View`
  height: 100%;
  border-radius: 5px;
`;

const styles = StyleSheet.create({
  card: {
    width: "95%",
    marginTop: 16,
    marginLeft: "2.5%",
    borderRadius: 8,
    borderTopWidth: 5,
    borderTopColor: Colors.tabIconSelected,
    backgroundColor: "white",
  },
  projectName: {
    textAlign: "center",
    padding: 16,
    fontSize: 16,
    color: "black",
  },
  modalImage: {
    width: "100%",
    height: 120,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  modalLabel: {
    marginTop: 8,
  },
  materialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
  },
  material: {
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
