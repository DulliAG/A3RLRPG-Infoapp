import * as Linking from "expo-linking";

/**
 * I don't have any clue why do we have this file :o
 */

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    Root: {
      path: "root",
      screens: {
        Home: "home",
        Links: "links",
      },
    },
  },
};
