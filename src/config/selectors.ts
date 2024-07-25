export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;

export const DESCRIPTION_INPUT_ID = 'description-input-id';

export const DASHBOARD_UPLOADER_ID = 'dashboard-uploader-id';

export const CONFIGURATION_TAB_ID = 'configurations-id';

export const buildLabelActionsID = (id: string): string => `label-action-${id}`;
