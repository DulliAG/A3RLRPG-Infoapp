import * as React from 'react';
import { useTheme, ProgressBar as PaperProgressBar } from 'react-native-paper';

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const theme = useTheme();
  return (
    <PaperProgressBar
      progress={progress}
      color={theme.colors.primary}
      style={{ marginTop: 5, height: 25, borderRadius: theme.roundness }}
    />
  );
};
