import * as React from 'react';
import { ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';

export const Template: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {};

  React.useEffect(() => {}, []);

  if (loading) return <Spinner />;
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <Text>Content goes here...</Text>
      </ScrollView>
    </Layout>
  );
};
