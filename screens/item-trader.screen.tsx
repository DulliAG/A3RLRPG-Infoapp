import * as React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, DataTable, List, useTheme } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { ScrollLayout } from '../components/scroll-view.component';
import { Spinner } from '../components/spinner.component';
import { IItemShopItem, IShopType, ReallifeRPGService } from '../services/realliferpg.service';

export const ItemTrader: React.FC = () => {
  const theme = useTheme();
  const ReallifeService = new ReallifeRPGService();
  const [loading, setLoading] = React.useState(true);
  const [loadingShop, setLoadingShop] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedShop, setSelectedShop] = React.useState('');
  const [selectedShopItems, setSelectedShopItems] = React.useState<IItemShopItem[]>([]);
  const [itemShops, setItemShops] = React.useState<IShopType[]>([]);

  const handleAccordionPress = (expandedId: string | number) => {
    setSelectedShop(expandedId.toString());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getItemShops()
      .then((result) => setItemShops(result.data))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useMemo(() => {
    setLoadingShop(true);
    ReallifeService.getItemShop(selectedShop)
      .then((list) => setSelectedShopItems(list.data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingShop(false));
  }, [selectedShop]);

  React.useEffect(() => {
    ReallifeService.getItemShops()
      .then((result) => setItemShops(result.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  // FIXME: Performance muss beim render der Tabelle verbessert werden
  return (
    <Layout>
      <ScrollLayout refreshing={refreshing} handleRefresh={handleRefresh}>
        {itemShops.length > 0 ? (
          <List.AccordionGroup expandedId={selectedShop} onAccordionPress={handleAccordionPress}>
            {itemShops.map((shop, index) => (
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
                        <DataTable.Title>Item</DataTable.Title>
                        <DataTable.Title numeric>Level</DataTable.Title>
                        <DataTable.Title numeric>Preis</DataTable.Title>
                      </DataTable.Header>

                      {selectedShopItems.map((item, index) => (
                        <DataTable.Row key={index}>
                          <DataTable.Cell>{item.name}</DataTable.Cell>
                          <DataTable.Cell numeric>{item.level}</DataTable.Cell>
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
      </ScrollLayout>
    </Layout>
  );
};
