import { Context, PermissionLevel } from '@graasp/sdk';

import { CONFIGURATION_TAB_ID } from '../../../src/config/selectors';

describe('Builder View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
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
