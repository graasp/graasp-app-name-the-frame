import React, { useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { Box } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import { TipGroup } from '@/@types';

import AddLabelForm from './AddLabelForm';
import ImageFrame from './ImageFrame';
import LabelPin from './LabelPin';

type Props = {
  isDragging: boolean;
  labelGroups: TipGroup[];
  setLabelGroups: (l: TipGroup[]) => void;
  imageSettingId: string;
};
const DraggableFrameWithLabels = ({
  isDragging,
  labelGroups,
  setLabelGroups,
  imageSettingId,
}: Props): JSX.Element => {
  const [openForm, setOpenForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ top: '0%', left: '0%' });
  const { permission } = useLocalContext();

  const [formInput, setFormInput] = useState('');
  const imageRef = useRef<HTMLImageElement>(null);

  const handleAddPin = (
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
    const labelId = `tip-${Date.now()}`;
    const newTip = {
      id: labelId,
      content: formInput,
    };

    const [firstGroup] = labelGroups;
    const modFirstGroup = {
      ...firstGroup,
      choices: [...(firstGroup?.choices || []), newTip],
    };

    setLabelGroups([
      modFirstGroup,
      ...labelGroups.slice(1),
      { ...formPosition, choices: [], ind: labelGroups.length, labelId },
    ]);
    setOpenForm(false);
    setFormInput('');
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setFormInput(event.target.value);
  };

  return (
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
        <Box sx={{ position: 'relative' }}>
          <ImageFrame
            appSettingId={imageSettingId}
            handleAddPin={handleAddPin}
            ref={imageRef}
          />
          {labelGroups.slice(1).map((el) => (
            <LabelPin
              key={el.ind}
              el={el}
              // deleteLabel={deleteLabel}
              // editLabel={editLabel}
              // imageSize={{
              //   clientHeight: imageRef.current?.clientHeight || 0,
              //   clientWidth: imageRef.current?.clientWidth || 0,
              // }}
            />
          ))}
        </Box>
        {permission === 'admin' && openForm && (
          <AddLabelForm
            value={formInput}
            formPosition={formPosition}
            onChange={handleFormInputChange}
            onSubmit={handleFormSubmit}
            onClose={() => setOpenForm(false)}
          />
        )}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default DraggableFrameWithLabels;
