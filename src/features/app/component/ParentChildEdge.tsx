import { EdgeProps, getBezierPath } from 'reactflow';

export const ParentChildEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) => {
  const middleY = sourceY - 50;
  const radius = 5;
  let customEdgePath = ``;
  if (Math.abs(sourceX - targetX) <= radius) {
    customEdgePath = `M${sourceX},${sourceY} L${targetX},${targetY}`;
  } else if (sourceX < targetX) {
    customEdgePath = `M${sourceX},${sourceY} V${middleY + radius} A${radius},${radius} 0 0 1 ${sourceX + radius},${middleY} H${targetX} V${targetY}`;
  } else {
    customEdgePath = `M${sourceX},${sourceY} V${middleY + radius} A${radius},${radius} 0 0 0 ${sourceX - radius},${middleY} H${targetX} V${targetY}`;
  }

  return (
    <path
      id={id}
      style={style}
      className='react-flow__edge-path'
      d={customEdgePath}
    />
  )
}