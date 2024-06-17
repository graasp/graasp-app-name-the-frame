export type NameTheFrameSettings = {
  description: string;
  labels: Label[];
};

type Label = {
  top: string;
  left: string;
  content: string;
  id: string;
};
export enum NameTheFrameSettingsNames {
  File = 'file',
  SettingsData = 'settings-data',
}

export type Tip = {
  id: string;
  position: { top: number; left: number };
  content: string;
};

export type Choice = { content: string; id: string };
export type TipGroup = {
  // top and left are relative to image size
  top: string;
  left: string;
  choices: Choice[];
  ind: number;
  labelId: string;
};