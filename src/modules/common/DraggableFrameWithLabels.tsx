import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { AnsweredLabel } from '@/@types';
import { LABELS_WITHIN_FRAME_CONTAINER_ID } from '@/config/selectors';

import DroppableLabel from './DroppableLabel';
import ImageFrame from './ImageFrame';

type Props = {
  isDragging: boolean;
  isSubmitted: boolean;
  labels: AnsweredLabel[];
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
      <TransformComponent
        wrapperStyle={{
          width: '100%',
          maxHeight: '100%',
        }}
        contentStyle={{
          width: '100%',
        }}
      >
        <Box sx={{ width: '100%' }} id={LABELS_WITHIN_FRAME_CONTAINER_ID}>
          <ImageFrame />
          {labels.map((label, index) => (
            <DroppableLabel
              index={index}
              label={label}
              key={label.expected.id}
              isDragging={isDragging}
              isSubmitted={isSubmitted}
            />
          ))}
        </Box>
      </TransformComponent>
    </TransformContainer>
  </Box>
);

export default DraggableFrameWithLabels;
