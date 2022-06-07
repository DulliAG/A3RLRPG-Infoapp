import * as React from 'react';
import { ProgressBar } from './progress-bar.component';

export const FuelBar: React.FC<{ fuel: number }> = ({ fuel }) => {
  return <ProgressBar progress={fuel} />;
};
