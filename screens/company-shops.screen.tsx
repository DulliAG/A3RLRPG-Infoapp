import * as React from 'react';
import { Spinner } from '../components/spinner.component';
import { Layout } from '../components/layout.component';
import { ICompanyShop, ReallifeRPGService } from '../services/realliferpg.service';
import { Image, ScrollView, View } from 'react-native';
import { KeyContext } from '../context/KeyContext';
import { NoContent } from '../components/no-content.component';
import { List, Text, useTheme } from 'react-native-paper';
import { RefreshControl } from '../components/refresh-control.component';

export const CompanyShops: React.FC = () => {
  const theme = useTheme();
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [companies, setCompanies] = React.useState<ICompanyShop[]>([]);

  const handleRefresh = () => {
    setRefreshing(false);
    ReallifeService.getCompanyShops()
      .then((result) => setCompanies(result.data))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getCompanyShops()
      .then((result) => setCompanies(result.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <List.AccordionGroup>
          {companies.length > 0 ? (
            companies.map((company, index) => (
              <List.Accordion
                key={index}
                id={company.company.id + index}
                title={company.company.name}
              >
                <List.Section>
                  {company.shops.length > 0 ? (
                    company.shops.map((item) => (
                      <List.Item
                        key={index}
                        title={item.item_localized}
                        left={(props) => (
                          <Image
                            style={{ width: 40, height: 40 }}
                            source={{
                              uri: 'https://files.dulliag.de/app/market_' + item.item + '.png',
                            }}
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
                              <Text style={{ textAlign: 'right' }}>
                                {item.amount} Stk. {item.price.toLocaleString()} €
                              </Text>
                            </View>
                          </View>
                        )}
                        style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
                      />
                    ))
                  ) : (
                    <NoContent />
                  )}
                </List.Section>
              </List.Accordion>
            ))
          ) : (
            <NoContent />
          )}
        </List.AccordionGroup>
      </ScrollView>
    </Layout>
  );
};
