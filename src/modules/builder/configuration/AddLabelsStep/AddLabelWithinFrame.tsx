import { useContext, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Alert, Box, styled } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { Label, Position } from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { ADD_LABELS_IMAGE_CONTAINER_ID } from '@/config/selectors';
import { APP } from '@/langs/constants';
import { LabelsContext } from '@/modules/context/LabelsContext';
import { useImageDimensionsContext } from '@/modules/context/imageDimensionContext';

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
  const { labels, isDragging, saveLabelsChanges } = useContext(LabelsContext);
  const { permission } = useLocalContext();
  const [content, setContent] = useState('');
  const [labelToEdit, setLabelToEdit] = useState<Label | null>(null);
  const [formPosition, setFormPosition] = useState<null | Position>(null);

  const { dimension } = useImageDimensionsContext();

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setContent(event.target.value);
  };

  const handleShowLabelForm = (): void => {
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
    } else if (formPosition) {
      const id = v4();
      const newLabel = { ...formPosition, id, content };
      saveLabelsChanges(newLabel);
    }
    setFormPosition(null);

    handleShowLabelForm();
  };

  const showLabelForm = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ): void => {
    if (!isDragging) {
      const { offsetX, offsetY } = event.nativeEvent;
      setFormPosition({
        y: `${(offsetY / dimension.height) * 100}%`,
        x: `${(offsetX / dimension.width) * 100}%`,
      });
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

    setContent(c);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {permission === PermissionLevel.Admin && formPosition && !isDragging && (
        <AddLabelForm
          value={content}
          position={formPosition}
          onChange={handleFormInputChange}
          onSubmit={handleFormSubmit}
          onClose={() => setFormPosition(null)}
          labelToDelete={labelToEdit}
        />
      )}
      <ImageFrame />
      <Container
        onClick={showLabelForm}
        sx={{ cursor: 'crosshair' }}
        id={ADD_LABELS_IMAGE_CONTAINER_ID}
      >
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

  const { isDragging, labels } = useContext(LabelsContext);
  const disabled = isDragging;

  return (
    <Box sx={{ width: '100%' }}>
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
            width: '100%',
            maxHeight: '100%',
          }}
          contentStyle={{ width: '100%' }}
        >
          <AddLabelWithinFrame />
        </TransformComponent>
      </TransformContainer>
    </Box>
  );
};
export default AddLabelWithinFrameWrapper;
