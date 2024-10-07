import { AppItemExtra, ItemType } from '@graasp/sdk';

import { MEMBERS } from './members';

export const MOCK_SERVER_ITEM = {
  id: '7f165691-6fa8-4712-b4b8-63aa0fdf91ed',
  name: 'app-starter-ts-vite',
  displayName: 'app-starter-ts-vite',
  description: null,
  path: '',
  settings: {},
  creator: MEMBERS[0],
  createdAt: '2024-12-07',
  updatedAt: '2024-12-07',
  type: ItemType.APP,
  extra: {} as AppItemExtra,
  lang: 'en',
};
