import { FC, ReactNode, useCallback } from 'react'
import { useHook } from './modal.hook';
import { ModalComponent } from './modal.view';

export type MicroModalTypes = (id: string) => {
  Modal: FC< {children: ReactNode}>;
  open: () => void;
  close: () => void;
}

export const UseMicroModal: MicroModalTypes = (id: string) => {
  const { open, close } = useHook(id);

  const Modal = useCallback<FC<{ children: ReactNode }>>(
    ({ children }) => {
      return <ModalComponent id={id}>{children}</ModalComponent>
    }, [id]
  );

  return {
    Modal, open, close
  }

}