import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { List, ProgressBar, Text, useTheme } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/KeyContext';
import { MVehicle, ReallifeRPGService } from '../services/realliferpg.service';

const Fuel: React.FC<{ fuel: number }> = ({ fuel }) => {
  const theme = useTheme();
  return (
    <ProgressBar
      progress={fuel}
      style={{ marginTop: 5, height: 25, borderRadius: theme.roundness }}
    />
  );
};

const VehicleStats: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <View style={{ width: '50%', marginTop: 15 }}>
      <Text style={{ fontWeight: 'bold' }}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
};

export const Garage: React.FC = () => {
  const theme = useTheme();
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [garage, setGarage] = React.useState<MVehicle.IList>({} as MVehicle.IList);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getGarage()
      .then((list) => setGarage(list))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getGarage()
      .then((list) => {
        list.data = list.data.filter((vehicle) => vehicle.alive !== -1);
        setGarage(list);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {garage?.data.length > 0 ? (
          <List.AccordionGroup>
            {garage?.data.map((vehicle, index) => {
              let icon = '',
                side = '',
                status = '';
              switch (vehicle.type) {
                case 'Ship':
                  icon = 'ship-wheel';
                  break;
                case 'Air':
                  icon = 'airplane';
                  break;
                default:
                  icon = 'car-pickup';
                  break;
              }

              switch (vehicle.side) {
                case 'COP':
                  side = 'Polizei';
                  break;
                case 'EAST':
                  side = 'RAC';
                  break;
                case 'MEDIC':
                case 'GUER':
                  side = 'Mediziner';
                  break;
                default:
                  side = 'Zivilisten';
                  break;
              }

              if (vehicle.active) {
                status = 'Ausgeparkt';
              } else if (vehicle.impound) {
                status = 'Beschlagnahmt';
              } else {
                status = 'Geparkt';
              }
              return (
                <List.Accordion
                  key={index}
                  id={vehicle.id}
                  title={vehicle.vehicle_data.name}
                  // left={(props) => <List.Icon {...props} icon={icon} />}
                >
                  <View
                    style={{
                      padding: 15,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    }}
                  >
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                      }}
                    >
                      <VehicleStats label="Fraktion" value={side} />
                      <VehicleStats label="Status" value={status} />
                      <VehicleStats label="Kennzeichen" value={vehicle.plate} />
                      <VehicleStats
                        label="Kilometerstand"
                        value={`${vehicle.kilometer_total} Kilometer`}
                      />
                    </View>

                    <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Tank</Text>
                    <Fuel fuel={Number(vehicle.fuel)} />
                  </View>
                </List.Accordion>
              );
            })}
          </List.AccordionGroup>
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
