import { DASHBOARD_UPLOADER_INPUT_CLASS } from '@/config/selectors';

const blobToFile = (blob: Blob): File => new File([blob], '');

export const loadFile = (
  pathWithinFixtures: string,
  onLoad: (file: File) => void,
): void => {
  cy.fixture(pathWithinFixtures).then((file) => {
    const blob = Cypress.Blob.base64StringToBlob(file);

    onLoad?.(blobToFile(blob));
  });
};

export const uploadImage = (imagePath: string): void => {
  cy.get(`.${DASHBOARD_UPLOADER_INPUT_CLASS}`).first().selectFile(
    imagePath,
    // use force because the input is visually hidden
    { force: true },
  );
};
