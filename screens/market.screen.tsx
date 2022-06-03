import { format } from 'date-fns';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { IMarketAll, ReallifeRPGService } from '../services/realliferpg.service';

export const Market: React.FC = () => {
  const theme = useTheme();
  const ReallifeService = new ReallifeRPGService();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [market, setMarket] = React.useState<IMarketAll>({} as IMarketAll);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getMarketForAllServers()
      .then((market) => setMarket(market))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getMarketForAllServers()
      .then((market) => setMarket(market))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {market.data.length > 0 ? (
          <List.Section>
            {market.data[0].market.map((item, index) => (
              <List.Item
                key={index}
                title={item.localized}
                left={(props) => (
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={{ uri: 'https://files.dulliag.de/app/market_' + item.item + '.png' }}
                  />
                )}
                right={() => (
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '30%',
                    }}
                  >
                    <View>
                      <Text>Server 1:</Text>
                      <Text>Server 2:</Text>
                    </View>
                    <View>
                      <Text style={{ textAlign: 'right' }}>{item.price.toLocaleString()} €</Text>
                      <Text style={{ textAlign: 'right' }}>
                        {market.data[1].market[index].price.toLocaleString()} €
                      </Text>
                    </View>
                  </View>
                )}
                style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
              />
            ))}
            <Text
              style={{
                textAlign: 'center',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              }}
            >
              Markpreis berechnet um{' '}
              {format(
                ReallifeService.getChangelogDate(market.data[0].market[0].updated_at),
                'HH:mm:ss'
              )}{' '}
              Uhr
            </Text>
          </List.Section>
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
