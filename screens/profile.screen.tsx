import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Avatar, Title, Subheading, Caption, Divider, Surface } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { RefreshControl } from '../components/refresh-control.component';
import { ScrollLayout } from '../components/scroll-view.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/KeyContext';
import { Profile as PlayerProfile, ReallifeRPGService } from '../services/realliferpg.service';

export const Profile: React.FC = () => {
  const { apiKey } = React.useContext(KeyContext);
  const ReallifeService = new ReallifeRPGService(apiKey);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [profileData, setProfileData] = React.useState<PlayerProfile.IProfile>(
    {} as PlayerProfile.IProfile
  );

  const handleRefresh = () => {
    setRefreshing(true);
    ReallifeService.getProfile()
      .then((result) => setProfileData(result))
      .catch((err) => console.log(err))
      .finally(() => setRefreshing(false));
  };

  React.useEffect(() => {
    ReallifeService.getProfile()
      .then((result) => setProfileData(result))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  // TODO: Redo the design of the profile-page
  const {
    name,
    pid,
    avatar_full,
    coplevel,
    mediclevel,
    adaclevel,
    quest_row,
    skillpoint,
    play_time,
    last_seen,
  } = profileData.data[0];
  return (
    <Layout>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            marginVertical: 15,
          }}
        >
          <Avatar.Image size={100} source={{ uri: avatar_full }} />
          <Title style={{ marginBottom: 0 }}>{name}</Title>
          <Subheading style={{ marginTop: 0 }}>{pid}</Subheading>
          {/* TODO: Add level */}
        </View>

        <Surface style={{ flexDirection: 'row', elevation: 1, paddingBottom: 10 }}>
          <SideContainer icon="police-badge" level={coplevel} />
          <SideContainer icon="medical-bag" level={mediclevel} />
          <SideContainer icon="car-cog" level={adaclevel} />
        </Surface>

        <View style={{ margin: 15 }}>
          <>
            <Caption>Questreihe</Caption>
            <Text>{quest_row} / 42 Quests erledigt</Text>
          </>
          <Divider style={{ marginVertical: 10 }} />
          <>
            <Caption>Skillpunkte</Caption>
            <Text>{skillpoint} verfügbar</Text>
          </>
          <Divider style={{ marginVertical: 10 }} />
          <>
            <Caption>Aktive Spielzeit</Caption>
            <Text>{(play_time.total / 60).toFixed(2)} Stunden</Text>
          </>
          <Divider style={{ marginVertical: 10 }} />
          <>
            <Caption>Gesamte Spielzeit</Caption>
            <Text>{(play_time.active / 60).toFixed(2)} Stunden</Text>
          </>
          <Divider style={{ marginVertical: 10 }} />
          <>
            <Caption>Zuletzt Online</Caption>
            <Text>{last_seen.date}</Text>
          </>
        </View>
      </ScrollView>
    </Layout>
  );
};

const SideContainer: React.FC<{ level: string; icon: string }> = ({ level, icon }) => {
  return (
    <View style={{ width: `${100 / 3}%`, display: 'flex', alignItems: 'center' }}>
      <Avatar.Icon
        size={40}
        icon={icon}
        color="blue"
        style={{ marginBottom: 5, backgroundColor: 'transparent' }}
      />
      <Text style={{ textAlign: 'center' }}>Level {level}</Text>
    </View>
  );
};
