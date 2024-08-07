import { AnsweredLabel } from '@/@types';

type UpdateOperation = {
  index: number;
  newItem: AnsweredLabel;
};

// Utility function to update multiple labels
export const updateLabels = (
  labels: AnsweredLabel[],
  updates: UpdateOperation[],
): AnsweredLabel[] => {
  // Create a copy of the labels array to prevent direct mutation
  const updatedLabels = [...labels];

  // Apply each update
  updates.forEach(({ index, newItem }) => {
    if (index >= 0 && index < updatedLabels.length) {
      updatedLabels[index] = newItem;
    }
  });

  return updatedLabels;
};
