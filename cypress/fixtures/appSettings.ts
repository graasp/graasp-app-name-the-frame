import { AppSetting } from '@graasp/sdk';

import { v4 } from 'uuid';

import { FileSettings, Settings, SettingsKeys } from '@/@types';

import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

const EMPTY_SETTING: Pick<
  AppSetting,
  'item' | 'creator' | 'createdAt' | 'updatedAt'
> = {
  item: MOCK_SERVER_ITEM,
  creator: MEMBERS.ANNA,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_SETTING_DATA: AppSetting & { data: Settings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: SettingsKeys.SettingsData,
  data: {
    description: 'item description',
    labels: [],
  },
};

const mockFileSettingId = v4();
export const MOCK_FILE_APP_SETTING: AppSetting & { data: FileSettings } = {
  ...EMPTY_SETTING,
  id: mockFileSettingId,
  name: SettingsKeys.File,
  data: {
    path: `apps/app-setting/${EMPTY_SETTING.item.id}/${mockFileSettingId}`,
  },
};

export const MOCK_SETTING_DATA_WITH_LABELS: AppSetting & { data: Settings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: SettingsKeys.SettingsData,
  data: {
    description: 'Drag and drop colors within the right place',
    labels: [
      { id: v4(), content: 'red', x: '20%', y: '80%' },
      { id: v4(), content: 'green', x: '10%', y: '20%' },
      { id: v4(), content: 'yellow', x: '80%', y: '30%' },
      { id: v4(), content: 'blue', x: '50%', y: '50%' },
      { id: v4(), content: 'white', x: '60%', y: '40%' },
    ],
  },
};
