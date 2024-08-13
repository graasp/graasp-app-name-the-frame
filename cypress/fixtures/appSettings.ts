import { AppSetting } from '@graasp/sdk';

import { v4 } from 'uuid';

import { MEMBERS } from './members';
import { MOCK_SERVER_ITEM } from './mockItem';

type FileSettingsData = {
  fileUrl: string;
};

// x and y are relative to image size (percentage)
export type Position = { x: string; y: string };

export type Label = Position & {
  content: string;
  id: string;
};

type Settings = {
  description: string;
  labels?: Label[];
};
export const EMPTY_SETTING: AppSetting = {
  id: v4(),
  name: '',
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
    fileUrl: 'http://localhost:3000/app-items/app-settings/image.png',
  },
};
export const MOCK_SETTING_DATA: AppSetting & { data: Settings } = {
  ...EMPTY_SETTING,
  id: v4(),
  name: 'settings-data',
  data: {
    description: 'https://.pdf',
    // labels: [],
  },
};
