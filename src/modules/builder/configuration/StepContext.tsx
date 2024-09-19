import {
  Dispatch,
  createContext,
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
};

const StepContext = createContext<StepContextType>({
  activeStep: 0,
  setActiveStep: () => {},
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

  const value = useMemo(() => ({ activeStep, setActiveStep }), [activeStep]);

  if (isLoading) {
    return <Loader />;
  }

  return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
};

export const useStepContext = (): StepContextType => useContext(StepContext);

export default StepProvider;
