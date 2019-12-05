import { useCallback } from 'react';
import { useRxAsync } from 'use-rx-async';

const delay = (ms: number) => new Promise(_ => setTimeout(_, ms));

export function useFakeRequest<T extends {}>() {
  const fakeRequest = useCallback((result: T) => {
    return delay(2000).then(() => result);
  }, []);

  const onSuccess = useCallback(
    result => alert(JSON.stringify(result, null, 2)),
    []
  );

  return useRxAsync(fakeRequest, { defer: true, onSuccess });
}
