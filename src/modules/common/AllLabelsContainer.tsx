import { Droppable } from 'react-beautiful-dnd';

import { Stack, styled } from '@mui/material';

import { Label } from '@/@types';
import {
  ALL_DROPPABLE_CONTAINER_ID,
  ALL_LABELS_CONTAINER_ID,
} from '@/config/selectors';

import DraggableLabelToDroppableCont from './DraggableLabelToDroppableCont';

export const StyledBox = styled(Stack)<{
  isDraggingOver: boolean;
}>(({ theme, isDraggingOver }) => ({
  borderRadius: theme.spacing(1),
  background: isDraggingOver ? 'lightgray' : 'white',
  width: '100%',
  border: '1px solid black',
  minHeight: '40px',
}));

type Props = {
  labels: Label[];
  isSubmitted?: boolean;
};

const AllLabelsContainer = ({ labels, isSubmitted }: Props): JSX.Element => (
  <Droppable
    key={ALL_DROPPABLE_CONTAINER_ID}
    droppableId={ALL_DROPPABLE_CONTAINER_ID}
    direction="horizontal"
  >
    {(provided, dropSnapshot) => (
      <StyledBox
        direction="row"
        ref={provided.innerRef}
        {...provided.droppableProps}
        isDraggingOver={dropSnapshot.isDraggingOver}
        id={ALL_LABELS_CONTAINER_ID}
      >
        {labels.map((l, index) => (
          <DraggableLabelToDroppableCont
            content={l.content}
            label={l}
            index={index}
            key={l.id}
            isSubmitted={isSubmitted}
          />
        ))}
        {provided.placeholder}
      </StyledBox>
    )}
  </Droppable>
);

export default AllLabelsContainer;
