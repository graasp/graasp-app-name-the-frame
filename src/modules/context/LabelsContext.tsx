import { FC, ReactElement, createContext, useMemo, useState } from 'react';

import { Label, Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';

const defaultContextValue = {
  labels: [],
  deleteLabel: () => {},
  saveLabelsChanges: () => {},
  isDragging: false,
  setIsDragging: () => {},
  openForm: false,
  setOpenForm: () => {},
};

export type SettingsContextType = {
  labels: Label[];
  deleteLabel: (lID: string) => void;
  saveLabelsChanges: (idx: number, newLabel: Label) => void;
  isDragging: boolean;
  setIsDragging: (b: boolean) => void;
  openForm: boolean;
  setOpenForm: (b: boolean) => void;
};
export const LabelsContext =
  createContext<SettingsContextType>(defaultContextValue);

type Prop = {
  children: ReactElement | ReactElement[];
};

export const LabelsProvider: FC<Prop> = ({ children }) => {
  const { data: settingsData } = hooks.useAppSettings<Settings>({
    name: SettingsKeys.SettingsData,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const { mutate: patchSetting } = mutations.usePatchAppSetting();
  const labels = settingsData?.[0]?.data.labels || [];

  const saveData = (l: Label[]): void => {
    if (settingsData) {
      const data = { ...settingsData?.[0]?.data, labels: l };
      patchSetting({ id: settingsData?.[0]?.id, data });
    }
  };

  const deleteLabel = (labelId: string): void => {
    const filteredLabels = labels.filter(({ id }) => labelId !== id);
    saveData(filteredLabels);
  };

  const saveLabelsChanges = (editingIndex: number, newLabel: Label): void => {
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

  const value = useMemo(
    () => ({
      labels,
      deleteLabel,
      saveLabelsChanges,
      isDragging,
      setIsDragging,
      openForm,
      setOpenForm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labels, isDragging, openForm],
  );

  return (
    <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>
  );
};
