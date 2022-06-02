import * as React from 'react';
import { Spinner } from '../components/spinner.component';
import { Layout } from '../components/layout.component';
import { Profile, ReallifeRPGService } from '../services/realliferpg.service';
import { CreditCard } from '../components/credit-card.component';
import { KeyContext } from '../context/KeyContext';
import { NoContent } from '../components/no-content.component';
import { ScrollView } from 'react-native';
import { RefreshControl } from '../components/refresh-control.component';

export interface IBankAccount {
  iban: string;
  owner: string;
  balance: number | string;
}

export const Banking: React.FC = () => {
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState<IBankAccount[]>([]);

  const handleRefresh = () => {
    setRefreshing(false);
    ReallifeService.getProfile()
      .then((result) => {
        const data = result.data[0];
        let accounts: IBankAccount[] = [];

        const getBalance = (company: Profile.ICompany, key: 'bank_1' | 'bank_2') => {
          if (!company.bank_details) return 'UNBEKANNT';
          return company.bank_details[key].balance + ' €';
        };

        data.bank_main.forEach((account: Profile.IBankAccount) =>
          accounts.push({
            iban: account.iban,
            owner: data.pid,
            balance: `${account.balance} €`,
          })
        );

        data.company_owned.forEach((company: Profile.ICompany) => {
          console.log(getBalance(company, 'bank_1'));
          accounts.push({
            iban: company.bank_1,
            owner: company.name,
            balance: getBalance(company, 'bank_1'),
          });
          accounts.push({
            iban: company.bank_2,
            owner: company.name,
            balance: getBalance(company, 'bank_2'),
          });
        });
        setBankAccounts(accounts);
      })
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => {
        const data = result.data[0];
        let accounts: IBankAccount[] = [];

        const getBalance = (company: Profile.ICompany, key: 'bank_1' | 'bank_2') => {
          if (!company.bank_details) return 'UNBEKANNT';
          return company.bank_details[key].balance + ' €';
        };

        data.bank_main.forEach((account: Profile.IBankAccount) =>
          accounts.push({
            iban: account.iban,
            owner: data.pid,
            balance: `${account.balance} €`,
          })
        );

        data.company_owned.forEach((company: Profile.ICompany) => {
          console.log(getBalance(company, 'bank_1'));
          accounts.push({
            iban: company.bank_1,
            owner: company.name,
            balance: getBalance(company, 'bank_1'),
          });
          accounts.push({
            iban: company.bank_2,
            owner: company.name,
            balance: getBalance(company, 'bank_2'),
          });
        });
        setBankAccounts(accounts);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {bankAccounts.length > 0 ? (
          bankAccounts.map((account, index) => <CreditCard key={index} {...account} />)
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
