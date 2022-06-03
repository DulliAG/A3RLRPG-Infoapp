import * as React from 'react';
import { ProgressBar, useTheme } from 'react-native-paper';

export const FuelBar: React.FC<{ fuel: number }> = ({ fuel }) => {
  const theme = useTheme();
  return (
    <ProgressBar
      progress={fuel}
      style={{ marginTop: 5, height: 25, borderRadius: theme.roundness }}
    />
  );
};
