import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Chip, List, Text, useTheme } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/key.context';
import { Profile, ReallifeRPGService } from '../services/realliferpg.service';

export const Properties: React.FC = () => {
  const theme = useTheme();
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [houses, setHouses] = React.useState<Profile.IHouse[]>([]);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getProfile()
      .then((result) => setHouses(result.data[0].houses))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => setHouses(result.data[0].houses))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      {houses.length > 0 ? (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <List.AccordionGroup>
            {houses.map((house, index) => (
              <List.Accordion
                key={index}
                id={house.id}
                title={'Haus ' + house.id}
                style={{
                  borderColor: theme.colors.border,
                  borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    padding: 15,
                    borderColor: theme.colors.border,
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Gewartet für {house.payed_for / 24} Tage
                  </Text>

                  <Text style={{ fontWeight: 'bold', marginTop: 15 }}>Bewohner</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-start',
                      marginTop: 5,
                    }}
                  >
                    {house.players.map((player) => (
                      <Chip style={{ marginRight: 10 }}>{player}</Chip>
                    ))}
                  </View>
                </View>
              </List.Accordion>
            ))}
          </List.AccordionGroup>
        </ScrollView>
      ) : (
        <NoContent />
      )}
    </Layout>
  );
};
