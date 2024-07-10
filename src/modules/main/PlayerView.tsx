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

import {
  Choice,
  DraggableLabelType,
  Label,
  Settings,
  SettingsKeys,
} from '@/@types';
import {
  ADD_LABEL_FRAME_HEIGHT,
  ANSWER_SUBMISSION_TYPE,
} from '@/config/constants';
import { useAppTranslation } from '@/config/i18n';
import { hooks, mutations } from '@/config/queryClient';
import { PLAYER_VIEW_CY } from '@/config/selectors';
import { APP } from '@/langs/constants';

import PlayerFrame from '../common/PlayerFrame';

type AnswerSubmissionShape = {
  key: string;
  labelId: string;
  studentAnswer: Choice[];
};

type LabelsChoicesObj = {
  allLabels: DraggableLabelType[];
  allChoices: Choice[];
};

const shapeData = ({
  imageDimension,
  appLabels,
  resetValue = true,
  answers,
}: {
  imageDimension: {
    width: number;
    height: number;
  };
  appLabels: Label[];
  resetValue?: boolean;
  answers: AnswerSubmissionShape[];
}): DraggableLabelType[] => {
  const wStart = 0;
  const hStart = ADD_LABEL_FRAME_HEIGHT - imageDimension.height;
  const unsolvedQuestions = answers.find(({ key }) => key === 'unsolved');

  const { allLabels, allChoices } = appLabels.reduce(
    (acc: LabelsChoicesObj, curr, index) => {
      const choices = resetValue
        ? []
        : answers.find(({ labelId }) => labelId === curr.id)?.studentAnswer ||
          [];
      const l = {
        labelId: curr.id,
        ind: index + 1,
        choices,
        x: `${((curr.x - wStart / 2) / imageDimension.width) * 100}%`,
        y: `${((curr.y - hStart / 2) / imageDimension.height) * 100}%`,
      };

      return {
        allLabels: [...acc.allLabels, l],
        allChoices: [...acc.allChoices, { id: curr.id, content: curr.content }],
      };
    },
    { allLabels: [], allChoices: [] },
  );

  const a = [
    {
      ind: 0,
      y: '0%',
      x: '0%',
      labelId: 'all-labels',
      choices: (!resetValue && unsolvedQuestions?.studentAnswer) || allChoices,
    },
    ...allLabels,
  ];
  return a;
};

const PlayerView = (): JSX.Element => {
  const { data: appContext } = hooks.useAppContext();
  const { data: appData } = hooks.useAppData();
  const { t } = useAppTranslation();
  const { data: appSettings, isLoading } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });
  const { data: image } = hooks.useAppSettings({
    name: SettingsKeys.File,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [labels, setLabels] = useState<DraggableLabelType[]>([]);

  const { mutate: saveAppData } = mutations.usePostAppData();

  const save = (): void => {
    const answers = labels.map((l) => {
      if (l.labelId === 'all-labels') {
        return {
          key: 'unsolved',
          studentAnswer: l.choices,
          labelId: l.labelId,
        };
      }
      return {
        labelId: l.labelId,
        studentAnswer: l.choices,
        key: 'solved',
      };
    });
    saveAppData({ data: { answers }, type: ANSWER_SUBMISSION_TYPE });
  };

  const answersAppData = appData?.filter(
    ({ type }) => type === ANSWER_SUBMISSION_TYPE,
  );
  const answers =
    answersAppData &&
    answersAppData?.[answersAppData.length - 1]?.data?.answers;
  const appLabels = appSettings?.[0]?.data.labels;

  const imageDimension = appSettings?.[0]?.data.imageDimension;

  useEffect(() => {
    if (imageDimension) {
      if (appLabels) {
        const allLabels = shapeData({
          imageDimension,
          appLabels,
          answers: (answers || []) as AnswerSubmissionShape[],
          resetValue: false,
        });
        setLabels(allLabels);
      }
    }
    if (answers) {
      setIsSubmitted(true);
    }
  }, [answers, appLabels, imageDimension]);

  const retry = (): void => {
    if (imageDimension) {
      if (appLabels) {
        const allLabels = shapeData({ imageDimension, appLabels, answers: [] });
        setLabels(allLabels);
      }
    }
    setIsSubmitted(false);
  };

  if (appSettings?.length && image) {
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
            />
            <Stack
              direction="row"
              gap={1}
              width="100%"
              justifyContent="flex-end"
            >
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
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return <Alert severity="error">{t(APP.UNCONFIGURED_ITEM)}</Alert>;
};

export default PlayerView;
