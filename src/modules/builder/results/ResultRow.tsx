import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';

import AnswersTable from './AnswersTable';

type Answer = {
  expected: string;
  actual: string;
};

type Props = {
  result: {
    id: string;
    user: string;
    lastAttempt: string;
    currentGrade: string;
    totalAttempts: number;
    answers: Answer[];
  };
};

const ResultRow = ({ result }: Props): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {result.user}
        </TableCell>
        <TableCell align="center">{result.totalAttempts}</TableCell>
        <TableCell align="center">{result.lastAttempt}</TableCell>
        <TableCell align="center">{result.currentGrade}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <AnswersTable answers={result.answers} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ResultRow;
