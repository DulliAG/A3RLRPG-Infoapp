import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Surface } from 'react-native-paper';

export const Spinner: React.FC = () => {
  return (
    <Surface style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator animating={true} size={'large'} color={'blue'} />
    </Surface>
  );
};
