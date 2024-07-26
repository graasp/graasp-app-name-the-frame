import { styled } from '@mui/material';

import { hooks } from '@/config/queryClient';

type Props = {
  appSettingId: string;
};
const Container = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
}));

const ImageFrame = ({ appSettingId }: Props): JSX.Element | null => {
  const { data: dataFile } = hooks.useAppSettingFile({
    appSettingId,
  });

  return dataFile ? (
    <Container>
      <img
        src={URL.createObjectURL(dataFile)}
        alt="frame"
        style={{
          maxWidth: '100%',
          objectFit: 'cover',
          pointerEvents: 'auto',
          cursor: 'cell',
        }}
      />
    </Container>
  ) : null;
};

export default ImageFrame;
