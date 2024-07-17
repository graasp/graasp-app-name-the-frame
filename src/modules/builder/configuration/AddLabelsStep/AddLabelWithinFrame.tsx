import { useContext, useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import {
  ADD_LABEL_FRAME_HEIGHT,
  ADD_LABEL_FRAME_WIDTH,
} from '@/config/constants';
import { LabelsContext } from '@/modules/context/LabelsContext';

import AddLabelForm from './AddLabelForm';
import DraggableLabel from './DraggableLabel';
import ImageFrame from './ImageFrame';

const TransformContainer = styled(TransformWrapper)(() => ({
  width: '100%',
  height: '100%',
  border: 'none',
  margin: 'auto',
}));

const Container = styled('div')(() => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const AddLabelWithinFrame = (): JSX.Element => {
  const { labels, saveLabelsChanges, isDragging, openForm, setOpenForm } =
    useContext(LabelsContext);

  const { instance } = useControls();
  const { permission } = useLocalContext();
  const [content, setContent] = useState('');
  const [formPosition, setFormPosition] = useState({
    y: 0,
    x: 0,
  });

  const { scale, positionX, positionY } = instance.transformState;

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setContent(event.target.value);
  };

  const handleFormSubmit = (): void => {
    const editingIndex = labels.findIndex(
      ({ y, x }) => y === formPosition.y && x === formPosition.x,
    );
    if (editingIndex > -1) {
      const labelToEdit = labels[editingIndex];

      const newLabel = {
        ...labelToEdit,
        content,
      };
      saveLabelsChanges(editingIndex, newLabel);
    } else {
      const id = v4();
      const p = {
        y: (formPosition.y - positionY) / scale,
        x: (formPosition.x - positionX) / scale,
      };
      const newLabel = { ...p, id, content };
      saveLabelsChanges(editingIndex, newLabel);
    }

    setOpenForm(false);
    setContent('');
  };

  const handleAddLabel = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ): void => {
    if (!isDragging) {
      const { offsetX, offsetY } = event.nativeEvent;
      setFormPosition({
        y: offsetY,
        x: offsetX,
      });

      setOpenForm(true);
    }
  };

  const openEditForm = (labelId: string): void => {
    const ele = labels.find(({ id }) => id === labelId);
    if (ele) {
      const { x, y, content: c } = ele;
      setFormPosition({
        y: y * scale + positionY,
        x: x * scale + positionX,
      });

      setOpenForm(true);
      setContent(c);
    }
  };

  return (
    <Box
      sx={{
        height: ADD_LABEL_FRAME_HEIGHT,
        width: ADD_LABEL_FRAME_WIDTH,
      }}
    >
      {permission === PermissionLevel.Admin && openForm && !isDragging && (
        <AddLabelForm
          value={content}
          formPosition={formPosition}
          onChange={handleFormInputChange}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenForm(false)}
        />
      )}
      <ImageFrame />
      <Container onClick={handleAddLabel}>
        {labels.map((ele) => (
          <DraggableLabel
            key={ele.id}
            label={ele}
            openEditForm={openEditForm}
          />
        ))}
      </Container>
    </Box>
  );
};

const AddLabelWithinFrameWrapper = (): JSX.Element => {
  const { isDragging, openForm } = useContext(LabelsContext);
  const disabled = isDragging || openForm;
  return (
    <TransformContainer
      doubleClick={{ disabled: true }}
      centerOnInit
      panning={{ disabled }}
      pinch={{ disabled }}
      wheel={{ disabled }}
      zoomAnimation={{ disabled }}
      alignmentAnimation={{ disabled }}
      velocityAnimation={{ disabled }}
    >
      <TransformComponent
        wrapperStyle={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <AddLabelWithinFrame />
      </TransformComponent>
    </TransformContainer>
  );
};
export default AddLabelWithinFrameWrapper;
