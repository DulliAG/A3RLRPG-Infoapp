import * as React from 'react';
import { format } from 'date-fns';
import { View } from 'react-native';
import { List, Text, Title } from 'react-native-paper';
import { Profile, ReallifeRPGService } from '../services/realliferpg.service';
import { Row } from './credit-card.component';

const Column: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <View style={{ width: '50%' }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{label}</Text>
      <Text style={{ textAlign: 'center' }}>{value}</Text>
    </View>
  );
};

export const Company: React.FC<Profile.ICompany> = ({
  id,
  name,
  level,
  created_at,
  bank_1,
  bank_2,
}) => {
  return (
    <List.Accordion
      id={id}
      title={name}
      style={{
        // backgroundColor: 'white',
        borderColor: 'rgba(0,0,0,0.25)',
        borderBottomWidth: 1,
      }}
    >
      <View
        style={{
          padding: 15,
          // backgroundColor: 'white',
          borderBottomColor: 'rgba(0,0,0,0.25)',
          borderBottomWidth: 1,
        }}
      >
        <Title style={{ textAlign: 'center' }}>{name}</Title>

        <Row>
          <Column label="Level" value={'Level ' + level} />
          <Column
            label="Gegründet am"
            value={format(new ReallifeRPGService().getChangelogDate(created_at), 'dd.MM.yyyy')}
          />
          <Column label="Konto 1" value={bank_1} />
          <Column label="Konto 2" value={bank_2} />
        </Row>
      </View>
    </List.Accordion>
  );
};
