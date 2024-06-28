import React from 'react';
import { KeepScale } from 'react-zoom-pan-pinch';

import { CloseRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';

type Props = {
  formPosition: { top: number; left: number };
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const AddLabelForm = ({
  formPosition,
  value,
  onChange,
  onSubmit,
  onClose,
}: Props): JSX.Element => {
  const { t } = useAppTranslation();

  return (
    <Stack
      sx={{
        position: 'absolute',

        zIndex: 500,
        top: formPosition.top,
        left: formPosition.left,
      }}
      gap={1}
    >
      <KeepScale
        style={{
          background: 'black',
          opacity: '0.8',
          padding: 8,
          borderRadius: 4,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            color="primary"
            sx={{
              position: 'absolute',
              top: -22,
              right: -8,
              padding: '2px',
              borderRadius: '50%',
              background: 'black',
            }}
            onClick={onClose}
          >
            <CloseRounded />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              autoFocus
              size="small"
              value={value}
              onChange={onChange}
              sx={{
                background: 'white',
                opacity: 1,
                border: 0,
                width: '15ch',
              }}
            />
            <Button size="small" variant="contained" onClick={onSubmit}>
              {t(APP.ADD)}
            </Button>
          </Box>
        </Box>
      </KeepScale>
    </Stack>
  );
};
export default AddLabelForm;
