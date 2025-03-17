import { FC } from "react";
// import makeAnimated from 'react-select/animated';
import { useEventStore } from "../../../stores/events/event.store";
// import { useLevelStore } from "../../../stores";

interface Props {
  eventId: string;
}
export const EditEventProgressSheet: FC<Props> = ({ eventId }) => {
  // const animatedComponents = makeAnimated();

  // const editEvent = useEventStore(state => state.updateEvent);
  const getEventById = useEventStore((state) => state.getEventById);
  // const levels = useLevelStore(state => state.levels);

  return (
    <div>
      <code>{getEventById(eventId)?.teacher}</code>
      <code>{}</code>
    </div>
  );
};
