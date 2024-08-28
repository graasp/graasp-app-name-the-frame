import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { APP } from '@/langs/constants';

import ResultRow from './ResultRow';

const results = [
  {
    id: 'hh',
    user: 'lina',
    lastAttempt: '27/10/2024',
    currentGrade: '3/5',
    totalAttempts: 3,
    answers: [
      { expected: 'red', actual: 'blue' },
      { expected: 'blue', actual: 'red' },
    ],
  },
];

const BuilderResults = (): JSX.Element => {
  const { t } = useAppTranslation();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableCell />
          <TableCell>{t(APP.RESULTS_TABLE_HEAD_USER_TITLE)}</TableCell>
          <TableCell align="center">
            {t(APP.RESULTS_TABLE_HEAD_TOTAL_ATTEMPTS_TITLE)}
          </TableCell>
          <TableCell align="center">
            {t(APP.RESULTS_TABLE_HEAD_LAST_ATTEMPT_TITLE)}
          </TableCell>
          <TableCell align="center">
            {t(APP.RESULTS_TABLE_HEAD_CURRENT_GRADE_TITLE)}
          </TableCell>
        </TableHead>
        <TableBody>
          {results.map((r) => (
            <ResultRow key={r.id} result={r} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BuilderResults;
