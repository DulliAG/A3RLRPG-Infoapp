import React, { Component } from "react";
import Colors from "../constants/Colors";
import { ReallifeAPI } from "../ApiHandler";
// Components
import Spinner from "../components/Spinner";
import NoKey from "../components/NoKey";
import { View, ScrollView, StyleSheet, Text, RefreshControl } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const reallifeRPG = new ReallifeAPI();

/**
 *
 * @param {object} props
 */
const Badge = (props) => {
  const { text, backgroundColor } = props;
  return (
    <Text style={{ ...badge.container, ...badge.text, backgroundColor: backgroundColor }}>
      {text}
    </Text>
  );
};

/**
 *
 * @param {object} props
 */
const FuelBar = (props) => {
  const { fuelLevel } = props;
  var radius = fuelLevel == 100 ? 8 : 0;
  return (
    <View style={fuelBar.container}>
      <View
        style={{
          ...fuelBar.bar,
          width: fuelLevel,
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
        }}
      />
    </View>
  );
};

export default class VehicleScreen extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
  }
  _renderRow(vehicle) {
    var icon, status, name, side, plate, formattedPlate, driven, fuel;

    plate = vehicle.plate;
    formattedPlate = `${plate.substring(0, 2)} ${plate.substring(2, 4)} ${plate.substring(4, 8)}`;

    name = vehicle.vehicle_data.name;
    driven = vehicle.kilometer_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    fuel = vehicle.fuel * 100;

    if (vehicle.type === "Ship") {
      icon = "ship-wheel";
    } else if (vehicle.type === "Air") {
      icon = "airplane";
    } else {
      icon = "car-pickup";
    }

    if (vehicle.active === 1) {
      status = <Badge text="Ausgeparkt" backgroundColor="#ffc107" />;
    } else if (vehicle.impound === 1) {
      status = <Badge text="Beschlagnahmt" backgroundColor="#dc3545" />;
    } else {
      status = <Badge text="Geparkt" backgroundColor="#28a745" />;
    }

    if (vehicle.side === "COP") {
      side = <Badge text="Polizei" backgroundColor="#1a83ff" />;
    } else if (vehicle.side === "EAST") {
      side = <Badge text="RAC" backgroundColor={Colors.warningBackground} />;
    } else if (vehicle.side === "MEDIC" || vehicle.side === "GUER") {
      side = <Badge text="Abramier" backgroundColor="#dc3545" />;
    } else {
      side = <Badge text="Zivilist" backgroundColor="#28a745" />;
    }

    if (vehicle.alive === 1) {
      return (
        <ScrollView
          key={vehicle.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.table}
        >
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <MaterialCommunityIcons name={icon} size={24} color="#000" />
            </View>
            <View style={styles.tableCell}>{status}</View>
            <View style={styles.tableCell}>{side}</View>
            <View style={styles.tableCell}>
              <Text style={styles.vehicleName}>{name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Badge text={formattedPlate} backgroundColor={Colors.tabIconSelected} />
            </View>
            <View style={styles.tableCell}>
              <Text>{driven} Km</Text>
            </View>
            <View style={styles.tableCell}>
              <FuelBar fuelLevel={fuel} />
            </View>
          </View>
        </ScrollView>
      );
    }
  }

  refresh = async () => {
    this.setState({ refreshing: true });
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const vehicles = await reallifeRPG.getPlayerVehicles(apiKey);
      this.setState({ vehicles: vehicles.data, refreshing: false });
    } else {
      this.setState({ vehicles: null, refreshing: false });
    }
  };

  async componentDidMount() {
    const apiKey = await reallifeRPG.getApiKey();
    if (apiKey !== null) {
      const vehicles = await reallifeRPG.getPlayerVehicles(apiKey);
      this.setState({ vehicles: vehicles.data, loading: false });
    } else {
      this.setState({ vehicles: null, loading: false });
    }
  }

  render() {
    const { loading, refreshing, vehicles } = this.state;

    if (loading || refreshing) {
      return <Spinner size="large" />;
    } else {
      // If vehicles equals null the key wasn't set
      if (vehicles !== null) {
        return (
          <View style={styles.container}>
            <ScrollView
              horizontal={false}
              showsVerticalScrollIndicator={true}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={this.refresh} />}
              style={styles.container}
            >
              {vehicles.map((vehicle) => {
                return this._renderRow(vehicle);
              })}
            </ScrollView>
          </View>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    backgroundColor: "yellow",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ededed",
    backgroundColor: "white",
  },
  tableCell: { marginHorizontal: 8 },
  vehicleName: {
    fontWeight: "bold",
    fontSize: 14,
  },
});
const badge = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: "#fff",
  },
});
const fuelBar = StyleSheet.create({
  container: { width: 100, height: 25, backgroundColor: "#f8f9fa", borderRadius: 8 },
  bar: {
    height: "100%",
    backgroundColor: "#dc3545",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
});
