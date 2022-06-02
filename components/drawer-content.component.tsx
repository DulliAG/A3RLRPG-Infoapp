import * as React from 'react';
import { DrawerContentComponentProps, DrawerItemList } from '@react-navigation/drawer';
import { useTheme, Title, Caption, Drawer } from 'react-native-paper';
import { ImageBackground, View, Image } from 'react-native';

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  avatar: string;
  name: string;
  pid: string;
}

export const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const theme = useTheme();
  return (
    <>
      <View style={{ width: '100%', minHeight: 150, height: '20%' }}>
        <ImageBackground
          source={require('../assets/rl_banner.png')}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.colors.backdrop,
              paddingTop: '7.5%',
            }}
          >
            <Image
              source={{
                uri: props.avatar,
              }}
              style={{ width: 75, height: 75, marginLeft: 10, borderRadius: theme.roundness }}
            />
            <View
              style={{
                marginLeft: 8,
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Title style={{ marginBottom: 0 }}>{props.name || 'Max Mustermann'}</Title>
              <Caption style={{ marginTop: 0 }}>{props.pid || '1234567890'}</Caption>
            </View>
          </View>
        </ImageBackground>
      </View>
      <Drawer.Section title="Navigation">
        <DrawerItemList {...props} />
      </Drawer.Section>
    </>
  );
};
