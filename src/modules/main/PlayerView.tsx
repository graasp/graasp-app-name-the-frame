import { useEffect, useState } from 'react';

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
import { ANSWER_SUBMISSION_TYPE } from '@/config/constants';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const answersAppData = appData?.filter(
    ({ type }) => type === ANSWER_SUBMISSION_TYPE,
  );
  const settingLabels = appSettings?.[0].data.labels;
  const lastVersion = answersAppData?.[answersAppData.length - 1];
  const answers = lastVersion?.data.answers;

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

  const save = (): void => {
    const submittedAnswers = answeredLabels.map(({ expected, actual }) => ({
      expectedId: expected.id,
      actualId: actual?.id,
    }));
    saveAppData({
      data: { answers: submittedAnswers },
      type: ANSWER_SUBMISSION_TYPE,
    });
  };

  useEffect(() => {
    if (settingLabels) {
      if (answers) {
        const answered = answers?.map(
          ({ expectedId, actualId }: SubmittedAnswer) => ({
            expected: settingLabels.find(
              ({ id }) => id === expectedId,
            ) as Label,
            actual: settingLabels.find(({ id }) => id === actualId) || null,
          }),
        );

        setAnsweredLabels(answered);
        setLabels(
          settingLabels.filter(
            ({ id }) =>
              !answers.find(({ actualId }: SubmittedAnswer) => actualId === id),
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
    }
  }, [answers, settingLabels]);

  useEffect(() => {
    const answered = answers?.map(
      ({ expectedId, actualId }: SubmittedAnswer) => ({
        expected: settingLabels?.find(({ id }) => id === expectedId) as Label,
        actual: settingLabels?.find(({ id }) => id === actualId) || null,
      }),
    );
    setIsSubmitted(isEqual(answeredLabels, answered));
  }, [answeredLabels, answers, settingLabels]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!image || !settingLabels) {
    return <Alert severity="error">{t(APP.UNCONFIGURED_ITEM)}</Alert>;
  }

  return (
    <Box data-cy={PLAYER_VIEW_CY}>
      <Container>
        <Stack spacing={2} padding={2}>
          <Box className="KKK">
            <Typography variant="h5" fontWeight="bold">
              {appContext?.item.name}
            </Typography>
            <Typography variant="body1">
              {appSettings?.[0]?.data.description}
            </Typography>
          </Box>
          <PlayerFrame
            labels={labels}
            setLabels={setLabels}
            isSubmitted={isSubmitted}
            answeredLabels={answeredLabels}
            setAnsweredLabels={setAnsweredLabels}
          />
          <Stack direction="row" gap={1} width="100%" justifyContent="flex-end">
            {answersAppData && answersAppData.length > 0 && (
              <Button size="large" onClick={retry}>
                {t(APP.RETRY)}
              </Button>
            )}
            <Button size="large" onClick={save} variant="contained">
              {t(APP.SAVE)}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};
export default PlayerView;
