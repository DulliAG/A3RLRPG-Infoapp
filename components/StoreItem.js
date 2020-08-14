import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Styled from "styled-components";
import Accordion from "react-native-collapsible/Accordion";

export class Store extends React.Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      building: false,
      active: [],
      multiple: props.multiple,
      category: props.category,
      content: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.get()
      .then((value) => {
        this.setState({ content: value });
      })
      .then(() => {
        // console.log(this.state.content);
        var temp = [];
        for (const key in this.state.content) {
          const shop = this.state.content[key];
          this.getItems(shop.shoptype)
            .then((items) => {
              temp.push({
                shopname: shop.shopname,
                shoptype: shop.shoptype,
                items: items.data,
              });
            })
            .then(() => {
              /**
               * We're gonna update the loading-status in itemBody bcause
               * this is the part which takes the longest to resolve
               */
              this.setState({ content: temp, loading: false });
            })
            .catch((err) => console.error(err));
        }
      })
      .catch((err) => console.error(err));
  }

  get() {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/info/" + this.state.category + "_shoptypes")
        .then((response) => response.json())
        .then((response) => res(response.data))
        .catch((error) => rej(error));
    });
  }

  getItems(shop) {
    return new Promise((res, rej) => {
      fetch("https://api.realliferpg.de/v1/info/" + this.state.category + "/" + shop)
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((error) => rej(error));
    });
  }

  itemHeader = (section, _, isActive) => {
    return (
      <View style={[styles.header, isActive ? styles.active : styles.inactive]}>
        <Text style={styles.headerText}>{section.shopname}</Text>
      </View>
    );
  };

  itemBody = (section, _, isActive) => {
    /*
    <View style={[styles.content, isActive ? styles.active : styles.inactive]}>
      {section.items.map((item, index) => {
        return <Text styles={styles.bodyText}>{item.name}</Text>;
      })}
    </View>
    */

    return (
      <View style={[styles.content, isActive ? styles.active : styles.inactive]}>
        {section.items.map((item, index) => {
          return (
            <Row>
              <Info>
                <Row>
                  <Strong>{item.name}</Strong>
                </Row>
                <Row>
                  <Text>Lager, Level</Text>
                </Row>
              </Info>
              <PriceContainer>
                <Price>{item.price} €</Price>
              </PriceContainer>
            </Row>
          );
        })}
      </View>
    );
  };

  setSections = (sections) => {
    this.setState({ active: sections.includes(undefined) ? [] : sections });
  };

  render() {
    if (this.state.loading == true) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2f95dc" />
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.Tab} horizontal={false} showVerticalScrollIndicator={true}>
          <Accordion
            key={this.state.category}
            activeSections={this.state.active}
            sections={this.state.content}
            touchableComponent={TouchableOpacity}
            expandMultiple={this.state.multiple}
            renderHeader={this.itemHeader}
            renderContent={this.itemBody}
            onChange={this.setSections}
          />
        </ScrollView>
      );
    }
  }
}

const Row = Styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: red;
`;

const Info = Styled.View`
  flex-direction: row;
  align-items: center;
  width: 60%;
`;

const Strong = Styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const PriceContainer = Styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 40%;
`;

const Price = Styled.Text`
  font-weight: bold;
  font-size: 18px;
`;

const styles = StyleSheet.create({
  Tab: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 10,
    borderBottomWidth: 0,
  },
  content: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomColor: "#ededed",
    borderBottomWidth: 1,
  },
  active: {
    backgroundColor: "#fff",
    borderBottomWidth: 0,
  },
  inactive: {
    borderBottomColor: "#ededed",
    borderBottomWidth: 1,
  },
  headerText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
  },
});
