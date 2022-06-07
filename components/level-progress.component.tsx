import * as React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import Layout from '../constants/Layout';
import { ProgressBar } from './progress-bar.component';

export const LevelProgress: React.FC<{ level: number; progress: number }> = ({
  level,
  progress,
}) => {
  return (
    <View style={{ marginHorizontal: 15, width: Layout.window.width - 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text>Level {level}</Text>
        <Text>Level {level + 1}</Text>
      </View>
      <ProgressBar progress={progress / 100} />
    </View>
  );
};
