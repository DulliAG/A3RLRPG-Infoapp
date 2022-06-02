import * as React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Title, Text } from 'react-native-paper';
// @ts-ignore
import RLRPG_LOGO from '../assets/realliferpg_logo.png';
import { IBankAccount } from '../screens/banking.screen';

export const Row: React.FC = ({ children }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>{children}</View>
  );
};

export const CreditCard: React.FC<IBankAccount> = ({ owner, iban, balance }) => {
  return (
    <View style={styles.card}>
      <Title style={styles.provider}>KR-Banking</Title>
      <Image style={styles.providerLogo} source={RLRPG_LOGO} />
      <View style={styles.formGroup}>
        <Text style={styles.label}>IBAN</Text>
        <Text style={styles.field}>{iban}</Text>
      </View>
      <View style={{ ...styles.row, justifyContent: 'space-between', marginTop: 15 }}>
        <View style={{ ...styles.formGroup, width: '55%' }}>
          <Text style={styles.label}>Inhaber</Text>
          <Text style={styles.field}>{owner}</Text>
        </View>
        <View style={{ ...styles.formGroup, width: '40%' }}>
          <Text style={styles.label}>Kontostand</Text>
          <Text style={{ ...styles.field, textAlign: 'right' }}>{balance}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'blue',
  },
  providerLogo: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 50,
    height: 50,
  },
  provider: {
    marginBottom: 12,
    fontSize: 22,
    color: '#fff',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formGroup: {},
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  field: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, .4)',
    color: '#fff',
  },
});
