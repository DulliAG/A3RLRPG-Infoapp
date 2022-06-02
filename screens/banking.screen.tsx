import * as React from 'react';
import { Spinner } from '../components/spinner.component';
import { Layout } from '../components/layout.component';
import { ReallifeRPGService } from '../services/realliferpg.service';
import { CreditCard } from '../components/credit-card.component';
import { KeyContext } from '../context/KeyContext';
import { NoContent } from '../components/no-content.component';
import { ScrollLayout } from '../components/scroll-view.component';

export interface IBankAccount {
  iban: string;
  owner: string;
  balance: number | string;
}

export const Banking: React.FC = () => {
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [bankAccounts, setBankAccounts] = React.useState<IBankAccount[]>([]);

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => {
        const data = result.data[0];
        let accounts: IBankAccount[] = [];

        // FIXME: Typendeklarationen hinzufügen
        data.bank_main.forEach((account: any) =>
          accounts.push({
            iban: account.iban,
            owner: data.pid,
            balance: `${account.balance} €`,
          })
        );
        // data.company_owned.forEach((company: any) => {
        //   accounts.push({
        //     iban: company.bank_1,
        //     owner: company.name,
        //     balance: 'UNBEKANNT',
        //   });
        //   accounts.push({
        //     iban: company.bank_2,
        //     owner: company.name,
        //     balance: 'UNBEKANNT',
        //   });
        // });
        setBankAccounts(accounts);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  console.log(bankAccounts); // FIXME: Remove this
  return (
    <Layout>
      {/* FIXME: Add refreshControl */}
      <ScrollLayout>
        {bankAccounts.length > 0 ? (
          bankAccounts.map((account, index) => <CreditCard key={index} {...account} />)
        ) : (
          <NoContent />
        )}
      </ScrollLayout>
    </Layout>
  );
};
