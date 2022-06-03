import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, DataTable, List, useTheme } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { IShopType, IVehicleShopItem, ReallifeRPGService } from '../services/realliferpg.service';

export const VehicleTrader: React.FC = () => {
  const theme = useTheme();
  const ReallifeService = new ReallifeRPGService();
  const [loading, setLoading] = React.useState(true);
  const [loadingShop, setLoadingShop] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedShop, setSelectedShop] = React.useState('');
  const [selectedShopItems, setSelectedShopItems] = React.useState<IVehicleShopItem[]>([]);
  const [vehicleShops, setVehicleShops] = React.useState<IShopType[]>([]);

  const handleAccordionPress = (expandedId: string | number) => {
    setSelectedShop(expandedId.toString());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getVehicleShops()
      .then((result) => setVehicleShops(result.data))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useMemo(() => {
    setLoadingShop(true);
    ReallifeService.getVehicleShop(selectedShop)
      .then((list) => setSelectedShopItems(list.data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingShop(false));
  }, [selectedShop]);

  React.useEffect(() => {
    ReallifeService.getVehicleShops()
      .then((result) => setVehicleShops(result.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {vehicleShops.length > 0 ? (
          <List.AccordionGroup expandedId={selectedShop} onAccordionPress={handleAccordionPress}>
            {vehicleShops.map((shop, index) => (
              <List.Accordion key={index} id={shop.shoptype} title={shop.shopname}>
                <View
                  style={{
                    padding: loadingShop ? 15 : 0,
                  }}
                >
                  {loadingShop ? (
                    <ActivityIndicator animating={true} size="small" color={'blue'} />
                  ) : (
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Fahrzeug</DataTable.Title>
                        <DataTable.Title numeric>Level / Platz</DataTable.Title>
                        <DataTable.Title numeric>Preis</DataTable.Title>
                      </DataTable.Header>

                      {selectedShopItems.map((item, index) => (
                        <DataTable.Row key={index}>
                          <DataTable.Cell>{item.name}</DataTable.Cell>
                          <DataTable.Cell numeric>
                            {item.level} {item.v_space} Kg.
                          </DataTable.Cell>
                          <DataTable.Cell numeric>{item.price} €</DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  )}
                </View>
              </List.Accordion>
            ))}
          </List.AccordionGroup>
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
