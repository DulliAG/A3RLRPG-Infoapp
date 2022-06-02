import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from 'react-native-paper';
import { INITIAL_ROUTE_NAME, ROUTES } from './routes';
import { CustomHeader } from '../components/header.component';
import { CustomDrawerContent } from '../components/drawer-content.component';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Profile } from '../services/realliferpg.service';

const Drawer = createDrawerNavigator();
export interface IDrawerProfile {
  avatar: string;
  name: string;
  pid: string;
}

const DrawerComponent: React.FC<IDrawerProfile> = ({ avatar, name, pid }) => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      initialRouteName={INITIAL_ROUTE_NAME}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />,
        drawerStyle: {
          width: '80%',
          backgroundColor: theme.colors.background,
        },
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} avatar={avatar} name={name} pid={pid} />
      )}
    >
      {ROUTES.map((route, index) => {
        return (
          <Drawer.Screen
            key={index}
            name={route.title}
            component={route.component}
            options={{
              headerShown: true,
              drawerLabel: route.title,
              // @ts-ignore
              drawerIcon: ({ focused }) => (
                <MaterialCommunityIcons
                  // @ts-ignore
                  name={route.icon}
                  size={24}
                  color={focused ? theme.colors.primary : theme.colors.placeholder}
                />
              ),
              title: route.title,
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.text,
              drawerInactiveTintColor: theme.colors.placeholder,
            }}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

export default DrawerComponent;
