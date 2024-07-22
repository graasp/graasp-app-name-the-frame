import React, { useContext } from 'react';

import { CloseRounded } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, Stack, TextField, useTheme } from '@mui/material';

import { Label, Position } from '@/@types';
import { LabelsContext } from '@/modules/context/LabelsContext';

type Props = {
  position: Position;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onClose: () => void;
  labelToDelete?: Label | null;
};

const AddLabelForm = ({
  position,
  value,
  onChange,
  onSubmit,
  onClose,
  labelToDelete,
}: Props): JSX.Element => {
  const theme = useTheme();
  const { deleteLabel } = useContext(LabelsContext);

  return (
    <Stack
      sx={{
        position: 'absolute',
        zIndex: 500,
        top: position.y,
        left: position.x,
        background: 'black',
        padding: 1,
      }}
      gap={1}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          color="primary"
          sx={{
            position: 'absolute',
            top: -26,
            right: -8,
            padding: '2px',
            borderRadius: '50%',
            color: 'white',
            background: 'black',
            '&:hover': {
              background: 'black',
              color: 'white',
            },
          }}
          onClick={onClose}
        >
          <CloseRounded />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          sx={{ border: `1px solid ${theme.palette.primary.main}` }}
        >
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
            multiline
          />
          <IconButton
            onClick={onSubmit}
            sx={{
              background: theme.palette.primary.main,
              borderRadius: 0,
            }}
          >
            <CheckIcon sx={{ color: 'white' }} />
          </IconButton>
          {labelToDelete && (
            <IconButton
              onClick={() => {
                deleteLabel(labelToDelete.id);
                onClose();
              }}
              sx={{ borderRadius: 0 }}
            >
              <DeleteIcon color="primary" sx={{ color: 'white' }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </Stack>
  );
};
export default AddLabelForm;
