import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from '@mui/material';

import { formatDate } from '@graasp/sdk';

import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { Settings, SettingsKeys, SubmittedAnswer } from '@/@types';
import i18n, { useAppTranslation } from '@/config/i18n';
import { hooks } from '@/config/queryClient';
import { APP } from '@/langs/constants';
import Loader from '@/modules/common/Loader';

import ResultRow from './ResultRow';

const BuilderResults = (): JSX.Element => {
  const { t } = useAppTranslation();
  const {
    data: appData,
    isLoading: isDataLoading,
    isError,
  } = hooks.useAppData<{
    answers: SubmittedAnswer[];
  }>();

  const { data: appSetting, isLoading: isSettingsLoading } =
    hooks.useAppSettings<Settings>({
      name: SettingsKeys.SettingsData,
    });

  if (appData?.length && appSetting?.length) {
    const actionsOrdersByCreatedDate = orderBy(appData, 'createdAt');
    const actionsByMember = groupBy(actionsOrdersByCreatedDate, 'account.id');

    const labels = appSetting?.[0]?.data.labels.reduce(
      (prev: { [k: string]: string }, curr) => ({
        ...prev,
        [curr.id]: curr.content,
      }),
      {},
    );

    const data = Object.values(actionsByMember);

    const results = data
      ?.map((ele) => {
        const lastAnswer = ele[ele.length - 1];
        const correctAnswers = lastAnswer.data.answers.reduce(
          (acc, curr) => acc + Number(curr?.actualId === curr.expectedId),
          0,
        );
        const answers = lastAnswer.data.answers.map((a) => ({
          expected: labels?.[a.expectedId as string] || '',
          actual: labels?.[a.actualId as string] || t(APP.NO_ANSWER),
        }));

        return {
          id: lastAnswer.id,
          name: lastAnswer.account.name,
          totalAttempts: ele.length,
          currentGrade: `${correctAnswers}/${lastAnswer.data.answers.length}`,
          lastAttempt: formatDate(lastAnswer.createdAt, {
            locale: i18n.language,
          }),
          answers,
        };
      })
      .toSorted(({ name: name1 }, { name: name2 }) =>
        name1.toLowerCase() > name2.toLowerCase() ? 1 : -1,
      );

    if (results.length) {
      return (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableCell />
              <TableCell>{t(APP.RESULTS_TABLE_HEAD_USER_TITLE)}</TableCell>
              <TableCell>
                {t(APP.RESULTS_TABLE_HEAD_TOTAL_ATTEMPTS_TITLE)}
              </TableCell>
              <TableCell>
                {t(APP.RESULTS_TABLE_HEAD_LAST_ATTEMPT_TITLE)}
              </TableCell>
              <TableCell>
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
    }
  }

  if (isError) {
    return <Alert severity="error">{t(APP.UNEXPECTED_ERROR)}</Alert>;
  }

  if (isDataLoading || isSettingsLoading) {
    return <Loader />;
  }

  return <Alert severity="info">{t(APP.NO_RESULT_DATA)}</Alert>;
};

export default BuilderResults;
