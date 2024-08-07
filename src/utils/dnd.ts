import { DraggableLocation } from 'react-beautiful-dnd';

import { Choice } from '@/@types';

export const reorder = (
  list: Choice[],
  startIndex: number,
  endIndex: number,
): Choice[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
export const move = (
  source: Choice[],
  destination: Choice[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
): { [key in string]: Choice[] } => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key in string]: Choice[] } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
