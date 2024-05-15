import { useCallback } from 'react';
import client from 'micromodal';


export const useHook = (id: string) => {
  const open = useCallback(() => {
    client.show(id, {
      disableScroll: true,
      awaitCloseAnimation: true,
      awaitOpenAnimation: true,
    })
  }, [id]);

  const close = useCallback(() => {
    client.close(id);
  }, [id]);

  return { open, close};
}