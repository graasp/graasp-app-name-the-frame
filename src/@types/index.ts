export type Settings = {
  description: string;
  labels: Label[];
};

export enum SettingsKeys {
  File = 'file',
  SettingsData = 'settings-data',
}

export type Label = {
  y: number;
  x: number;
  content: string;
  id: string;
};

export type Choice = { content: string; id: string };
