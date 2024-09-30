import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { AnsweredLabel } from '@/@types';
import { LABELS_WITHIN_FRAME_CONTAINER_ID } from '@/config/selectors';

import { DraggableLabelToDroppableContProps } from './DraggableLabelToDroppableCont';
import DroppableLabel from './DroppableLabel';
import ImageFrame from './ImageFrame';

type Props = {
  isDragging: boolean;
  isSubmitted: boolean;
  labels: AnsweredLabel[];
  onRemoveLabel: DraggableLabelToDroppableContProps['onRemoveLabel'];
};

const TransformContainer = styled(TransformWrapper)(() => ({
  width: '100%',
  height: '100%',
  border: 'none',
  margin: 'auto',
}));

const DraggableFrameWithLabels = ({
  isDragging,
  labels,
  isSubmitted,
  onRemoveLabel,
}: Props): JSX.Element => (
  <Box sx={{ width: '100%' }}>
    <TransformContainer
      initialScale={1}
      panning={{ disabled: isDragging }}
      pinch={{ disabled: isDragging }}
      wheel={{ disabled: isDragging }}
      zoomAnimation={{ disabled: isDragging }}
      alignmentAnimation={{ disabled: isDragging }}
      velocityAnimation={{ disabled: isDragging }}
    >
      <Box
        width="100%"
        position="relative"
        id={LABELS_WITHIN_FRAME_CONTAINER_ID}
      >
        <TransformComponent
          wrapperStyle={{
            width: '100%',
          }}
          contentStyle={{
            width: '100%',
          }}
        >
          <ImageFrame />
          {labels.map((label, index) => (
            <DroppableLabel
              index={index}
              label={label}
              key={label.expected.id}
              isDragging={isDragging}
              onRemoveLabel={onRemoveLabel}
              isSubmitted={isSubmitted}
            />
          ))}
        </TransformComponent>
      </Box>
    </TransformContainer>
  </Box>
);

export default DraggableFrameWithLabels;
