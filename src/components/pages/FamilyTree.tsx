import { FC, memo } from "react";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { SelectActionModal } from "../parts/SelectActionModal";
import { FamilyTreeWrapper } from './FamilyTreeWrapper';
import { UseMicroModal } from '../../hooks/useMicromodal';

const AddNodeOnEdgeDrop = () => {
  const {Modal, open, close} = UseMicroModal('select-action-modal');

  return (
    <>
      <FamilyTreeWrapper openModal={open} />
      <Modal>
      <SelectActionModal
        closeModal={close}
      />
      </Modal>
    </>
  );
};

export const FamilyTree: FC = memo(() => {
  return (
    <ReactFlowProvider>
      <AddNodeOnEdgeDrop />
    </ReactFlowProvider>
  );
});
