import * as React from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { Profile } from '../screens/profile.screen';
import { Banking } from '../screens/banking.screen';
import { Companies } from '../screens/company.screen';

export const ProfileNavigator: React.FC = () => {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'profile', title: 'Profil', icon: 'account-circle-outline' },
    { key: 'banking', title: 'Konten', icon: 'credit-card-outline' },
    { key: 'companies', title: 'Unternehmen', icon: 'view-list' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    profile: Profile,
    banking: Banking,
    companies: Companies,
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
