import { createContext, useMemo, useState } from 'react';

import { Label, Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';

const defaultContextValue = {
  labels: [],
  deleteLabel: () => {},
  saveLabelsChanges: () => {},
  isDragging: false,
  setIsDragging: () => {},
};

export type SettingsContextType = {
  labels: Label[];
  deleteLabel: (lID: string) => void;
  saveLabelsChanges: (newLabel: Label) => void;
  isDragging: boolean;
  setIsDragging: (b: boolean) => void;
};

export const LabelsContext =
  createContext<SettingsContextType>(defaultContextValue);

type Props = {
  children: JSX.Element;
};

export const LabelsProvider = ({ children }: Props): JSX.Element => {
  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [isDragging, setIsDragging] = useState(false);

  const { mutate: patchSetting } = mutations.usePatchAppSetting();

  const value = useMemo(() => {
    const labels = settingsData?.[0]?.data?.labels || [];

    const saveData = (l: Label[]): void => {
      if (settingsData) {
        const data = {
          ...settingsData?.[0]?.data,
          labels: l,
        };
        patchSetting({ id: settingsData?.[0]?.id, data });
      }
    };

    const deleteLabel = (labelId: string): void => {
      const filteredLabels = labels.filter(({ id }) => labelId !== id);
      saveData(filteredLabels);
    };

    const saveLabelsChanges = (newLabel: Label): void => {
      const editingIndex = labels.findIndex(({ id }) => id === newLabel.id);
      if (editingIndex > -1) {
        const newLabelGroups = [
          ...labels.slice(0, editingIndex),
          newLabel,
          ...labels.slice(editingIndex + 1),
        ];
        saveData(newLabelGroups);
      } else {
        saveData([...labels, newLabel]);
      }
    };
    return {
      labels,
      deleteLabel,
      saveLabelsChanges,
      isDragging,
      setIsDragging,
    };
  }, [isDragging, patchSetting, settingsData]);

  return (
    <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
  );
};
