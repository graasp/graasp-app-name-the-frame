export type Settings = {
  description: string;
  labels: Label[];
};

export type FileSettings = {
  path: string;
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

export type SubmittedAnswer = {
  expectedId: string;
  actualId?: string;
};

type Answer = {
  expected: string;
  actual: string;
};

export type Result = {
  id: string;
  name: string;
  lastAttempt: string;
  currentGrade: string;
  totalAttempts: number;
  answers: Answer[];
};

export enum AppDataType {
  Answers = 'answers',
}
