import * as React from 'react';
import { Text } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { ScrollLayout } from '../components/scroll-view.component';
import { Spinner } from '../components/spinner.component';

export const Template: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {};

  React.useEffect(() => {}, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollLayout refreshing={refreshing} handleRefresh={handleRefresh}>
        <Text>Content goes here...</Text>
      </ScrollLayout>
    </Layout>
  );
};
