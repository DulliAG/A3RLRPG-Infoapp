import React from "react";
import Colors from "../constants/Colors";
// Components
import styled from "styled-components";
import { View, StyleSheet, Text, Image } from "react-native";

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
      <Text style={styles.projectName}>{project.title}</Text>
    </View>
  );
};

const ProjectModal = (props) => {
  const project = props.project;
  return (
    <View>
      <Image
        source={{
          uri: project.image,
        }}
        style={styles.modalImage}
      />
      <Text style={{ ...styles.item, marginBottom: 10 }}>{project.desc}</Text>

      <Text style={styles.modalLabel}>
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

      <Text style={styles.modalLabel}>Gesammelte Materialien</Text>
      <View style={styles.materialRow}>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_u.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.rock_u} / {project.required.rock_u}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_wood_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.wood_r} / {project.required.wood_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_u.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.sand_u} / {project.required.sand_u}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_rock_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.rock_r} / {project.required.rock_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_clay_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.clay_r} / {project.required.clay_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_copper_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.copper_r} / {project.required.copper_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_iron_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.iron_r} / {project.required.iron_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_sand_r.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.sand_r} / {project.required.sand_r}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_plastic.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.plastic} / {project.required.plastic}
        </Text>
        <Text style={styles.material}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/A3ReallifeRPG/RealLifeRPG-App/master/app/src/main/res/drawable/market_steel.png`,
            }}
            style={styles.itemIcon}
          />
          {project.delivered.steel} / {project.required.steel}
        </Text>
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
  itemIcon: {
    width: 20,
    height: 20,
  },
});
