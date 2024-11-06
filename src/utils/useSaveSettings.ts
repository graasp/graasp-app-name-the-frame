import { Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';

// mapping between Setting names and their data type
type AllSettingsType = {
  [SettingsKeys.Settings]: Settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [SettingsKeys.File]: any;
};
type AllSettingsNameType = SettingsKeys;
type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];
export const useSaveSettings = (): {
  saveSettings: (
    name: AllSettingsNameType,
    newValue: AllSettingsDataType,
  ) => Promise<void>;
  isLoading: boolean;
} => {
  const { mutateAsync: postAppSetting, isLoading: isPostAppSettingLoading } =
    mutations.usePostAppSetting();
  const { mutateAsync: patchAppSetting, isLoading: isPatchAppSettingLoading } =
    mutations.usePatchAppSetting();
  const { data: appSettingsList } = hooks.useAppSettings();

  return {
    saveSettings: async (
      name: AllSettingsNameType,
      newValue: AllSettingsDataType,
    ) => {
      if (appSettingsList) {
        const previousSetting = appSettingsList.find((s) => s.name === name);
        // setting does not exist
        if (!previousSetting) {
          await postAppSetting({
            data: newValue,
            name,
          });
        } else {
          await patchAppSetting({
            id: previousSetting.id,
            data: newValue,
          });
        }
      }
    },
    isLoading: isPatchAppSettingLoading || isPostAppSettingLoading,
  };
};
