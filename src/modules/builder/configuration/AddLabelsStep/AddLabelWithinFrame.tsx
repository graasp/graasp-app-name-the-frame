import { useContext, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Alert, Box, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { Label } from '@/@types';
import {
  ADD_LABEL_FRAME_HEIGHT,
  ADD_LABEL_FRAME_WIDTH,
} from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';
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
  const { labels, isDragging, setOpenForm, saveLabelsChanges, openForm } =
    useContext(LabelsContext);

  const { permission } = useLocalContext();
  const [content, setContent] = useState('');
  const [labelToEdit, setLabelToEdit] = useState<Label | null>(null);
  const [formPosition, setFormPosition] = useState({
    y: 0,
    x: 0,
  });

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setContent(event.target.value);
  };

  const handleShowLabelForm = (show: boolean): void => {
    setOpenForm(show);
    setContent('');
    setLabelToEdit(null);
  };

  const handleFormSubmit = (): void => {
    if (labelToEdit) {
      const newLabel = {
        ...labelToEdit,
        content,
      };
      saveLabelsChanges(newLabel);
    } else {
      const id = v4();
      const p = {
        y: formPosition.y,
        x: formPosition.x,
      };
      const newLabel = { ...p, id, content };
      saveLabelsChanges(newLabel);
    }
    handleShowLabelForm(false);
  };

  const showLabelForm = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ): void => {
    if (!isDragging) {
      const { offsetX, offsetY } = event.nativeEvent;
      setFormPosition({
        y: offsetY,
        x: offsetX,
      });
      setOpenForm(true);
      setLabelToEdit(null);
      setContent('');
    }
  };

  const showEditForm = (label: Label): void => {
    setLabelToEdit(label);
    const { x, y, content: c } = label;
    setFormPosition({
      y,
      x,
    });

    setOpenForm(true);
    setContent(c);
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
          position={formPosition}
          onChange={handleFormInputChange}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenForm(false)}
          labelToDelete={labelToEdit}
        />
      )}
      <ImageFrame />
      <Container onClick={showLabelForm} sx={{ cursor: 'crosshair' }}>
        {labels.map((ele) => (
          <DraggableLabel
            key={ele.id}
            label={ele}
            showEditForm={showEditForm}
          />
        ))}
      </Container>
    </Box>
  );
};

const AddLabelWithinFrameWrapper = (): JSX.Element => {
  const { t } = useAppTranslation();

  const { isDragging, openForm, labels } = useContext(LabelsContext);
  const disabled = isDragging || openForm;

  return (
    <Box sx={{ position: 'relative' }}>
      {labels.length === 0 && (
        <Alert severity="info">{t(APP.START_ADDING_LABEL_HELPER_TEXT)}</Alert>
      )}

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
    </Box>
  );
};
export default AddLabelWithinFrameWrapper;
