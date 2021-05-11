import React from "react";
import { Image } from "react-native";

const ArmaItemIcon = (props) => {
  const { item, width = 50, height = 50 } = props;

  return (
    <Image
      style={{ width: width, height: height }}
      source={{ uri: `https://files.dulliag.de/app/rlrpg_items/market_${item}.png` }}
    />
  );
};

export { ArmaItemIcon };
