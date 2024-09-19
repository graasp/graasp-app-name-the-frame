import { Settings, SettingsKeys } from '@/@types';
import { hooks, mutations } from '@/config/queryClient';

// mapping between Setting names and their data type
// eslint-disable-next-line @typescript-eslint/ban-types
type AllSettingsType = {
  [SettingsKeys.Settings]: Settings;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [SettingsKeys.File]: any;
};
type AllSettingsNameType = SettingsKeys;
type AllSettingsDataType = AllSettingsType[keyof AllSettingsType];
export const saveSettings = (
  name: AllSettingsNameType,
  newValue: AllSettingsDataType,
): void => {
  const { mutate: postAppSetting } = mutations.usePostAppSetting();
  const { mutate: patchAppSetting } = mutations.usePatchAppSetting();
  const { data: appSettingsList } = hooks.useAppSettings();

  if (appSettingsList) {
    const previousSetting = appSettingsList.find((s) => s.name === name);
    // setting does not exist
    if (!previousSetting) {
      postAppSetting({
        data: newValue,
        name,
      });
    } else {
      patchAppSetting({
        id: previousSetting.id,
        data: newValue,
      });
    }
  }
};
