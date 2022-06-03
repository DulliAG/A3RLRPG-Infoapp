import * as React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { Company } from '../components/company.component';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/KeyContext';
import { Profile, ReallifeRPGService } from '../services/realliferpg.service';

export const Companies: React.FC = () => {
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [companies, setCompanies] = React.useState<Profile.ICompany[]>([]);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getProfile()
      .then((result) => {
        const data = result.data[0];
        const ownedCompanies = data.company_owned;
        setCompanies(ownedCompanies);
      })
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => setCompanies(result.data[0].company_owned))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {companies.length > 0 ? (
          <List.AccordionGroup>
            {companies.map((company, index) => (
              <Company key={index} {...company} />
            ))}
          </List.AccordionGroup>
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
