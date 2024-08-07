export type Settings = {
  description: string;
  labels: Label[];
  imageDimension: { width: number; height: number };
};

export enum SettingsKeys {
  File = 'file',
  SettingsData = 'settings-data',
}

export type Position = { x: number; y: number };

export type Label = Position & {
  content: string;
  id: string;
};

export type Choice = { content: string; id: string };

export type DraggableLabelType = {
  // x and y are relative to image size
  y: string;
  x: string;
  choices: Choice[];
  ind: number;
  labelId: string;
};
