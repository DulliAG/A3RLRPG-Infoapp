import React, { FC, useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { View, Text, Pressable } from 'react-native';
import { getNativePushToken, registerForPushNotificationsAsync } from '../App';

export const Demo: FC = (props: any) => {
  const [nativePushToken, setNativePushToken] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    // getNativePushToken()
    //   .then(async (token) => {
    //     if (token) {
    //       setNativePushToken(token);
    //       await Clipboard.setStringAsync(token);
    //     } else {
    //       setNativePushToken('no native token');
    //     }
    //   })
    //   .catch((err) => {
    //     setNativePushToken(err);
    //     console.log(err);
    //   });
    // registerForPushNotificationsAsync()
    //   .then(async (token) => {
    //     if (token) {
    //       setExpoPushToken(token);
    //       // await Clipboard.setStringAsync(token);
    //     } else {
    //       setExpoPushToken('no native token');
    //     }
    //   })
    //   .catch((err) => {
    //     setExpoPushToken(err);
    //     console.log(err);
    //   });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to our Home Screen</Text>
      <Text>Checkout screens from the tab below</Text>
      <Pressable
        onPress={() => props.navigation.openDrawer()}
        style={{ padding: 10, marginBottom: 10, marginTop: 10 }}
      >
        <Text>Open Drawer</Text>
      </Pressable>
      <Text>{nativePushToken}</Text>
      <Text>{expoPushToken}</Text>
    </View>
  );
};
