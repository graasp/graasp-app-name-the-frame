import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse, IconButton, TableCell, TableRow } from '@mui/material';

import { Result } from '@/@types';
import { RESULT_ROW_MEMBER_CLASSNAME } from '@/config/selectors';

import AnswersTable from './AnswersTable';

type Props = {
  result: Result;
};

const ResultRow = ({ result }: Props): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        className={RESULT_ROW_MEMBER_CLASSNAME}
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell scope="row">{result.name}</TableCell>
        <TableCell>{result.totalAttempts}</TableCell>
        <TableCell>{result.lastAttempt}</TableCell>
        <TableCell>{result.currentGrade}</TableCell>
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
