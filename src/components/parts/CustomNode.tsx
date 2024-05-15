import { Handle, NodeProps, Position } from "reactflow";
import { PersonData, PersonNodeData } from "../../types/PersonNodeData";
import { BASE_PERSON_NODE_HEIGHT, BASE_PERSON_NODE_WIDTH } from "../../utils/constants";
import { AnimatePresence, Variants, easeOut, motion } from "framer-motion";
import { useRecoilValue } from "recoil";
import { selectedNodeState } from "../../recoil/selectedNodeState";
import { BiSolidUser } from "react-icons/bi";
import styled, { css, keyframes } from "styled-components";
import { formatBirthDay } from '../../utils/formatBirthDay';
import { formatFullName } from '../../utils/formatFullName';

interface StyledBoxProps {
  isSelected: boolean;
}
const variants: Variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 16,
  },
};

const StyledHandle = styled(Handle)`
  opacity: 0;
  border: none;
  pointer-events: none;
  background: #ccc;
`;

const selectedAnimation = keyframes`
0% {
transform: translate(-50%, -50%) scale(1, 1);
opacity: 1;
}
100% {
transform: translate(-50%, -50%) scale(1.8, 1.8);
opacity: 0;
}
`;

const selectedStyle = css`
  &::before {
    content: "";
    animation: ${selectedAnimation} 1.5s linear infinite;
  }
`;

const StyledBox = styled.div<StyledBoxProps>`
  position: relative;
  width: ${BASE_PERSON_NODE_WIDTH}px;
  ${({ isSelected }) => isSelected && selectedStyle};
  border-radius: 50%;
  aspect-ratio: 1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: #fff;
  &::before {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: opacity linear 0.4s;
    z-index: -1;
    border: 1px solid #90cdf4;
  }
`;

const IconBox = styled.div<StyledBoxProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  position: relative;
  background-color: ${({ isSelected }) => (isSelected ? "#3182ce" : "#EB912E")};
  transform: scale(1.1);
`;

const IconInner = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
`;

const DefaultProfileIcon = styled.div`
  margin-top: 14px;
`;

const CustomProfileIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const InformationBox = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  text-align: center;
`;

const Text = styled.p`
  font-size: 16px;
`;

export const personNode = (props: NodeProps<PersonData>) => {
  const { id, data } = props;
  const {birthYear, birthMonth, birthDate, firstName, lastName, profilePictureURL} = data;
  const selectedNode = useRecoilValue(selectedNodeState);
  const isSelected = id === selectedNode?.id;
  const fullName = formatFullName({firstName, lastName});
  const birthDay = formatBirthDay({birthYear, birthMonth, birthDate});


  return (
    <>
      <StyledHandle type="source" position={Position.Right} id="personSourceRight" />
      <StyledHandle type="source" position={Position.Left} id="personSourceLeft" />
      <StyledHandle type="source" position={Position.Top} id="personSourceTop" />
      <AnimatePresence>
        <motion.div
          key={data.label}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <StyledBox isSelected={isSelected}>
            <IconBox isSelected={isSelected}>
              <IconInner>
                {profilePictureURL ? (
                  <CustomProfileIcon src={profilePictureURL} />
                ) : (
                  <DefaultProfileIcon>
                    <BiSolidUser size={100} color="#ffffff" />
                  </DefaultProfileIcon>
                )}
              </IconInner>
            </IconBox>

            <InformationBox>
              <Text>{id}</Text>
              <Text>{fullName}</Text>
              <Text>{birthDay}</Text>
              <Text>{data.gender}</Text>
            </InformationBox>
          </StyledBox>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
