import {
  Dispatch,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Loader } from '@graasp/ui';

import { Settings, SettingsKeys } from '@/@types';
import { hooks } from '@/config/queryClient';

type StepContextType = {
  activeStep: number;
  setActiveStep: Dispatch<number>;
  goToNextStep: () => void;
  goToPrevStep: () => void;
};

const StepContext = createContext<StepContextType>({
  activeStep: 0,
  setActiveStep: () => {},
  goToNextStep: () => {},
  goToPrevStep: () => {},
});

type Props = {
  children: JSX.Element;
};

const StepProvider = ({ children }: Props): JSX.Element => {
  const [activeStep, setActiveStep] = useState(0);
  const {
    data: settings,
    isSuccess,
    isLoading,
  } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.Settings,
  });

  const [initialSetRef, setInitialSetRef] = useState(false);

  useEffect(() => {
    // move to preview step in case all was settled, using Ref to move only within first render, So If i change sth with second step I don't want to move to preview immediately
    if (!initialSetRef && isSuccess && settings?.[0]?.data?.labels) {
      setActiveStep(2);
      setInitialSetRef(true);
    }
  }, [settings, isSuccess, initialSetRef, setInitialSetRef]);

  const goToNextStep = useCallback((): void => {
    setActiveStep(activeStep + 1);
  }, [setActiveStep, activeStep]);

  const goToPrevStep = useCallback((): void => {
    setActiveStep(activeStep - 1);
  }, [setActiveStep, activeStep]);

  const value = useMemo(
    () => ({ goToNextStep, activeStep, goToPrevStep, setActiveStep }),
    [activeStep, goToNextStep, goToPrevStep],
  );

  if (isLoading) {
    return <Loader />;
  }

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};

export const useStepContext = (): StepContextType => useContext(StepContext);

export default StepProvider;
