import { AppSetting, Context, PermissionLevel } from '@graasp/sdk';

import {
  ADD_LABELS_IMAGE_CONTAINER_ID,
  ADD_LABEL_FORM_ID,
  ADD_LABEL_SUBMIT_BTN_ID,
  ALL_LABELS_CONTAINER_ID,
  CONFIG_STEPPERS_ADD_LABELS_ID,
  DELETE_LABEL_BTN_ID,
  LABELS_WITHIN_FRAME_CONTAINER_ID,
  NEW_LABEL_CONTENT_INPUT_ID,
  buildDraggableLabelId,
} from '../../../src/config/selectors';
import {
  MOCK_FILE_APP_SETTING,
  MOCK_SETTING_DATA,
  MOCK_SETTING_DATA_WITH_LABELS,
} from '../../fixtures/appSettings';
import { MOCK_IMG_FROM_FIXTURES } from '../../fixtures/images/links';
import { loadFile } from '../../fixtures/images/utils';

const addNewLabel = (content: string, isOpenForm?: boolean): void => {
  if (isOpenForm) {
    cy.get(`#${ADD_LABELS_IMAGE_CONTAINER_ID}`).click(200, 200);
  }
  cy.get(`#${NEW_LABEL_CONTENT_INPUT_ID}`).type(content);
  cy.get(`#${ADD_LABEL_SUBMIT_BTN_ID}`).click();
};

const appSettings: AppSetting[] = [MOCK_SETTING_DATA, MOCK_FILE_APP_SETTING];
describe('Builder View', () => {
  describe('add labels step', () => {
    beforeEach(() => {
      loadFile(MOCK_IMG_FROM_FIXTURES, (file) => {
        cy.setUpApi(
          {
            appSettings,
            uploadedFiles: [
              {
                id: MOCK_FILE_APP_SETTING.id,
                file,
              },
            ],
          },
          {
            context: Context.Builder,
            permission: PermissionLevel.Admin,
          },
        );
        cy.visit('/');

        // move to add labels step
        // TODO: due to an issue, we have to click twice. Remove the second click when the issue is resolved.
        // for more, see https://github.com/graasp/graasp-app-name-the-frame/issues/167.
        cy.get(`#${CONFIG_STEPPERS_ADD_LABELS_ID}`).click();
        cy.get(`#${CONFIG_STEPPERS_ADD_LABELS_ID}`).click();
      });
    });

    it('click on app image should open add label form', () => {
      cy.get(`#${ADD_LABELS_IMAGE_CONTAINER_ID}`).click(200, 200);
      cy.get(`#${ADD_LABEL_FORM_ID}`).should('be.visible');
    });

    it('add new label', () => {
      const labelContent = 'label1';
      addNewLabel(labelContent, true);
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

  describe('add preview step', () => {
    beforeEach(() => {
      loadFile(MOCK_IMG_FROM_FIXTURES, (file) => {
        cy.setUpApi(
          {
            appSettings: [MOCK_SETTING_DATA_WITH_LABELS, MOCK_FILE_APP_SETTING],
            uploadedFiles: [
              {
                id: MOCK_FILE_APP_SETTING.id,
                file,
              },
            ],
          },
          {
            context: Context.Builder,
            permission: PermissionLevel.Admin,
          },
        );
        cy.visit('/');
      });
    });

    MOCK_SETTING_DATA_WITH_LABELS.data.labels?.forEach((label) => {
      it(`expect to find ${label.content} label within all labels container and to have a draggable container for it`, () => {
        cy.get(
          `#${ALL_LABELS_CONTAINER_ID} #${buildDraggableLabelId(label.id)}`,
        ).should('be.visible');

        cy.get(
          `#${LABELS_WITHIN_FRAME_CONTAINER_ID} #${buildDraggableLabelId(label.id)}`,
        ).should('be.visible');
      });
    });
  });
});
