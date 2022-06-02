import * as React from 'react';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Appbar, useTheme } from 'react-native-paper';

export const CustomHeader: React.FC<DrawerHeaderProps> = ({ navigation, route }) => {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
      <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  );
};
