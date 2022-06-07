import * as React from 'react';
import { List, useTheme, Text, ThemeProvider, Divider } from 'react-native-paper';
import { IChangelog, ReallifeRPGService } from '../services/realliferpg.service';
import { format } from 'date-fns';
import { Spinner } from '../components/spinner.component';
import { Layout } from '../components/layout.component';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';
import { ScrollView } from 'react-native';

const ChangeCategory: React.FC<{ category: string }> = ({ category }) => {
  return <List.Subheader style={{ paddingVertical: 0 }}>{category}</List.Subheader>;
};

const ChangeItem: React.FC<{ change: string }> = ({ change }) => {
  const theme = useTheme();
  return (
    <Text style={{ marginHorizontal: 15, marginBottom: 5, color: theme.colors.placeholder }}>
      {change}
    </Text>
  );
  return <List.Item title={change} titleStyle={{ fontSize: 14 }} />;
};

export const Changelogs: React.FC = () => {
  const theme = useTheme();
  const ReallifeService = new ReallifeRPGService();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [changelogs, setChangelogs] = React.useState<IChangelog>({} as IChangelog);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getChangelogs()
      .then((changelogs) => setChangelogs(changelogs))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getChangelogs()
      .then((changelogs) => setChangelogs(changelogs))
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
        {changelogs.data.length > 0 ? (
          <List.AccordionGroup>
            {changelogs.data
              .slice(0, 20)
              .map(({ id, version, release_at, change_mission, change_map, change_mod }, index) => {
                const release = ReallifeService.getChangelogDate(release_at);
                return (
                  <List.Accordion
                    key={id}
                    id={id}
                    title={'v' + version}
                    description={format(release, 'dd.MM.yyyy')}
                  >
                    {change_mission.length > 0 && (
                      <List.Section>
                        <ChangeCategory category="Mission" />
                        {change_mission.map((change, index) => (
                          <ChangeItem key={index} change={change} />
                        ))}
                      </List.Section>
                    )}
                    {change_map.length > 0 && (
                      <List.Section>
                        <ChangeCategory category="Karte" />
                        {change_map.map((change, index) => (
                          <ChangeItem key={index} change={change} />
                        ))}
                      </List.Section>
                    )}
                    {change_mod.length > 0 && (
                      <List.Section>
                        <ChangeCategory category="Mod" />
                        {change_mod.map((change, index) => (
                          <ChangeItem key={index} change={change} />
                        ))}
                      </List.Section>
                    )}
                  </List.Accordion>
                );
              })}
          </List.AccordionGroup>
        ) : (
          <NoContent />
        )}
      </ScrollView>
    </Layout>
  );
};
