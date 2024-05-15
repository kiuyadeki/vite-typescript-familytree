import { Dispatch, FC, SetStateAction, memo, useEffect, useState } from "react";
import { ProfileEditor } from "./ProfileEditor";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedNodeState } from "../../recoil/selectedNodeState";
import { useAddParentToSelectedNode } from "../../hooks/useAddParentToSelectedNode";
import { useAddChildToSelectedNode } from "../../hooks/useAddChildToSelectedNode";
import { useAddSpouseToSelectedNode } from "../../hooks/useAddSpouseToSelectedNode";
import { wholeNodesState } from "../../recoil/WholeNodesState";
import { nodesUpdatedState } from "../../recoil/nodesUpdatedState";
import { wholeEdgesState } from "../../recoil/WholeEdgesState";
import { IoCloseOutline } from "react-icons/io5";
import styled from "styled-components";

type SelectActionModalProps = {
  closeModal: () => void;
};

export const SelectActionModal: FC<SelectActionModalProps> = memo(props => {
  const { closeModal } = props;
  const selectedNode = useRecoilValue(selectedNodeState);
  const [wholeNodes, setWholeNodes] = useRecoilState(wholeNodesState);
  const [nodesUpdated, setNodesUpdated] = useRecoilState(nodesUpdatedState);
  const [wholeEdges, setWholeEdges] = useRecoilState(wholeEdgesState);
  const [showProfileEditor, setShowProfileEditor] = useState<boolean>(false);
  const addParentToSelectedNode = useAddParentToSelectedNode(setWholeNodes, setWholeEdges, () => setNodesUpdated(true));
  const addChildToSelectedNode = useAddChildToSelectedNode(wholeNodes, setWholeNodes, wholeEdges, setWholeEdges, () =>
    setNodesUpdated(true)
  );
  const addSpouseToSelectedNode = useAddSpouseToSelectedNode(setWholeNodes, setWholeEdges, () => setNodesUpdated(true));

  // 情報を編集
  const displayProfileEditor = () => {
    if (selectedNode) {
      setShowProfileEditor(true);
    }
  };

  const handleCloseModal = () => {
    setShowProfileEditor(false);
    closeModal();
  };

  let hasParents = false;
  let hasSpouse = false;
  if (selectedNode) {
    hasParents = !!selectedNode.data.parents.length;
    hasSpouse = !!selectedNode.data.spouse.length;
  }

  const ModalBox = styled.section`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    outline: none;
    border-radius: 0.375rem;
    color: inherit;
    margin-top: 4rem;
    margin-bottom: 4rem;
    z-index: 1400;
    background-color: #fff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    max-width: 28rem;
    padding: 0.75rem;
  `;

  const ButtonList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    column-gap: 1rem;
    row-gap: 1.2rem;
  `;

  const StyledButton = styled.button`
    display: inline-flex;
    appearance: none;
    align-items: center;
    justify-content: center;
    user-select: none;
    position: relative;
    white-space: nowrap;
    vertical-align: middle;
    outline: none;
    border: none;
    line-height: 1.2;
    border-radius: 0.375rem;
    font-weight: 600;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-duration: 200ms;
    height: 2.5rem;
    min-width: 2.5rem;
    font-size: 1rem;
    padding-inline: 1rem;
    background: #edf2f7;
    color: #1a202c;
    cursor: pointer;

    @media (hover) {
      &:hover {
        background-color: #e2e8f0;
      }
    }

    &[disabled] {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: none;
    }
  `;

  const ModalBody = styled.div`
    padding-inline: 2.5rem;
    padding-block: 5rem 3rem;
    flex: 1 1 0%;
    position: relative;
  `;

  const CloseButton = styled.button`
    appearance: none;
    border: none;
    outline: none;
    background-color: transparent;
    position: absolute;
    padding: 3px;
    border-radius: 4px;
    right: 0.7rem;
    top: 0.5rem;
    cursor: pointer;
    line-height: 0;
    transition: background-color 300ms;
    @media (hover) {
      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  `;

  return (
    <>
      <ModalBody>
        <CloseButton onClick={closeModal}>
          <IoCloseOutline size={25} color="currentColor" />
        </CloseButton>
        {showProfileEditor ? (
          <ProfileEditor onClose={closeModal} setShowProfileEditor={setShowProfileEditor} />
        ) : (
          <>
            <ButtonList>
              <StyledButton
                disabled={hasParents}
                // isDisabled={hasParents}
                onClick={() => {
                  addParentToSelectedNode();
                  closeModal();
                }}
              >
                親を追加
              </StyledButton>
              <StyledButton
                onClick={() => {
                  addChildToSelectedNode();
                  closeModal();
                }}
              >
                子を追加
              </StyledButton>
              <StyledButton
                disabled={hasSpouse}
                // isDisabled={hasSpouse}
                onClick={() => {
                  addSpouseToSelectedNode();
                  closeModal();
                }}
              >
                配偶者を追加
              </StyledButton>
              <StyledButton
                onClick={() => {
                  displayProfileEditor();
                }}
              >
                情報を編集
              </StyledButton>
            </ButtonList>
          </>
        )}
      </ModalBody>
    </>
  );
});
