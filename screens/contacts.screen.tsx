import * as React from 'react';
import { FlatList, View } from 'react-native';
import { List, useTheme, Text, Title, Subheading } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { ScrollLayout } from '../components/scroll-view.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/KeyContext';
import { Profile, ReallifeRPGService } from '../services/realliferpg.service';

export const Contacts: React.FC = () => {
  const theme = useTheme();
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile.IProfile>({} as Profile.IProfile);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getProfile()
      .then((result) => setProfile(result))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => {
        console.log(result.data[0].phonebooks);

        setProfile(result);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollLayout refreshing={refreshing} handleRefresh={handleRefresh}>
        <List.AccordionGroup>
          {profile.data[0].phonebooks.length > 0 ? (
            profile.data[0].phonebooks.map((phonebooks, index) => {
              return (
                <List.Accordion
                  key={index}
                  id={phonebooks.idNR}
                  title={'Telefonbuch ' + phonebooks.side}
                >
                  {phonebooks.phonebook.length > 0 ? (
                    <FlatList
                      data={phonebooks.phonebook}
                      renderItem={(props) => (
                        <View
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.border,
                            paddingBottom: 10,
                            paddingHorizontal: 15,
                          }}
                        >
                          <Subheading>{props.item.name}</Subheading>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={{ width: '50%' }}>
                              {props.item.number || 'Keine Telefonnummer'}
                            </Text>
                            <Text style={{ width: '50%' }}>{props.item.iban || 'Keine IBAN'}</Text>
                          </View>
                        </View>
                      )}
                    />
                  ) : (
                    // phonebooks.phonebook.map((contact, index) => (

                    // ))
                    <NoContent />
                  )}
                </List.Accordion>
              );
            })
          ) : (
            <NoContent />
          )}
        </List.AccordionGroup>
      </ScrollLayout>
    </Layout>
  );
};
