import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, ScrollView, View, StyleSheet } from 'react-native';
import { Divider, TextInput, Title, Text, Button, Switch, Subheading } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { Spinner } from '../components/spinner.component';
import { name, version } from '../package.json';
import { KeyContext } from '../context/key.context';
import { ReallifeRPGService } from '../services/realliferpg.service';
import { SnackbarContext } from '../context/snackbar.context';
import { NotificationService as NotificationServiceClass } from '../services/notification.service';

const Label: React.FC<{ label: string; value: string; redirect?: string }> = ({
  label,
  value,
  redirect,
}) => {
  return (
    <Text style={styles.fwBold}>
      {label}:{' '}
      {redirect ? (
        <Text onPress={() => Linking.openURL(redirect)}>{value}</Text>
      ) : (
        <Text>{value}</Text>
      )}
    </Text>
  );
};

export const Settings: React.FC = () => {
  const ReallifeService = new ReallifeRPGService();
  const NotificationService = new NotificationServiceClass();
  const { apiKey, setApiKey } = React.useContext(KeyContext);
  const { setSnackbar } = React.useContext(SnackbarContext);
  const [devicePushToken, setDevicePushToken] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [notificationActive, setNotificationsActive] = React.useState(true);
  const [key, setKey] = React.useState('');

  const handleSwitchChange = async () => {
    const newState = !notificationActive;
    await AsyncStorage.setItem('@pushNotifications', newState ? 'true' : 'false');
    await NotificationService.registerToken(devicePushToken, newState);

    setNotificationsActive(newState);
    setSnackbar({
      visible: true,
      label: newState ? 'Benachrichtigungen aktiviert' : 'Benachrichtigungen deaktiviert',
    });
  };

  const handleKeySave = () => {
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
    let notificationEnabled = false;
    Promise.all([
      AsyncStorage.getItem('@apiKey'),
      NotificationService.getDevicePushToken(),
      AsyncStorage.getItem('@pushNotifications'),
    ])
      .then(async ([key, deviceToken, notifications]) => {
        console.log(key, deviceToken, notifications);
        notificationEnabled = notifications === 'true' ? true : false;
        setKey(key || '');
        setDevicePushToken(deviceToken || '');
        setNotificationsActive(notificationEnabled);

        if (deviceToken) {
          await NotificationService.registerToken(deviceToken, notificationEnabled);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView>
        <View style={[styles.categoryContainer, { marginTop: 15 }]}>
          <Title>Informationen</Title>
          <Label label="Name" value={name} />
          <Label label="Version" value={'v' + version} />
          <Label label="Webseite" value="DulliAG" redirect="https://dulliag.de" />
          <Label
            label="Quellcode"
            value="GitHub"
            redirect="https://github.com/DulliAG/A3RLRPG-Infoapp"
          />
          <Divider style={styles.divider} />
        </View>

        <View style={styles.categoryContainer}>
          <Title>Benachrichtigungen</Title>
          <View style={styles.row}>
            <Switch value={notificationActive} onValueChange={handleSwitchChange} />
            <Subheading style={styles.switchLabel}>Benachrichtigungen</Subheading>
          </View>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.categoryContainer}>
          <Title>API-Schlüssel</Title>
          <TextInput
            mode="outlined"
            label="API-Schlüssel"
            defaultValue={apiKey}
            onChangeText={(text) => setKey(text)}
          />
          <Button mode="contained" style={styles.saveBtn} onPress={handleKeySave}>
            Speichern
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  fwBold: { fontWeight: 'bold' },
  categoryContainer: { margin: 10, marginTop: 0 },
  divider: { marginTop: 15 },
  row: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { marginTop: 0, marginLeft: 15 },
  saveBtn: { marginTop: 15, width: '50%', marginLeft: '50%' },
});
