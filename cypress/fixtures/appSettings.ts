import { AppSetting } from '@graasp/sdk';

import { v4 } from 'uuid';

import { Settings } from '@/@types';

import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

type FileSettingsData = {
  format: string;
};

export const EMPTY_SETTING: AppSetting = {
  id: v4(),
  name: 'new item',
  data: {},
  item: MOCK_SERVER_ITEM,
  creator: MEMBERS.ANNA,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const MOCK_FILE_SETTING: AppSetting & { data: FileSettingsData } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: 'file',
  data: {
    format: 'png',
  },
};
export const MOCK_SETTING_DATA: AppSetting & { data: Settings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: 'settings-data',
  data: {
    description: 'item description',
    labels: [],
  },
};

export const MOCK_SETTING_DATA_WITH_LABELS: AppSetting & { data: Settings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: 'settings-data',
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
