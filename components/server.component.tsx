import * as React from 'react';
import { View } from 'react-native';
import { Card, Title, Text, Subheading } from 'react-native-paper';
import { IGameServer, IGunGameServer } from '../services/realliferpg.service';

const SideCount: React.FC<{ label: string }> = ({ label }) => {
  return (
    <View style={{ width: '50%' }}>
      <Text>{label}</Text>
    </View>
  );
};

export const Server: React.FC<{
  server: IGameServer | IGunGameServer;
  width?: number | string;
}> = ({ server, width = '100%' }) => {
  const isReallifeRPGServer = !server.Servername.includes('Gungame');
  return (
    <Card style={{ width: width, elevation: 1 }}>
      <Card.Content>
        <Title style={{ marginBottom: 0 }}>
          {isReallifeRPGServer ? server.Servername : 'ReallifeRPG Gungame'}
        </Title>
        <Subheading style={{ fontWeight: 'bold', marginTop: 0 }}>
          Online: {server.Playercount} / {server.Slots}
        </Subheading>
        {!isReallifeRPGServer && <Text>Offizieller Communityserver</Text>}
        <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {isReallifeRPGServer ? (
            <>
              <SideCount label={`Zivilisten: ${server.Civilians}`} />
              <SideCount label={`Polizei: ${server.Cops}`} />
              <SideCount label={`Mediziner: ${server.Medics}`} />
              <SideCount label={`RAC: ${server.Adac}`} />
            </>
          ) : (
            <>
              <SideCount label={`Spieler: ${server.Playercount}`} />
            </>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

export const ServerPlayer: React.FC<{ player: string }> = ({ player }) => {
  return (
    <Card style={{ marginBottom: 5 }}>
      <Card.Content style={{ paddingVertical: 10 }}>
        <Text style={{ textAlign: 'center' }}>{player}</Text>
      </Card.Content>
    </Card>
  );
};
