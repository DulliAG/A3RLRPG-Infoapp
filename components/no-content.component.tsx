import * as React from 'react';
import { Surface, Text } from 'react-native-paper';

export const NoContent: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <Surface
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}
    >
      <Text>{text || 'Keine Ergebnisse gefunden'}</Text>
    </Surface>
  );
};
