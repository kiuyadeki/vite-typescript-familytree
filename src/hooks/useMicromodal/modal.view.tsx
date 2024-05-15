import styled, { keyframes } from "styled-components";
import { Children, FC, ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  id: string;
};

export const ModalComponent: FC<Props> = ({ children, id }) => {
  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const fadeOut = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `;

  const StyledWrap = styled.div`
    display: none;
    &.is-open {
      display: block;
    }

    &[aria-hidden="false"] {
      animation: ${fadeIn} 0.3s cubic-bezier(0, 0, 0.2, 1);
    }
    &[aria-hidden="true"] {
      animation: ${fadeOut} 0.3s cubic-bezier(0, 0, 0.2, 1);
    }
  `;

  const StyledOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.48);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const StyledDialog = styled.div`
    width: 32rem;
    margin: auto;
    background-color: #fff;
    overflow-y: auto;
    max-height: 100vh;
    border-radius: 0.375rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05);
  `;

  return createPortal(
    <StyledWrap id={id} aria-hidden="true">
      <StyledOverlay tabIndex={-1} data-micromodal-close>
        <StyledDialog role="dialog" aria-modal="true">
          {children}
        </StyledDialog>
      </StyledOverlay>
    </StyledWrap>,
    document.body
  );
};
