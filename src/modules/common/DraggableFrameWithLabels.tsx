import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { AnsweredLabel } from '@/@types';

import DroppableLabel from './DroppableLabel';
import ImageFrame from './ImageFrame';

type Props = {
  isDragging: boolean;
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
}: Props): JSX.Element => {
  const renderDroppableLabels = (): JSX.Element[] => {
    const Labels = labels.map((label, index) => (
      <DroppableLabel
        label={label}
        key={label.expected.id}
        isDragging={isDragging}
        id={index + 1}
      />
    ));

    return Labels;
  };

  return (
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
          <Box sx={{ width: '100%' }}>
            <ImageFrame />
            {renderDroppableLabels()}
          </Box>
        </TransformComponent>
      </TransformContainer>
    </Box>
  );
};

export default DraggableFrameWithLabels;
