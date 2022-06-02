import * as React from 'react';
import { Surface } from 'react-native-paper';

export const Layout: React.FC = ({ children }) => {
  return <Surface style={{ flex: 1 }}>{children}</Surface>;
};
