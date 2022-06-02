import * as React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { VehicleTrader } from '../screens/vehicle-trader.screen';
import { ItemTrader } from '../screens/item-trader.screen';

export const TraderNavigator: React.FC = () => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'vehicles', title: 'Fahrzeuge', icon: 'car' },
    { key: 'items', title: 'Items', icon: 'toolbox' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    vehicles: VehicleTrader,
    items: ItemTrader,
  });
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      shifting={true}
      onIndexChange={setIndex}
      renderScene={renderScene}
      style={{ backgroundColor: theme.colors.primary }}
      barStyle={{ backgroundColor: theme.colors.primary }}
    />
  );
};
