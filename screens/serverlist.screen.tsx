import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Title, TouchableRipple } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import DeviceLayout from '../constants/Layout';
import { Server, ServerPlayer } from '../components/server.component';
import { Spinner } from '../components/spinner.component';
import { IServerList, ReallifeRPGService } from '../services/realliferpg.service';
import { NoContent } from '../components/no-content.component';
import { RefreshControl } from '../components/refresh-control.component';

export const ServerList: React.FC = () => {
  const ReallifeService = new ReallifeRPGService();
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [servers, setServers] = React.useState<IServerList>();
  const [players, setPlayers] = React.useState<string[]>([]);

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getServers()
      .then((list) => {
        setServers(list);
        setPlayers(list.data[0].Players);
      })
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getServers()
      .then((list) => {
        setServers(list);
        setPlayers(list.data[0].Players);
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
        <View style={{ marginHorizontal: 15, marginTop: 15 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {servers?.data.map((server, index) => {
              return (
                <TouchableRipple
                  key={index}
                  rippleColor="rgba(0, 0, 0, 0)"
                  style={{ marginRight: servers.data.length - 1 !== index ? 15 : 0 }}
                  onPress={() => setPlayers(server.Players)}
                >
                  <Server
                    width={
                      servers.data.length > 0
                        ? DeviceLayout.window.width * 0.85
                        : DeviceLayout.window.width - 30
                    }
                    server={server}
                  />
                </TouchableRipple>
              );
            })}
          </ScrollView>
        </View>
        <View style={{ margin: 15, flexGrow: 1 }}>
          <Title>Spielerliste</Title>
          <View style={{ flexGrow: 1 }}>
            {players.length > 0 ? (
              players.map((player, index) => <ServerPlayer key={index} player={player} />)
            ) : (
              <NoContent text="Keine Spieler gefunden" />
            )}
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};
