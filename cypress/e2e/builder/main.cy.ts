import { AppSetting, Context, PermissionLevel } from '@graasp/sdk';

import {
  ADD_LABELS_IMAGE_CONTAINER_ID,
  ADD_LABEL_FORM_ID,
  ADD_LABEL_SUBMIT_BTN_ID,
  CONFIG_STEPPERS_ADD_LABELS_ID,
  DELETE_LABEL_BTN_ID,
  NEW_LABEL_CONTENT_INPUT_ID,
  buildDraggableLabelId,
} from '../../../src/config/selectors';
import {
  MOCK_FILE_SETTING,
  MOCK_SETTING_DATA,
  MOCK_SETTING_DATA_WITH_LABELS,
} from '../../fixtures/appSettings';

const addNewLabel = (content: string, isOpenForm?: boolean): void => {
  if (isOpenForm) {
    cy.get(`#${ADD_LABELS_IMAGE_CONTAINER_ID}`).click(200, 200);
  }
  cy.get(`#${NEW_LABEL_CONTENT_INPUT_ID}`).type(content);
  cy.get(`#${ADD_LABEL_SUBMIT_BTN_ID}`).click();
};
/*

Add label step:

create label - DONE
edit label - DONE
remove label - DONE
save
Preview step:

show all given labels
show even if empty?
*/
const appSettings: AppSetting[] = [MOCK_FILE_SETTING, MOCK_SETTING_DATA];
describe('Builder View', () => {
  // it('App', () => {
  //   cy.get(`#${CONFIGURATION_TAB_ID}`).should('be.visible');
  // });

  describe('add labels step', () => {
    beforeEach(() => {
      cy.setUpApi(
        { appSettings },
        {
          context: Context.Builder,
          permission: PermissionLevel.Admin,
        },
      );
      cy.visit('/');
      // cy.wait(3000);

      // move to add labels step
      cy.get(`#${CONFIG_STEPPERS_ADD_LABELS_ID}`).click();
    });

    it('click on app image should open add label form', () => {
      cy.get(`#${ADD_LABELS_IMAGE_CONTAINER_ID}`).click(200, 200);
      cy.get(`#${ADD_LABEL_FORM_ID}`).should('be.visible');
    });

    it('add new label', () => {
      const labelContent = 'label1';
      addNewLabel(labelContent);
      cy.get(`#${buildDraggableLabelId(labelContent)}`).should('be.visible');
    });

    it('edit existing label', () => {
      const content = 'label22';
      const contentToEditTo = 'new-content';
      addNewLabel(content, true);

      cy.get(`#${buildDraggableLabelId(content)}`).click();
      cy.get(`#${ADD_LABEL_FORM_ID}`).should('be.visible');
      cy.get(`#${NEW_LABEL_CONTENT_INPUT_ID}`).clear();

      addNewLabel(contentToEditTo);

      cy.get(`#${buildDraggableLabelId(contentToEditTo)}`).should('be.visible');
    });

    it('delete existing label', () => {
      const content = 'label22';
      addNewLabel(content, true);

      cy.get(`#${buildDraggableLabelId(content)}`).click();
      cy.get(`#${ADD_LABEL_FORM_ID}`).should('be.visible');
      cy.get(`#${DELETE_LABEL_BTN_ID}`).should('be.visible');
      cy.get(`#${DELETE_LABEL_BTN_ID}`).click();
      cy.get(`#${buildDraggableLabelId(content)}`).should('not.exist');
    });
  });

  describe.only('add preview step', () => {
    beforeEach(() => {
      cy.setUpApi(
        { appSettings: [MOCK_FILE_SETTING, MOCK_SETTING_DATA_WITH_LABELS] },
        {
          context: Context.Builder,
          permission: PermissionLevel.Admin,
        },
      );
      cy.visit('/');
      // cy.wait(3000);
    });

    MOCK_SETTING_DATA_WITH_LABELS.data.labels?.forEach((label) => {
      it(`expect to find ${label.content} label within all labels container and to have a draggable container for it`, () => {});
    });
  });
});
