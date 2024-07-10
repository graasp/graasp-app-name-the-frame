import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { DraggableLabelType } from '@/@types';

import DroppableDraggableLabel from './DroppableDraggableLabel';
import ImageFrame from './ImageFrame';

type Props = {
  isDragging: boolean;
  labels: DraggableLabelType[];
  imageSettingId: string;
  isSubmitted: boolean;
};

const DraggableFrameWithLabels = ({
  isDragging,
  labels,
  imageSettingId,
  isSubmitted,
}: Props): JSX.Element => {
  const renderDraggableLabels = (): JSX.Element | JSX.Element[] => {
    const Labels = labels.map((label) => (
      <DroppableDraggableLabel
        label={label}
        key={label.ind}
        isDragging={isDragging}
        isSubmitted={isSubmitted}
      />
    ));

    return Labels;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TransformWrapper
        initialScale={1}
        panning={{ disabled: isDragging }}
        pinch={{ disabled: isDragging }}
        wheel={{ disabled: isDragging }}
        zoomAnimation={{ disabled: isDragging }}
        alignmentAnimation={{ disabled: isDragging }}
        velocityAnimation={{ disabled: isDragging }}
      >
        <TransformComponent
          wrapperStyle={{ margin: '0 auto' }}
          contentStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ImageFrame appSettingId={imageSettingId} />
          {renderDraggableLabels()}
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};

export default DraggableFrameWithLabels;
