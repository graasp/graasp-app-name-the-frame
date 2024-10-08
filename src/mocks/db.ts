import type { Database } from '@graasp/apps-query-client';
import {
  AppItemFactory,
  CompleteMember,
  DiscriminatedItem,
  ItemType,
  LocalContext,
  MemberFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { AppDataType, SettingsKeys } from '@/@types';
import { API_HOST } from '@/config/env';

export const mockMembers: CompleteMember[] = [
  MemberFactory({
    id: 'd3b90b7d-2bb4-4329-89b3-099bae00d582',
    name: 'current-member',
  }),
  MemberFactory(),
  MemberFactory(),
];

export const mockItem: DiscriminatedItem = AppItemFactory({
  id: 'd5356ad1-e42b-466f-b3a1-c559afaf1903',
  name: 'app-starter-ts-vite',
  extra: { [ItemType.APP]: { url: 'http://localhost:3002' } },
  creator: mockMembers[0],
});

export const defaultMockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'builder',
  itemId: mockItem.id,
  accountId: mockMembers[0].id,
};

const buildDatabase = (): Database => ({
  appData: [
    {
      id: 'cecc1671-6c9d-4604-a3a2-6d7fad4a5996',
      type: AppDataType.Answers,
      account: mockMembers[0],
      creator: mockMembers[0],
      visibility: 'item',
      item: mockItem,
      data: {
        answers: [
          { expectedId: 'id1', actualId: 'id' },
          { expectedId: 'id', actualId: 'id1' },
        ],
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'becc1671-6c9d-4604-a3a2-6d7fad4a5996',
      type: AppDataType.Answers,
      account: mockMembers[1],
      creator: mockMembers[1],
      visibility: 'item',
      item: mockItem,
      data: {
        answers: [
          { expectedId: 'id', actualId: 'id' },
          { expectedId: 'id1', actualId: 'id1' },
        ],
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'becc1671-6d9d-4604-a3a2-6d7fad4a5996',
      type: AppDataType.Answers,
      account: mockMembers[1],
      creator: mockMembers[1],
      visibility: 'item',
      item: mockItem,
      data: {
        answers: [
          { expectedId: 'id1', actualId: 'id' },
          { expectedId: 'id1', actualId: 'id1' },
        ],
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'becc1671-6c9d-4304-a3a2-6d7fad4a5996',
      type: AppDataType.Answers,
      account: mockMembers[2],
      creator: mockMembers[2],
      visibility: 'item',
      item: mockItem,
      data: {
        answers: [
          { expectedId: 'id1', actualId: 'id' },
          { expectedId: 'id1', actualId: 'id1' },
        ],
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
  appActions: [
    {
      id: 'cecc1671-6c9d-4604-a3a2-6d7fad4a5996',
      type: 'admin-action',
      account: mockMembers[0],
      createdAt: new Date().toISOString(),
      item: mockItem,
      data: { content: 'hello' },
    },
    {
      id: '0c11a63a-f333-47e1-8572-b8f99fe883b0',
      type: 'other-action',
      account: mockMembers[1],
      createdAt: new Date().toISOString(),
      item: mockItem,
      data: { content: 'other member' },
    },
  ],
  members: mockMembers,
  appSettings: [
    // complete configuration
    {
      id: '2c11a73a-f333-47e1-8572-b8f99fe883b0',
      item: mockItem,
      name: SettingsKeys.Settings,
      data: {
        description: '',
        labels: [
          {
            content: 'content',
            id: 'id',
            x: '40.09919261822376%',
            y: '17.26830060055186%',
          },
          {
            content: 'content1',
            id: 'id1',
            x: '62.09919261822376%',
            y: '47.26830060055186%',
          },
        ],
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    // background image setting
    {
      id: '0c11a73a-f333-47e1-8572-b8f99fe883b0',
      item: mockItem,
      name: SettingsKeys.File,
      data: {
        path: `apps/app-setting/${mockItem.id}/0c11a73a-f333-47e1-8572-b8f99fe883b0`,
      },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ],
  items: [mockItem],
  uploadedFiles: [
    // background image file
    {
      // @ts-ignore this key should be a file object to work 100% perfectly
      file: 'myfile',
      id: '0c11a73a-f333-47e1-8572-b8f99fe883b0',
    },
  ],
});

export default buildDatabase;
