import * as React from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import {
  Provider as PaperProvider,
  Portal,
  Dialog,
  Button,
  TextInput,
  Snackbar,
} from 'react-native-paper';
import { Profile, ReallifeRPGService } from './services/realliferpg.service';
import { KeyContext, KeyContextProvider } from './context/KeyContext';
import useCachedResources from './hooks/useCachedRessources';
import { LightTheme, DarkTheme } from './constants/Theme';
import { Spinner } from './components/spinner.component';
import Drawer, { IDrawerProfile } from './navigation/drawer.navigation';

const App: React.FC = () => {
  const ReallifeService = new ReallifeRPGService();
  const { setApiKey } = React.useContext(KeyContext);
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [snackbar, setSnackbar] = React.useState<{
    show: boolean;
    text: string;
    action?: { label: string; onPress: () => void };
  }>({ show: false, text: 'placeholder' });
  const [key, setKey] = React.useState('');
  const [profile, setProfile] = React.useState<IDrawerProfile>({} as IDrawerProfile);
  // const [notification, setNotification] = React.useState<any>(false);
  // const notificationListener = React.useRef<any>();
  // const responseListener = React.useRef<any>();

  const handleModalSubmit = () => {
    ReallifeService.verifyKey(key)
      .then((result) => {
        if (result.status === 'Error') {
          setSnackbar((prev) => {
            return {
              ...prev,
              show: true,
              text: 'Ungültiger API-Schlüssel',
            };
          });
          return;
        }
        AsyncStorage.setItem('@apiKey', key)
          .then(() => {
            setShowModal(false);
            // setApiKey(key);
            setSnackbar((prev) => {
              return {
                ...prev,
                show: true,
                text: 'API-Schlüssel gespeichert',
              };
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        setSnackbar((prev) => {
          return {
            ...prev,
            show: true,
            text: 'Speichern fehlgeschlagen',
          };
        });
      });
  };

  // React.useEffect(() => {
  //   // getNativePushToken()
  //   //   .then((token) => console.log(token))
  //   //   .catch((err) => alert(err));

  //   // This listener is fired whenever a notification is received while the app is foregrounded
  //   notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
  //     setNotification(notification);
  //   });

  //   // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('@apiKey')
      .then((key) => {
        if (!key) {
          setShowModal(true);
          setProfile({
            avatar: 'https://files.dulliag.de/share/arma3_x64_HZPy6Cnudh.png',
            name: 'Max Mustermann',
            pid: '1234567890',
          });
          setLoading(false);
        } else {
          new ReallifeRPGService(key)
            .getProfile()
            .then((result) => {
              const data = result.data[0];
              setProfile({ avatar: data.avatar_full, name: data.name, pid: data.pid });
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
          setApiKey(key);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  if (loading) return <Spinner />;
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Drawer {...profile} />

      <Portal>
        <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
          <Dialog.Title>Einstellungen</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="API-Schlüssel"
              onChangeText={(text) => setKey(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleModalSubmit}>Speichern</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbar.show}
        onDismiss={() =>
          setSnackbar((prev) => {
            return {
              ...prev,
              show: false,
            };
          })
        }
        {...snackbar.action}
      >
        {snackbar.text}
      </Snackbar>
    </NavigationContainer>
  );
};

const Main: React.FC = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) return null;
  return (
    // @ts-expect-error
    <PaperProvider theme={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <KeyContextProvider>
        <App />
      </KeyContextProvider>
    </PaperProvider>
  );
};

export default Main;

// FIXME: Move this to the notification.service.ts
// TODO: Register for push-notifications
// export async function registerForPushNotificationsAsync() {
//   let token = '';
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     // console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

// export async function getNativePushToken() {
//   let token = '';
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getDevicePushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }
