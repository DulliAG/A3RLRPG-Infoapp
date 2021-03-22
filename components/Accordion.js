import React, { Component } from "react";
// Components
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
          <Text style={styles.title}>{title}</Text>
          <MaterialCommunityIcons
            name={expanded ? "arrow-up-circle-outline" : "arrow-down-circle-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.contentContainer}>
            {change_mission.length >= 1 && <Text style={styles.label}>Mission</Text>}
            {change_mission.length >= 1 &&
              change_mission.map((change) => {
                return this._renderChange(change);
              })}

            {change_map.length >= 1 && <Text style={{ ...styles.label, marginTop: 6 }}>Karte</Text>}
            {change_map.length >= 1 &&
              change_map.map((change) => {
                return this._renderChange(change);
              })}

            {change_mod.length >= 1 && <Text style={{ ...styles.label, marginTop: 6 }}>Mod</Text>}
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

export { ChangelogAccordion };

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    paddingHorizontal: "5%",
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#ededed",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: "5%",
    backgroundColor: "#f8f9fa",
  },
});
