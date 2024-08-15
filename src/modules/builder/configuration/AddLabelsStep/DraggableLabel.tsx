import { useContext, useEffect, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useControls } from 'react-zoom-pan-pinch';

import { Button, styled } from '@mui/material';

import { Label } from '@/@types';
import { buildDraggableLabelId } from '@/config/selectors';
import { LabelsContext } from '@/modules/context/LabelsContext';
import { useImageDimensionsContext } from '@/modules/context/imageDimensionContext';
import { PositionConverter } from '@/utils';

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
    setPosition(
      PositionConverter.toAbsolute({
        x: label.x,
        y: label.y,
        ...dimension,
      }),
    );
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

    const newLabel = {
      ...label,
      ...PositionConverter.toRelative({ ...position, ...dimension }),
    };

    // Add a delay before allowing actions like opening a new form or applying zoom/move to the image frame to prevent unintended behavior, particularly when isDragging is disabled and openForm or drag-and-drop might be triggered
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
        id={buildDraggableLabelId(label.content)}
      >
        {label.content}
      </StyledLabel>
    </Draggable>
  );
};

export default DraggableLabel;
