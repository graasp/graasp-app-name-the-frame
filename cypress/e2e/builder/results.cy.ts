import { AppData, Context, MemberFactory, PermissionLevel } from '@graasp/sdk';

import { v4 } from 'uuid';

import { AppDataType } from '@/@types';
import {
  ANSWERS_TABLE_CLASSNAME,
  RESULT_ROW_MEMBER_CLASSNAME,
  buildBuilderTabClassName,
} from '@/config/selectors';
import { BuilderTab } from '@/modules/main/BuilderTab';

import {
  MOCK_FILE_APP_SETTING,
  MOCK_SETTING_DATA_WITH_LABELS,
} from '../../fixtures/appSettings';
import { MOCK_IMG_FROM_FIXTURES } from '../../fixtures/images/links';
import { loadFile } from '../../fixtures/images/utils';
import { MOCK_SERVER_ITEM } from '../../fixtures/mockItem';

const MEMBERS = [
  MemberFactory({
    id: 'd3b90b7d-2bb4-4329-89b3-099bae00d582',
    name: 'current-member',
  }),
  MemberFactory(),
  MemberFactory(),
];

const APP_DATA: AppData[] = [
  {
    id: 'cecc1671-6c9d-4604-a3a2-6d7fad4a5996',
    type: AppDataType.Answers,
    account: MEMBERS[0],
    creator: MEMBERS[0],
    visibility: 'member',
    item: MOCK_SERVER_ITEM,
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
    id: v4(),
    type: AppDataType.Answers,
    account: MEMBERS[1],
    creator: MEMBERS[1],
    visibility: 'member',
    item: MOCK_SERVER_ITEM,
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
    id: v4(),
    type: AppDataType.Answers,
    account: MEMBERS[1],
    creator: MEMBERS[1],
    visibility: 'member',
    item: MOCK_SERVER_ITEM,
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
    id: v4(),
    type: AppDataType.Answers,
    account: MEMBERS[2],
    creator: MEMBERS[2],
    visibility: 'member',
    item: MOCK_SERVER_ITEM,
    data: {
      answers: [
        { expectedId: 'id1', actualId: 'id' },
        { expectedId: 'id1', actualId: 'id1' },
      ],
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

describe('Results', () => {
  it('empty answers', () => {
    loadFile(MOCK_IMG_FROM_FIXTURES, (file) => {
      cy.setUpApi(
        {
          members: MEMBERS,
          appSettings: [MOCK_SETTING_DATA_WITH_LABELS, MOCK_FILE_APP_SETTING],
          uploadedFiles: [
            {
              id: MOCK_FILE_APP_SETTING.id,
              file,
            },
          ],
          appData: [],
        },
        {
          context: Context.Builder,
          permission: PermissionLevel.Admin,
        },
      );
      cy.visit('/');
    });

    cy.get(`.${buildBuilderTabClassName(BuilderTab.Results)}`).click();

    cy.get(`[role="alert"]`).should('have.class', 'MuiAlert-standardInfo');
  });

  describe('answers', () => {
    beforeEach(() => {
      loadFile(MOCK_IMG_FROM_FIXTURES, (file) => {
        cy.setUpApi(
          {
            members: MEMBERS,
            appSettings: [MOCK_SETTING_DATA_WITH_LABELS, MOCK_FILE_APP_SETTING],
            uploadedFiles: [
              {
                id: MOCK_FILE_APP_SETTING.id,
                file,
              },
            ],
            appData: APP_DATA,
          },
          {
            context: Context.Builder,
            permission: PermissionLevel.Admin,
          },
        );
        cy.visit('/');
      });
    });

    it('show students results', () => {
      cy.get(`.${buildBuilderTabClassName(BuilderTab.Results)}`).click();

      cy.get(`.${RESULT_ROW_MEMBER_CLASSNAME}`).should('have.length', 3);
      cy.get(`.${ANSWERS_TABLE_CLASSNAME}`).should('not.exist');

      // open a collapsed table that should be visible
      cy.get(`[data-testid="KeyboardArrowDownIcon"]`).first().click();
      cy.get(`.${ANSWERS_TABLE_CLASSNAME}`).should('be.visible');
    });
  });
});
