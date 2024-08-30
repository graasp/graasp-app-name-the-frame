import { AppItemExtra, ItemType } from '@graasp/sdk';

import { MEMBERS } from './members';

export const MOCK_SERVER_ITEM = {
  id: '123456789',
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
