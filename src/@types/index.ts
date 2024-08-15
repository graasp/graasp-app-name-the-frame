export type Settings = {
  description: string;
  labels: Label[];
};

export enum SettingsKeys {
  File = 'file',
  SettingsData = 'settings-data',
}

// x and y are relative to image size (percentage)
export type Position = { x: string; y: string };

export type Label = Position & {
  content: string;
  id: string;
};

export type AnsweredLabel = {
  expected: Label;
  actual: null | Label;
};
