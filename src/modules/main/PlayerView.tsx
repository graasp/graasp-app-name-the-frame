import { useState } from 'react';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';

import orderBy from 'lodash.orderby';

import {
  AnsweredLabel,
  AppDataType,
  Label,
  Settings,
  SettingsKeys,
  SubmittedAnswer,
} from '@/@types';
import { useAppTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import {
  PLAYER_VIEW_CY,
  UNCONFIGURED_PLAYER_ALERT_ID,
} from '@/config/selectors';
import { APP } from '@/langs/constants';

import PlayerFrame from '../common/PlayerFrame';

const PlayerView = (): JSX.Element => {
  // show correction
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: appContext } = hooks.useAppContext();
  const { t } = useAppTranslation();
  const { data: appData } = hooks.useAppData<{ answers: SubmittedAnswer[] }>();
  const { data: appSettings, isLoading } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.Settings,
  });
  const { mutate: saveAppData } = mutations.usePostAppData();

  const { data: image } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });

  const answersAppData = appData?.filter(
    ({ type }) => type === AppDataType.Answers,
  );
  // we only have one data settings
  const settingLabels = appSettings?.[0]?.data?.labels;
  const answersOrdersByCreatedDate = orderBy(answersAppData, 'createdAt');
  const lastAnswerAppData =
    answersOrdersByCreatedDate?.[answersOrdersByCreatedDate.length - 1];
  const answers = lastAnswerAppData?.data?.answers;

  const lastSubmittedAnsweredLabels = settingLabels?.map((s) => {
    const actualId = answers?.find(
      ({ expectedId }) => expectedId === s.id,
    )?.actualId;
    return {
      expected: s,
      actual: actualId
        ? (settingLabels.find(({ id }) => id === actualId) ?? null)
        : null,
    };
  });

  const retry = (): void => {
    if (settingLabels) {
      const submittedAnswers = settingLabels.map((label) => ({
        expectedId: label,
        actualId: null,
      }));
      saveAppData({
        data: { answers: submittedAnswers },
        type: AppDataType.Answers,
      });
    }
    setIsSubmitted(false);
  };

  const submit = (): void => {
    setIsSubmitted(true);
  };

  let answeredLabels: AnsweredLabel[] = [];
  let labels: Label[] = [];
  if (settingLabels) {
    if (lastSubmittedAnsweredLabels) {
      answeredLabels = lastSubmittedAnsweredLabels;
      labels = settingLabels.filter(
        ({ id }) =>
          !lastSubmittedAnsweredLabels.find(({ actual }) => actual?.id === id),
      );
    } else {
      const answered = settingLabels.map((label) => ({
        expected: label,
        actual: null,
      }));

      answeredLabels = answered;
      labels = settingLabels;
    }
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!image || !settingLabels) {
    return (
      <Alert severity="error" id={UNCONFIGURED_PLAYER_ALERT_ID}>
        {t(APP.UNCONFIGURED_ITEM)}
      </Alert>
    );
  }

  const onLabelMoved = (
    newLabels: Label[],
    newAnswers: AnsweredLabel[],
  ): void => {
    const submittedAnswers = newAnswers.map(({ expected, actual }) => ({
      expectedId: expected.id,
      actualId: actual?.id,
    }));

    saveAppData({
      data: { answers: submittedAnswers },
      type: AppDataType.Answers,
    });
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
          <Stack direction="row" gap={1}>
            <Button onClick={retry}>{t(APP.RETRY)}</Button>
            <Button
              onClick={submit}
              variant="contained"
              sx={{ height: 'fit-content' }}
              disabled={isSubmitted}
            >
              {t(APP.SUBMIT)}
            </Button>
          </Stack>
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
