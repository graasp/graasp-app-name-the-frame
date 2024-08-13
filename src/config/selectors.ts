export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;

export const DESCRIPTION_INPUT_ID = 'description-input-id';

export const DASHBOARD_UPLOADER_ID = 'dashboard-uploader-id';

export const DASHBOARD_UPLOADER_INPUT_CLASS = 'uppy-Dashboard-input';

export const CONFIGURATION_TAB_ID = 'configurations-id';

export const buildLabelActionsID = (id: string): string => `label-action-${id}`;

export const ALL_DROPPABLE_CONTAINER_ID = 'all-droppable';

export const UNCONFIGURED_PLAYER_ALERT_ID = 'unconfigured-player-alert-id';
export const CONFIG_STEPPERS_ADD_IMG_ID = 'config-steppers-add-img-id';
export const CONFIG_STEPPERS_ADD_LABELS_ID = 'config-steppers-add-labels-id';
export const CONFIG_STEPPERS_PREVIEW_ID = 'config-steppers-preview-id';

export const ADD_LABELS_IMAGE_CONTAINER_ID = 'add-labels-img-container-id';
export const ADD_LABEL_FORM_ID = 'add-label-form-id';
export const NEW_LABEL_CONTENT_INPUT_ID = 'new-label-content-input-id';
export const ADD_LABEL_SUBMIT_BTN_ID = 'add-label-submit-btn-id';
export const DELETE_LABEL_BTN_ID = `delete-label-btn-id`;

export const buildDraggableLabelId = (content: string): string =>
  `draggable-label-${content}-id`;

export const ALL_LABELS_CONTAINER_ID = 'all-labels-container-id';
export const LABELS_WITHIN_FRAME_CONTAINER_ID =
  'labels-within-frame-container-id';
