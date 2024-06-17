/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

/* eslint-disable jsx-a11y/click-events-have-key-events */
import { forwardRef } from 'react';

import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
  handleAddPin: (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>,
    // d: { clientHeight: number; clientWidth: number },
  ) => void;
};
// eslint-disable-next-line react/display-name
const ImageFrame = forwardRef<HTMLImageElement, Props>(
  ({ appSettingId, handleAddPin }, imageRef) => {
    const { data: dataFile } = hooks.useAppSettingFile({
      appSettingId,
    });

    return dataFile ? (
      <img
        src={URL.createObjectURL(dataFile)}
        alt="frame"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'cover',
          pointerEvents: 'auto',
          cursor: 'cell',
        }}
        onClick={handleAddPin}
        ref={imageRef}
      />
    ) : null;
  },
);

export default ImageFrame;
