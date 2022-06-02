import * as React from 'react';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, View } from 'react-native';
import { Divider, TextInput, Title, Text, Button, Snackbar } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { ScrollLayout } from '../components/scroll-view.component';
import { Spinner } from '../components/spinner.component';
import { name, version } from '../package.json';
import { KeyContext } from '../context/KeyContext';
// import { getNativePushToken } from '../App';

const Label: React.FC<{ label: string; value: string; redirect?: string }> = ({
  label,
  value,
  redirect,
}) => {
  return (
    <Text style={{ fontWeight: 'bold' }}>
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
  const { apiKey } = React.useContext(KeyContext);
  // const [nativePushToken, setNativePushToken] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [key, setKey] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    show: boolean;
    text: string;
    action?: { label: string; onPress: () => void };
  }>({ show: false, text: 'placeholder' });

  const handleSave = () => {
    AsyncStorage.setItem('@apiKey', key)
      .then(() => {
        setSnackbar((prev) => {
          return {
            ...prev,
            show: true,
            text: 'API-Schlüssel gespeichert',
          };
        });
      })
      .catch((err) => {
        console.log(err);
        setSnackbar((prev) => {
          return {
            ...prev,
            show: true,
            text: 'Speichern fehlgeschlagen',
            action: {
              label: 'Erneut',
              onPress: handleSave,
            },
          };
        });
      });
  };

  const getApiKey = async () => {
    const key = await AsyncStorage.getItem('@apiKey');
    setKey(key || '');
  };

  React.useEffect(() => {
    getApiKey()
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

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
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollLayout>
        <View style={{ margin: 15 }}>
          <Title>Informationen</Title>
          <Label label="Name" value={name} />
          <Label label="Version" value={'v' + version} />
          <Label label="Webseite" value="DulliAG" redirect="https://dulliag.de" />
          <Label
            label="Quellcode"
            value="GitHub"
            redirect="https://github.com/DulliAG/A3RLRPG-Infoapp"
          />
          <Divider style={{ marginTop: 15 }} />
        </View>

        <View style={{ margin: 15, marginTop: 0 }}>
          <Title>API-Schlüssel</Title>
          <TextInput
            mode="outlined"
            label="API-Schlüssel"
            defaultValue={apiKey}
            onChangeText={(text) => setKey(text)}
          />
          <Button
            mode="contained"
            style={{ marginTop: 15, width: '50%', marginLeft: '50%' }}
            onPress={handleSave}
          >
            Speichern
          </Button>
          {/* <Divider style={{ marginTop: 15 }} /> */}
        </View>

        {/* TODO: Hinzufügen einer Option zum einstellen von Push-Benachrichtigungen */}
      </ScrollLayout>
      <Snackbar
        visible={snackbar.show}
        action={snackbar.action}
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
    </Layout>
  );
};
