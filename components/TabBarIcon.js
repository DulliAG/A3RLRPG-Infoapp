import * as React from "react";
import Colors from "../constants/Colors";
// Components
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabBarIcon(props) {
  return (
    <MaterialCommunityIcons
      name={props.name}
      size={28}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
