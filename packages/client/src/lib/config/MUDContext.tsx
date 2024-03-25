import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import mudConfig from 'contracts/mud.config';

import { setup, SetupResult } from '@/lib/mud/setup';

const MUDContext = createContext<SetupResult | null>(null);

type Props = {
  children: ReactNode;
  value: SetupResult;
};

export const useMUD = () => {
  const value = useContext(MUDContext);
  if (!value) throw new Error('Must be used within a MUDProvider');
  return value;
};

export const MUDProvider = ({ children, value }: Props) => {
  const currentValue = useContext(MUDContext);
  if (currentValue) throw new Error('MUDProvider can only be used once');
  return <MUDContext.Provider value={value}>{children}</MUDContext.Provider>;
};
