import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
};

const ImageFrame = ({ appSettingId }: Props): JSX.Element | null => {
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
    />
  ) : null;
};

export default ImageFrame;
