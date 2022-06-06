import { format } from 'date-fns';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Avatar, Title, Subheading, Caption, Divider, Surface } from 'react-native-paper';
import { Layout } from '../components/layout.component';
import { LevelProgress } from '../components/level-progress.component';
import { RefreshControl } from '../components/refresh-control.component';
import { Spinner } from '../components/spinner.component';
import { KeyContext } from '../context/key.context';
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
  }, [apiKey]);

  if (loading) return <Spinner />;
  // TODO: Redo the design of the profile-page
  const {
    name,
    pid,
    level,
    level_progress,
    avatar_full,
    justizlevel,
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
          <LevelProgress level={level} progress={level_progress} />
        </View>

        <Surface style={{ flexDirection: 'row', elevation: 1, paddingBottom: 10 }}>
          <FractionLevel icon="badge-account" level={justizlevel} />
          <FractionLevel icon="police-badge" level={coplevel} />
          <FractionLevel icon="medical-bag" level={mediclevel} />
          <FractionLevel icon="car-cog" level={adaclevel} />
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
            <Text>{format(ReallifeService.getChangelogDate(last_seen.date), 'dd.MM HH:mm')}</Text>
          </>
        </View>
      </ScrollView>
    </Layout>
  );
};

const FractionLevel: React.FC<{ level: string; icon: string }> = ({ level, icon }) => {
  return (
    <View style={{ width: '25%', display: 'flex', alignItems: 'center' }}>
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
