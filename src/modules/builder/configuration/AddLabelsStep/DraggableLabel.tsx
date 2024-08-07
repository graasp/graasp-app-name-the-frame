import { useContext, useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useControls } from 'react-zoom-pan-pinch';

import { Button, styled } from '@mui/material';

import { Label } from '@/@types';
import { LabelsContext } from '@/modules/context/LabelsContext';
import { useImageDimensionsContext } from '@/modules/context/imageDimensionContext';

const StyledLabel = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: 'white',
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  userSelect: 'none',
  padding: theme.spacing(0.5),
  position: 'absolute',
  cursor: 'grab',
  maxWidth: '12ch',
  '&:hover': {
    background: theme.palette.primary.main,
  },
  zIndex: 5,
}));

type Props = {
  showEditForm: (l: Label) => void;
  label: Label;
};

const DraggableLabel = ({ showEditForm, label }: Props): JSX.Element => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { dimension } = useImageDimensionsContext();

  useEffect(() => {
    const x = (parseFloat(label.x) * dimension.width) / 100;
    const y = (parseFloat(label.y) * dimension.height) / 100;
    setPosition({ x, y });
  }, [label, dimension]);

  const { saveLabelsChanges, setIsDragging, isDragging } =
    useContext(LabelsContext);
  const { instance } = useControls();
  const { scale } = instance.transformState;

  const onDrag = (e: DraggableEvent, newP: DraggableData): void => {
    setIsDragging(true);
    e.stopPropagation();
    setPosition({ x: newP.x, y: newP.y });
  };

  const onStop = (e: DraggableEvent): void => {
    e.stopPropagation();
    e.preventDefault();
    const y = `${(position.y / dimension.height) * 100}%`;
    const x = `${(position.x / dimension.width) * 100}%`;
    const newLabel = { ...label, x, y };
    // Set a delay before enabling actions like opening a new form or applying zoom/move to the image frame
    setTimeout(() => {
      setIsDragging(false);
    }, 2000);
    saveLabelsChanges(newLabel);
  };

  return (
    <Draggable
      position={position}
      onDrag={onDrag}
      axis="none"
      onStop={onStop}
      scale={scale}
    >
      <StyledLabel
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            e.preventDefault();
            showEditForm(label);
          }
        }}
      >
        {label.content}
      </StyledLabel>
    </Draggable>
  );
};

export default DraggableLabel;
