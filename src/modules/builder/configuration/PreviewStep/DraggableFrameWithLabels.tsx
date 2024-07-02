import React from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { DraggableLabel } from '@/@types';

import ImageFrame from './ImageFrame';
import LabelPin, { GroupContainer } from './LabelPin';

type Props = {
  isDragging?: boolean;
  labels: DraggableLabel[];
  imageSettingId: string;
};

const DraggableFrameWithLabels = ({
  isDragging,
  labels,
  imageSettingId,
}: Props): JSX.Element => {
  const renderDraggableLabels = (): JSX.Element | JSX.Element[] => {
    const Labels = labels.map((label) => (
      <GroupContainer key={label.ind} top={label.y} left={label.x}>
        <LabelPin label={label} />
      </GroupContainer>
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
