import { useState } from 'react';
import { DraggableData, DraggableEvent } from 'react-draggable';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { Label } from '@/@types';
import { ADD_LABEL_FRAME_HEIGHT } from '@/config/constants';

import AddLabelForm from './AddLabelForm';
import DraggableLabel from './DraggableLabel';
import ImageFrame from './ImageFrame';

type Props = {
  imageSettingId: string;
  labels: Label[];
  setLabels: (l: Label[]) => void;
  saveData: (l: Label[]) => void;
};

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

const AddDraggableLabel = ({
  labels,
  setLabels,
  imageSettingId,
  saveData,
}: Props): JSX.Element => {
  const { instance } = useControls();
  const { permission } = useLocalContext();
  const [openForm, setOpenForm] = useState(false);
  const [labelText, setLabelText] = useState('');
  const [formPosition, setFormPosition] = useState({
    y: 0,
    x: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const { scale, positionX, positionY } = instance.transformState;

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLabelText(event.target.value);
  };

  const handleFormSubmit = (): void => {
    const editingIndex = labels.findIndex(
      ({ y, x }) => y === formPosition.y && x === formPosition.x,
    );
    const isEditing = editingIndex > -1;
    // editing existing label
    if (isEditing) {
      const labelToEdit = labels[editingIndex];
      const newLabel = {
        ...labelToEdit,
        content: labelText,
      };

      const newLabelGroups = [
        ...labels.slice(0, editingIndex),
        newLabel,
        ...labels.slice(editingIndex + 1),
      ];
      setLabels(newLabelGroups);
      saveData(newLabelGroups);
    } else {
      const id = v4();
      const p = {
        y: (formPosition.y - positionY) / scale,
        x: (formPosition.x - positionX) / scale,
      };
      const newLabel = { ...p, id, content: labelText };
      setLabels([...labels, newLabel]);
      saveData([...labels, newLabel]);
    }
    setOpenForm(false);
    setLabelText('');
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

  const onDrag = (
    e: DraggableEvent,
    position: DraggableData,
    labelId: string,
  ): void => {
    setIsDragging(true);
    e.stopPropagation();
    const { x, y } = position;
    const labelInd = labels.findIndex(({ id }) => id === labelId);
    if (labelInd > -1) {
      const label = labels[labelInd];

      const p = {
        x,
        y,
      };
      const newLabel = { ...label, ...p };
      const newLabelGroups = [
        ...labels.slice(0, labelInd),
        newLabel,
        ...labels.slice(labelInd + 1),
      ];
      setLabels(newLabelGroups);
    }
  };

  const deleteLabel = (labelId: string): void => {
    const filteredLabels = labels.filter(({ id }) => labelId !== id);
    setLabels(filteredLabels);
    saveData(filteredLabels);
  };

  const editLabel = (labelId: string): void => {
    const ele = labels.find(({ id }) => id === labelId);
    if (ele) {
      const { x, y, content } = ele;
      setFormPosition({
        y: y * scale + positionY,
        x: x * scale + positionX,
      });

      setOpenForm(true);
      setLabelText(content);
    }
  };

  return (
    <Box
      sx={{
        height: `${ADD_LABEL_FRAME_HEIGHT}px`,
        width: `100%`,
      }}
    >
      {permission === PermissionLevel.Admin && openForm && !isDragging && (
        <AddLabelForm
          value={labelText}
          formPosition={formPosition}
          onChange={handleFormInputChange}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenForm(false)}
        />
      )}
      <ImageFrame appSettingId={imageSettingId} />
      <Container onClick={handleAddLabel}>
        {labels.map((ele) => (
          <DraggableLabel
            key={ele.id}
            label={ele}
            onDrag={(e: DraggableEvent, p: DraggableData) =>
              onDrag(e, p, ele.id)
            }
            deleteLabel={deleteLabel}
            editLabel={editLabel}
            scale={scale}
            setIsDragging={setIsDragging}
            onStop={() => saveData(labels)}
          />
        ))}
      </Container>
    </Box>
  );
};

const AddDraggableLabelWrapper = ({
  imageSettingId,
  labels,
  setLabels,
  saveData,
}: Props): JSX.Element => (
  <TransformContainer doubleClick={{ disabled: true }} centerOnInit>
    <TransformComponent
      wrapperStyle={{
        width: '100%',
        maxHeight: '100%',
      }}
      contentStyle={{ width: '100%' }}
    >
      <AddDraggableLabel
        labels={labels}
        setLabels={setLabels}
        imageSettingId={imageSettingId}
        saveData={saveData}
      />
    </TransformComponent>
  </TransformContainer>
);
export default AddDraggableLabelWrapper;
