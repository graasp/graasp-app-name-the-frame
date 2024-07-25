export type Settings = {
  description: string;
  labels: Label[];
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
