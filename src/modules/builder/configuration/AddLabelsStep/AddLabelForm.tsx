import React, { useContext } from 'react';
import { KeepScale } from 'react-zoom-pan-pinch';

import { CloseRounded } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
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
      }}
      gap={1}
    >
      <KeepScale
        style={{
          background: 'black',
          opacity: '0.8',
          padding: 8,
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
              '&:hover': {
                background: 'black',
                color: 'white',
              },
            }}
            onClick={onClose}
          >
            <CloseRounded />
          </IconButton>
          <Box display="flex" alignItems="center">
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
                outline: `1px solid ${theme.palette.primary.main}`,
              }}
            >
              <AddIcon sx={{ color: 'white' }} />
            </IconButton>
            {labelToDelete && (
              <IconButton
                onClick={() => {
                  deleteLabel(labelToDelete.id);
                  onClose();
                }}
                sx={{
                  outline: `1px solid ${theme.palette.primary.main}`,
                  borderRadius: 0,
                  boxSizing: 'border-box',
                }}
              >
                <DeleteIcon color="primary" sx={{ color: 'white' }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </KeepScale>
    </Stack>
  );
};
export default AddLabelForm;
