import React from 'react';

import { CloseRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, TextField } from '@mui/material';

type Props = {
  formPosition: { top: string; left: string };
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
}: Props): JSX.Element => (
  <Stack
    sx={{
      position: 'absolute',
      top: formPosition.top,
      left: formPosition.left,
      background: 'black',
      opacity: '0.8',
      p: 1,
      borderRadius: 2,
    }}
    gap={1}
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
          Add
        </Button>
      </Box>
    </Box>
  </Stack>
);

export default AddLabelForm;
