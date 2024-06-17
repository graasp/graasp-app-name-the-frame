import React, { useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { DraggableLabel } from '@/@types';

import AddLabelForm from './AddLabelForm';
import ImageFrame from './ImageFrame';
import LabelPin from './LabelPin';

type Props = {
  isDragging: boolean;
  labels: DraggableLabel[];
  setLabels: (l: DraggableLabel[]) => void;
  imageSettingId: string;
};
const DraggableFrameWithLabels = ({
  isDragging,
  labels,
  setLabels,
  imageSettingId,
}: Props): JSX.Element => {
  const { permission } = useLocalContext();
  const imageRef = useRef<HTMLImageElement>(null);

  const [openForm, setOpenForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ top: '0%', left: '0%' });
  const [labelText, setLabelText] = useState('');

  const handleAddLabel = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ): void => {
    if (imageRef.current) {
      const { clientHeight, clientWidth } = imageRef.current;

      const target = event.target as HTMLImageElement;
      const rect = target.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      // get top and left relatively to image size
      setFormPosition({
        top: `${(clickY / clientHeight) * 100}%`,
        left: `${(clickX / clientWidth) * 100}%`,
      });
      setOpenForm(true);
    }
  };

  const handleFormSubmit = (): void => {
    const editingIndex = labels.findIndex(
      ({ top, left }) => top === formPosition.top && left === formPosition.left,
    );
    const isEditing = editingIndex > -1;
    // editing existing label
    if (isEditing) {
      const labelToEdit = labels[editingIndex];
      const newLabel = {
        ...labelToEdit,
        choices: [{ id: labelToEdit.labelId, content: labelText }],
      };

      const newLabelGroups = [
        ...labels.slice(0, editingIndex),
        newLabel,
        ...labels.slice(editingIndex + 1),
      ];
      setLabels(newLabelGroups);
    } else {
      // adding new label
      const labelId = v4();
      const newLabel = {
        id: labelId,
        content: labelText,
      };

      setLabels([
        ...labels,
        {
          ...formPosition,
          choices: [newLabel],
          ind: labels.length,
          labelId,
        },
      ]);
    }
    setOpenForm(false);
    setLabelText('');
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setLabelText(event.target.value);
  };

  const deleteLabel = (labelIdToDelete: string): void => {
    const filteredLabels = labels.filter(
      ({ labelId }) => labelId !== labelIdToDelete,
    );

    setLabels(filteredLabels);
  };

  const editLabel = (el: DraggableLabel): void => {
    // open form with label text to edit
    const { top, left, choices } = el;
    setFormPosition({ top, left });
    setOpenForm(true);
    setLabelText(choices?.[0].content);
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
          <ImageFrame
            appSettingId={imageSettingId}
            handleAddLabel={handleAddLabel}
            ref={imageRef}
          />
          {labels.map((label) => (
            <LabelPin
              key={label.ind}
              label={label}
              deleteLabel={deleteLabel}
              editLabel={editLabel}
            />
          ))}
        </TransformComponent>
      </TransformWrapper>
      {permission === PermissionLevel.Admin && openForm && (
        <AddLabelForm
          value={labelText}
          formPosition={formPosition}
          onChange={handleFormInputChange}
          onSubmit={handleFormSubmit}
          onClose={() => setOpenForm(false)}
        />
      )}
    </Box>
  );
};

export default DraggableFrameWithLabels;
