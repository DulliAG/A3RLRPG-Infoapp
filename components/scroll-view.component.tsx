import * as React from 'react';
import { ScrollView, RefreshControl, View, ScrollViewBase } from 'react-native';

export const ScrollLayout: React.FC<{
  refreshing?: boolean;
  handleRefresh?: () => void;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
}> = ({
  children,
  refreshing,
  handleRefresh,
  horizontal = false,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
}) => {
  if (refreshing !== undefined && handleRefresh !== undefined) {
    return (
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            progressBackgroundColor={'white'}
            colors={['blue']}
          />
        }
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <ScrollView
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {children}
    </ScrollView>
  );
};
