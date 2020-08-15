import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default class Spinner extends React.Component {
  constructor(props) {
    super();
    this.state = {
      size: props.size,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={this.state.size} color={Colors.tabIconSelected} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
