import { FC, memo } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { SelectActionModal } from './SelectActionModal';
import { FamilyTreeWrapper } from './FamilyTreeWrapper';
import { UseMicroModal } from '../../../hooks/useMicromodal';

export const FamilyTree: FC = memo(function FamilyTreeComponent() {
  const { Modal, open, close } = UseMicroModal('select-action-modal');
  return (
    <ReactFlowProvider>
      <FamilyTreeWrapper openModal={open} />
      <Modal>
        <SelectActionModal closeModal={close} />
      </Modal>
    </ReactFlowProvider>
  );
});
