import { AnsweredLabel, Label } from '@/@types';
import { ALL_DROPPABLE_CONTAINER_ID } from '@/config/selectors';

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

type UpdatedLabels = {
  labels: Label[];
  answeredLabels: AnsweredLabel[];
};

const findLabelIndex = (labels: AnsweredLabel[], id: string): number =>
  labels?.findIndex(({ expected }) => expected.id === id) ?? -1;

type MoveIndices = {
  srcIdx: number;
  distIdx: number;
};

type MoveContext = {
  labels: Label[];
  answeredLabels: AnsweredLabel[];
  srcDroppableId: string;
  distDroppableId: string;
  srcLabelIndex: number;
};

export const trackLabelsChanges = ({
  srcDroppableId,
  distDroppableId,
  labels,
  answeredLabels,
  srcLabelIndex,
}: MoveContext): UpdatedLabels => {
  const handleMoveFromAll = ({
    srcIdx,
    distIdx,
  }: MoveIndices): UpdatedLabels => {
    const labelDist = answeredLabels[distIdx];

    if (labelDist.actual) {
      return { answeredLabels, labels };
    }

    const itemToMove = labels[srcIdx];
    const destination = { ...labelDist, actual: itemToMove };

    return {
      answeredLabels: updateLabels(answeredLabels, [
        { index: distIdx, newItem: destination },
      ]),
      labels: labels.filter((_, index) => index !== srcIdx),
    };
  };

  const handleMoveToAll = ({ srcIdx }: { srcIdx: number }): UpdatedLabels => {
    const itemToMove = answeredLabels[srcIdx];
    const src = { ...itemToMove, actual: null };

    return {
      answeredLabels: updateLabels(answeredLabels, [
        { index: srcIdx, newItem: src },
      ]),
      labels: [...labels, itemToMove.actual as Label],
    };
  };
  const handleMoveToAnotherChoice = ({
    srcIdx,
    distIdx,
  }: MoveIndices): UpdatedLabels => {
    const labelDist = answeredLabels[distIdx];
    const itemToMove = answeredLabels[srcIdx];

    const dist = {
      ...labelDist,
      actual: itemToMove.actual,
    };
    const src = { ...itemToMove, actual: null };

    return {
      answeredLabels: updateLabels(answeredLabels, [
        { index: distIdx, newItem: dist },
        { index: srcIdx, newItem: src },
      ]),
      labels,
    };
  };

  const distIdx = findLabelIndex(answeredLabels, distDroppableId);
  const srcIdx = findLabelIndex(answeredLabels, srcDroppableId);
  if (srcDroppableId === ALL_DROPPABLE_CONTAINER_ID) {
    return handleMoveFromAll({ distIdx, srcIdx: srcLabelIndex });
  }

  if (srcIdx > -1 && distDroppableId === ALL_DROPPABLE_CONTAINER_ID) {
    return handleMoveToAll({ srcIdx });
  }

  return handleMoveToAnotherChoice({ srcIdx, distIdx });
};
