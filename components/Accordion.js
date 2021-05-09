import React, { Component } from "react";
import Colors from "../constants/Colors";
// Components
import {
  View,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Text from "../components/CustomText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

class Accordion extends Component {
  constructor(props) {
    super();
    this.state = {
      expanded: props.expanded || false,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { expanded } = this.state;
    const { title, children } = this.props;

    return (
      <View>
        <TouchableOpacity style={styles.row} activeOpacity={0.9} onPress={this.toggle}>
          <Text type="SemiBold" style={styles.title}>
            {title}
          </Text>
          <MaterialCommunityIcons
            name={expanded ? "arrow-up" : "arrow-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        {expanded && <View style={styles.contentContainer}>{children}</View>}
      </View>
    );
  }
}

class ChangelogAccordion extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  _renderChange = (change) => {
    return <Text>• {change}</Text>;
  };

  toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { expanded } = this.state;
    const { title, data } = this.props;
    const { change_mission, change_map, change_mod } = data;

    return (
      <View>
        <TouchableOpacity style={styles.row} activeOpacity={0.9} onPress={this.toggle}>
          <Text type="SemiBold" style={styles.title}>
            {title}
          </Text>
          <MaterialCommunityIcons
            name={expanded ? "arrow-up" : "arrow-down"}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.contentContainer}>
            {change_mission.length >= 1 && (
              <Text type="SemiBold" style={styles.label}>
                Mission
              </Text>
            )}
            {change_mission.length >= 1 &&
              change_mission.map((change) => {
                return this._renderChange(change);
              })}

            {change_map.length >= 1 && (
              <Text type="SemiBold" style={{ ...styles.label, marginTop: 6 }}>
                Karte
              </Text>
            )}
            {change_map.length >= 1 &&
              change_map.map((change) => {
                return this._renderChange(change);
              })}

            {change_mod.length >= 1 && (
              <Text type="SemiBold" style={{ ...styles.label, marginTop: 6 }}>
                Mod
              </Text>
            )}
            {change_mod.length >= 1 &&
              change_mod.map((change) => {
                return this._renderChange(change);
              })}
          </View>
        )}
      </View>
    );
  }
}

export { Accordion };

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // height: 56,
    // paddingHorizontal: "2.5%",
    // backgroundColor: "white",
    // borderTopWidth: 0.5,
    // borderBottomWidth: 0.5,
    // borderColor: "#ededed",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    height: 50,
    paddingHorizontal: "5%",
    marginLeft: "2.5%",
    marginTop: 16,
    backgroundColor: Colors.tabIconSelected,
    borderRadius: 5,
  },
  title: {
    fontSize: 14,
    color: "white",
  },
  label: {
    fontSize: 14,
    color: "black",
  },
  contentContainer: {
    paddingTop: 8,
    backgroundColor: "white",
  },
});
