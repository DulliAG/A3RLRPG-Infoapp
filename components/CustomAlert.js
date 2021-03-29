import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "./CustomText";

const CustomAlert = (props) => {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: props.bg,
    },
    msg: {
      textAlign: "center",
      padding: 10,
      color: "white",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.msg}>{props.msg}</Text>
    </View>
  );
};

export default CustomAlert;
