import { AppSetting, Context, PermissionLevel } from '@graasp/sdk';

import { CONFIGURATION_TAB_ID } from '../../../src/config/selectors';
import {
  MOCK_FILE_SETTING,
  MOCK_SETTING_DATA,
} from '../../fixtures/appSettings';

const appSettings: AppSetting[] = [MOCK_FILE_SETTING, MOCK_SETTING_DATA];
describe('Builder View', () => {
  beforeEach(() => {
    cy.setUpApi(
      { appSettings },
      {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    );
    cy.visit('/');
  });

  it('App', () => {
    cy.get(`#${CONFIGURATION_TAB_ID}`).should('be.visible');
  });
});
