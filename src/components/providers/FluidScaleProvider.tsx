'use client';

import { ReactNode } from 'react';
import { useFluidScale } from '@/hooks/useFluidScale';

interface FluidScaleProviderProps {
  children: ReactNode;
}

export function FluidScaleProvider({ children }: FluidScaleProviderProps) {
  useFluidScale();
  return <>{children}</>;
}
