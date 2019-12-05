import { useState, useCallback } from 'react';

export function useBoolean(initialState: boolean = false) {
  const [flag, setFlag] = useState(initialState);
  const on = useCallback(() => setFlag(true), []);
  const off = useCallback(() => setFlag(false), []);
  const toggle = useCallback(() => setFlag(flag => !flag), []);

  return [flag, { on, off, toggle }] as const;
}
