import { useEffect, useState } from 'react';

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

import { Result, Settings, SettingsKeys, SubmittedAnswer } from '@/@types';
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

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (!appData || !appSetting) return;

    const actionsOrdersByCreatedDate = orderBy(appData, 'createdAt');
    const actionsByMember = groupBy(actionsOrdersByCreatedDate, 'member.id');
    const settings = appSetting?.[0];

    const labels = settings?.data.labels.reduce(
      (prev: { [k: string]: string }, curr) => ({
        ...prev,
        [curr.id]: curr.content,
      }),
      {},
    );

    const data = Object.values(actionsByMember);

    const calculatedData = data?.map((ele) => {
      const lastAnswer = ele[ele.length - 1];
      const correctAnswers = lastAnswer.data.answers.reduce(
        (acc, curr) => acc + Number(curr?.actualId === curr.expectedId),
        0,
      );
      const answers = lastAnswer.data.answers.map((a) => ({
        expected: labels?.[a.expectedId as string] || '',
        actual: labels?.[a.actualId as string] || 'No answer',
      }));

      return {
        id: lastAnswer.id,
        user: lastAnswer.member.name,
        totalAttempts: ele.length,
        currentGrade: `${correctAnswers}/${lastAnswer.data.answers.length}`,
        lastAttempt: formatDate(lastAnswer.createdAt, {
          locale: i18n.language,
        }),
        answers,
      };
    });

    setResults(calculatedData);
  }, [appData, appSetting]);

  if (results.length) {
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
