import * as React from 'react';
import { View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { Company } from '../components/company.component';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { ScrollLayout } from '../components/scroll-view.component';
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
        // FIXME: Add type declarations
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
      <ScrollLayout>
        {companies.length > 0 ? (
          <List.AccordionGroup>
            {companies.map((company, index) => (
              <Company key={index} {...company} />
            ))}
          </List.AccordionGroup>
        ) : (
          <NoContent />
        )}
      </ScrollLayout>
    </Layout>
  );
};
