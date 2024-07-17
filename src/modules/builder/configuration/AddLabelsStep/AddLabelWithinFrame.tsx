import { useState } from 'react';
import {
  TransformComponent,
  TransformWrapper,
  useControls,
} from 'react-zoom-pan-pinch';

import { Box, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { Label, Settings, SettingsKeys } from '@/@types';
import {
  ADD_LABEL_FRAME_HEIGHT,
  ADD_LABEL_FRAME_WIDTH,
} from '@/config/constants';
import { hooks } from '@/config/queryClient';

import AddLabelForm from './AddLabelForm';
import DraggableLabel from './DraggableLabel';
import ImageFrame from './ImageFrame';

type PropsWrapper = {
  saveData: (l: Label[]) => void;
};

type Props = {
  saveData: (l: Label[]) => void;
  isDragging: boolean;
  setIsDragging: (b: boolean) => void;
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

const AddLabelWithinFrame = ({
  saveData,
  isDragging,
  setIsDragging,
}: Props): JSX.Element => {
  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const labels = settingsData?.[0]?.data.labels || [];

  const { instance } = useControls();
  const { permission } = useLocalContext();
  const [openForm, setOpenForm] = useState(false);
  const [labelText, setLabelText] = useState('');
  const [formPosition, setFormPosition] = useState({
    y: 0,
    x: 0,
  });

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
      saveData(newLabelGroups);
    } else {
      const id = v4();
      const p = {
        y: (formPosition.y - positionY) / scale,
        x: (formPosition.x - positionX) / scale,
      };
      const newLabel = { ...p, id, content: labelText };
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

  const onStop = (
    position: { x: number; y: number },
    labelId: string,
  ): void => {
    const labelInd = labels.findIndex(({ id }) => id === labelId);
    if (labelInd > -1) {
      const label = labels[labelInd];
      const newLabel = { ...label, ...position };
      const newLabelGroups = [
        ...labels.slice(0, labelInd),
        newLabel,
        ...labels.slice(labelInd + 1),
      ];
      saveData(newLabelGroups);
    }
  };

  const deleteLabel = (labelId: string): void => {
    const filteredLabels = labels.filter(({ id }) => labelId !== id);
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
        height: ADD_LABEL_FRAME_HEIGHT,
        width: ADD_LABEL_FRAME_WIDTH,
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
      <ImageFrame />
      <Container onClick={handleAddLabel}>
        {labels.map((ele) => (
          <DraggableLabel
            key={ele.id}
            label={ele}
            onStop={onStop}
            deleteLabel={deleteLabel}
            editLabel={editLabel}
            scale={scale}
            setIsDragging={setIsDragging}
          />
        ))}
      </Container>
    </Box>
  );
};

const AddLabelWithinFrameWrapper = ({
  saveData,
}: PropsWrapper): JSX.Element => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <TransformContainer
      doubleClick={{ disabled: true }}
      centerOnInit
      panning={{ disabled: isDragging }}
      pinch={{ disabled: isDragging }}
      wheel={{ disabled: isDragging }}
      zoomAnimation={{ disabled: isDragging }}
      alignmentAnimation={{ disabled: isDragging }}
      velocityAnimation={{ disabled: isDragging }}
    >
      <TransformComponent
        wrapperStyle={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <AddLabelWithinFrame
          saveData={saveData}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
        />
      </TransformComponent>
    </TransformContainer>
  );
};
export default AddLabelWithinFrameWrapper;
