import React from "react";
import Colors from "../constants/Colors";
// Components
import styled from "styled-components";
import { View, StyleSheet, Image } from "react-native";
import Text from "./CustomText";
import { Accordion } from "../components/Accordion";
import { ArmaItemIcon } from "../components/ArmaItem";

const Item = (props) => {
  return (
    <Text style={styles.material}>
      <ArmaItemIcon item={props.item} width={20} height={20} />
      {props.delivered} / {props.required}
    </Text>
  );
};

const CommunityProject = (props) => {
  const { project, expanded } = props;
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
  let fundingProgress = parseInt((project.amount * 100) / project.funding_required).toFixed(0);
  let itemList = [
    "rock_u",
    "wood_r",
    "sand_u",
    "rock_r",
    "clay_r",
    "copper_r",
    "iron_r",
    "sand_r",
    "plastic",
    "steel",
  ];
  return (
    <Accordion title={project.title} expanded={expanded}>
      <View style={{ marginHorizontal: "2.5%" }}>
        <Image
          source={{ uri: project.image }}
          style={{
            width: "100%",
            height: 120,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: Colors.border,
          }}
        />
      </View>
      <View
        style={{
          marginTop: 8,
          marginHorizontal: "2.5%",
          padding: 16,
          backgroundColor: Colors.lightGray,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 5,
        }}
      >
        <Text>{project.desc}</Text>
      </View>
      <View
        style={{
          marginTop: 8,
          marginHorizontal: "2.5%",
          padding: 16,
          backgroundColor: Colors.lightGray,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 5,
        }}
      >
        <ProgressContainer>
          <ProgressBar
            style={{
              width: fundingProgress + "%",
              backgroundColor: Colors.tabIconSelected,
            }}
          />
        </ProgressContainer>
        <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
          <Text>{project.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</Text>
          <Text>{fundingProgress} %</Text>
          <Text>{project.funding_required.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 8,
          marginHorizontal: "2.5%",
          padding: 16,
          backgroundColor: Colors.lightGray,
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: 5,
        }}
      >
        {itemList.map((item, index) => {
          return (
            <Item
              key={index}
              item={item}
              delivered={project.delivered[item]}
              required={project.delivered[item]}
            />
          );
        })}
      </View>
    </Accordion>
  );
};

const NoProjects = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.projectName}>Kein Projekt gefunden</Text>
    </View>
  );
};

export { CommunityProject, NoProjects };

const ProgressContainer = styled.View`
  width: 100%;
  height: 25px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: ${Colors.border};
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
  materialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 5,
    backgroundColor: "yellow",
  },
  material: {
    // textAlign: "center",
    // width: "49%",
    // paddingHorizontal: 20,
    // paddingVertical: 8,
    // marginBottom: 5,
    // borderWidth: 1,
    // borderColor: Colors.border,
    // backgroundColor: "red",
    // borderRadius: 8,
    width: "50%",
    paddingVertical: 4,
    textAlign: "center",
  },
});
