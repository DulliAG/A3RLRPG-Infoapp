import React, { Component } from "react";
import { Text } from "react-native";

export default class CustomText extends Component {
  setFontType = (type) => {
    return `OpenSans-${type}`;
  };
  render() {
    const { type, style, children } = this.props;

    const font = this.setFontType(type ? type : "Regular");
    const componentStyle = [{ fontFamily: font }, style || {}];
    const allProps = Object.assign({}, this.props, { style: componentStyle });
    return <Text {...allProps}>{children}</Text>;
  }
}
