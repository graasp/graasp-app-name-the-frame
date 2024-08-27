import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';

import isEqual from 'lodash.isequal';

import { AnsweredLabel, Label, Settings, SettingsKeys } from '@/@types';
import { ANSWERS_SUBMISSION_TYPE } from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import { APP } from '@/langs/constants';

import PlayerFrame from '../common/PlayerFrame';

type SubmittedAnswer = {
  expectedId: string;
  actualId?: string;
};

const PlayerView = (): JSX.Element => {
  const { data: appContext } = hooks.useAppContext();
  const { t } = useAppTranslation();
  const { data: appData } = hooks.useAppData<{ answers: SubmittedAnswer[] }>();
  const { data: appSettings, isLoading } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });
  const { mutate: saveAppData } = mutations.usePostAppData();
  const [answeredLabels, setAnsweredLabels] = useState<AnsweredLabel[]>([]);
  // labels will be null only before setting the state as we cannot render all labels within container if not settled yet
  const [labels, setLabels] = useState<null | Label[]>(null);

  const { data: image } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const answersAppData = appData?.filter(
    ({ type }) => type === ANSWERS_SUBMISSION_TYPE,
  );
  const settingLabels = appSettings?.[0].data.labels;
  const lastAnswerAppData = answersAppData?.[answersAppData.length - 1];
  const answers = lastAnswerAppData?.data.answers;

  const retry = (): void => {
    if (settingLabels) {
      const answered = settingLabels?.map((label) => ({
        expected: label,
        actual: null,
      }));

      setAnsweredLabels(answered);
      setLabels(settingLabels);
    }
  };

  const submit = (): void => {
    const submittedAnswers = answeredLabels.map(({ expected, actual }) => ({
      expectedId: expected.id,
      actualId: actual?.id,
    }));
    saveAppData({
      data: { answers: submittedAnswers },
      type: ANSWERS_SUBMISSION_TYPE,
    });
  };

  const lastSubmittedAnsweredLabels = useMemo(
    () =>
      answers?.map(({ expectedId, actualId }: SubmittedAnswer) => ({
        expected: settingLabels?.find(({ id }) => id === expectedId) as Label,
        actual: settingLabels?.find(({ id }) => id === actualId) || null,
      })),
    [answers, settingLabels],
  );

  useEffect(() => {
    if (!settingLabels) {
      return;
    }
    if (lastSubmittedAnsweredLabels) {
      setAnsweredLabels(lastSubmittedAnsweredLabels);
      setLabels(
        settingLabels.filter(
          ({ id }) =>
            !lastSubmittedAnsweredLabels.find(
              ({ actual }) => actual?.id === id,
            ),
        ),
      );
    } else {
      const answered = settingLabels.map((label) => ({
        expected: label,
        actual: null,
      }));

      setAnsweredLabels(answered);
      setLabels(settingLabels);
    }
  }, [lastSubmittedAnsweredLabels, settingLabels]);

  const isSubmitted = useMemo(
    () => isEqual(answeredLabels, lastSubmittedAnsweredLabels),
    [answeredLabels, lastSubmittedAnsweredLabels],
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!image || !settingLabels) {
    return <Alert severity="error">{t(APP.UNCONFIGURED_ITEM)}</Alert>;
  }

  const onLabelMoved = (
    newLabels: Label[],
    newAnswers: AnsweredLabel[],
  ): void => {
    setLabels(newLabels);
    setAnsweredLabels(newAnswers);
  };

  return (
    <Container data-cy={PLAYER_VIEW_CY}>
      <Stack spacing={2} padding={2}>
        <Stack justifyContent="space-between" flexDirection="row">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {appContext?.item.name}
            </Typography>
            {appSettings?.[0]?.data.description && (
              <Typography variant="body1">
                {appSettings?.[0]?.data.description}
              </Typography>
            )}
          </Box>
          {isSubmitted ? (
            answersAppData &&
            answersAppData.length > 0 && (
              <Button onClick={retry}>{t(APP.RETRY)}</Button>
            )
          ) : (
            <Button
              onClick={submit}
              variant="contained"
              sx={{ height: 'fit-content' }}
            >
              {t(APP.SUBMIT)}
            </Button>
          )}
        </Stack>
        <PlayerFrame
          labels={labels}
          isSubmitted={isSubmitted}
          answeredLabels={answeredLabels}
          onLabelMoved={onLabelMoved}
        />
      </Stack>
    </Container>
  );
};
export default PlayerView;
