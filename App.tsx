import * as React from 'react';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { ReallifeRPGService } from './services/realliferpg.service';
import { KeyContext, KeyContextProvider } from './context/key.context';
import useCachedResources from './hooks/useCachedRessources';
import { LightTheme, DarkTheme } from './constants/Theme';
import { Spinner } from './components/spinner.component';
import Drawer, { IDrawerProfile } from './navigation/drawer.navigation';
import { SnackbarContext, SnackbarContextProvider } from './context/snackbar.context';
import { NotificationService as NotificationServiceClass } from './services/notification.service';

const App: React.FC = () => {
  const ReallifeService = new ReallifeRPGService();
  const NotificationService = new NotificationServiceClass();
  const { apiKey, setApiKey } = React.useContext(KeyContext);
  const { setSnackbar } = React.useContext(SnackbarContext);
  const [showModal, setShowModal] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState('');
  const [profile, setProfile] = React.useState<IDrawerProfile>({} as IDrawerProfile);
  const [notification, setNotification] = React.useState<Notifications.Notification>();
  const [notificationResponse, setNotificationResponse] =
    React.useState<Notifications.NotificationResponse>();
  const notificationListener = React.useRef<any>();
  const responseListener = React.useRef<any>();

  const handleModalSubmit = () => {
    ReallifeService.verifyKey(key)
      .then((result) => {
        if (result.status === 'Error') {
          setSnackbar({
            visible: true,
            label: 'Ungültiger API-Schlüssel',
          });
          return;
        }
        AsyncStorage.setItem('@apiKey', key)
          .then(() => {
            setShowModal(false);
            setApiKey(key);
            setSnackbar({
              visible: true,
              label: 'API-Schlüssel gespeichert',
            });
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        setSnackbar({
          visible: true,
          label: 'Speichern fehlgeschlagen',
        });
      });
  };

  React.useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotificationResponse(response);
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('@apiKey')
      .then(async (key) => {
        if (!key) {
          // Wenn noch ein API-Key gesetzt wurde ist davon auszugehen dass die App gerade erst installiert wurde
          // Daher wird auch gleichzeitig der DevicePushToken registriert, da Push-Benachrichtigungen by default aktiviert sind
          const token = await NotificationService.getDevicePushToken();
          if (token) {
            const registerToken = await NotificationService.registerToken(token, true);
            if (registerToken.error) throw registerToken.error;
            await AsyncStorage.setItem('@pushNotifications', true.toString());
          }

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
  }, [apiKey]);

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
      <SnackbarContextProvider>
        <KeyContextProvider>
          <App />
        </KeyContextProvider>
      </SnackbarContextProvider>
    </PaperProvider>
  );
};

export default Main;
