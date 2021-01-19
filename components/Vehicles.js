import React, { Component, createRef } from "react";
import Colors from "../constants/Colors";
import Styled from "styled-components";
import { ReallifeAPI } from "../ApiHandler";
// Components
import { View, ScrollView, StyleSheet, Text, RefreshControl } from "react-native";
import Spinner from "../components/Spinner";
import { Modalize } from "react-native-modalize";
import NoKey from "../components/NoKey";

const reallifeRPG = new ReallifeAPI();

export default class Vehicles extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      refreshing: false,
    };
    this.modalizeRef = createRef(null);
  }

  _renderVehicleData = (vehicle) => {
    const vehiclePlate = vehicle.plate,
      formattedPlate = `${vehiclePlate.substring(0, 2)} ${vehiclePlate.substring(
        2,
        4
      )} ${vehiclePlate.substring(4, 8)}`;
    let status, fraction;
    // Vehicle status
    if (vehicle.active === 1) {
      status = <Badge style={{ backgroundColor: "#ffc107" }}>Ausgeparkt</Badge>;
    } else if (vehicle.impound === 1) {
      status = <Badge style={{ backgroundColor: "#dc3545" }}>Beschlagnahmt</Badge>;
    } else {
      status = <Badge style={{ backgroundColor: "#28a745" }}>Geparkt</Badge>;
    }
    // Fraction
    if (vehicle.side === "COP") {
      fraction = <Badge>Polizei</Badge>;
    } else if (vehicle.side === "EAST") {
      fraction = <Badge style={{ backgroundColor: "#ffc107" }}>RAC</Badge>;
    } else if (vehicle.side === "MEDIC" || vehicle.side === "GUER") {
      fraction = <Badge style={{ backgroundColor: "#dc3545" }}>Medics</Badge>;
    } else {
      fraction = <Badge style={{ backgroundColor: "#28a745" }}>Zivilisten</Badge>;
    }

    return (
      <View>
        <View style={{ ...styles.row, alignItems: "center", marginTop: 9 }}>
          <Con3 style={{ borderRightWidth: 1, borderColor: "#ededed" }}>
            <Label>Status</Label>
            {status}
          </Con3>
          <Con3 style={{ borderRightWidth: 1, borderColor: "#ededed" }}>
            <Label>Fraktion</Label>
            {fraction}
          </Con3>
          <Con3>
            <Label>Kennzeichen</Label>
            <Badge>{formattedPlate}</Badge>
          </Con3>
        </View>

        <Label style={{ marginTop: 8 }}>Tank {`${(vehicle.fuel * 100).toFixed(0)}%`}</Label>
        <FuelBar>
          <FuelProgress
            style={{
              width: `${vehicle.fuel * 100}%`,
            }}
          />
        </FuelBar>

        <Text style={{ fontWeight: "bold", textAlign: "center", marginTop: 8 }}>
          Gekauft am {vehicle.created_at}
        </Text>
      </View>
    );
  };

  _renderVehicle = (vehicle) => {
    if (vehicle.alive) {
      return (
        <Text key={vehicle.id} style={styles.item} onPress={() => this.openVehicleModal(vehicle)}>
          {vehicle.vehicle_data.name}
        </Text>
      );
    }
  };

  openVehicleModal = (vehicle) => {
    this.setState({ selectedVehicle: vehicle });
    this.modalizeRef.current?.open();
  };

  closeVehicleModal = () => this.modalizeRef.current?.close();

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
    const { loading, refreshing, vehicles, selectedVehicle } = this.state;

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
              {vehicles.map((vehicle, index) => {
                return this._renderVehicle(vehicle);
              })}
            </ScrollView>
            <Modalize ref={this.modalizeRef} adjustToContentHeight={true}>
              <View style={modal.content}>
                <Text style={modal.heading}>
                  {selectedVehicle !== undefined
                    ? selectedVehicle.vehicle_data.name.toUpperCase()
                    : null}
                </Text>
                {selectedVehicle !== undefined ? this._renderVehicleData(selectedVehicle) : null}
              </View>
            </Modalize>
          </View>
        );
      } else {
        return <NoKey />;
      }
    }
  }
}

const Con3 = Styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: ${100 / 3}%;
`;
const Label = Styled.Text`
  text-align: center;
  width: 100%;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: bold;
`;
const Badge = Styled.Text`
  text-align: center;
  padding: 4px;
  font-size: 14px;
  border-radius: 6px;
  background-color: ${Colors.tabIconSelected};
  color: white;
`;
const FuelBar = Styled.View`
  width: 100%;
  height: 25px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;
const FuelProgress = Styled.View`
  height: 100%;
  background-color: #dc3545;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  item: {
    width: "90%",
    textAlign: "center",
    marginLeft: "5%",
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ededed",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});
const modal = StyleSheet.create({
  content: {
    padding: 20,
  },
  heading: {
    marginBottom: 2,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#ccc",
  },
});
