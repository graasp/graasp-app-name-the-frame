import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

import { useAppTranslation } from '@/config/i18n';
import { ANSWERS_TABLE_CLASSNAME } from '@/config/selectors';
import { APP } from '@/langs/constants';

type Answer = {
  expected: string;
  actual: string;
};

const AnswersTable = ({ answers }: { answers: Answer[] }): JSX.Element => {
  const { t } = useAppTranslation();

  return (
    <Table
      className={ANSWERS_TABLE_CLASSNAME}
      size="small"
      aria-label="answers"
    >
      <TableHead>
        <TableRow>
          <TableCell align="left">
            {t(APP.RESULTS_TABLE_HEAD_EXPECTED_ANSWER_TITLE)}
          </TableCell>
          <TableCell align="left">
            {t(APP.RESULTS_TABLE_HEAD_ACTUAL_ANSWER_TITLE)}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {answers.map((answer, idx) => (
          <TableRow key={idx}>
            <TableCell align="left">{answer.expected}</TableCell>
            <TableCell align="left">{answer.actual}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AnswersTable;
