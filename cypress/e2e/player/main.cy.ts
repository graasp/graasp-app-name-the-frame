import { Context, PermissionLevel } from '@graasp/sdk';

import { UNCONFIGURED_PLAYER_ALERT_ID } from '@/config/selectors';

describe('Player View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
  });

  it('For unconfigured application user should see alert message', () => {
    cy.get(`#${UNCONFIGURED_PLAYER_ALERT_ID}`).should('be.visible');
  });
});
