import * as yup from 'yup';

export const eventPriorities = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
export const allowedEventTypes = ['crosspromo', 'liveops', 'app']
const restrictedEventType = 'ads'

export type Event7 = {
  id?: number | null;
  name: string | null;
  description: string | null;
  type: string | null;
  priority: number | null
};

export type Event7Keys = keyof Event7;

export function permissionForAdsGranted() {
  if (!allowedEventTypes.includes(restrictedEventType)) {
    allowedEventTypes.push(restrictedEventType)
  }
}

export function getEmptyEvent(): Event7 {
  return {id: null, name: null, description: null, type: null, priority: null}
}

function findEventWithId(events: Event7[], id: number | null): number {
  return events.findIndex((event) => event.id === id)
}

function deleteEventAtIndex(events: Event7[], indexToDelete: number) {
  if (indexToDelete > -1) {
    events.splice(indexToDelete, 1);
  }
}

export function removeUnsavedEvent(events: Event7[]) {
  deleteEventAtIndex(events, findEventWithId(events, null))
}

export function removeDeletedEvent(events: Event7[], id: number) {
  deleteEventAtIndex(events, findEventWithId(events, id))
}

export function updateEvent(events: Event7[], eventId: number | undefined, event: Event7) {
  const eventIndex = events.findIndex(event => event.id === eventId);

  if (eventIndex === -1) {
    console.error(`Event with ID ${eventId} not found.`);
    return;
  }

  Object.assign(events[eventIndex], event);
}

export function getEvent7RowSchema() {
  return yup.object().shape({
    name: yup.string().required('cannot be empty'),
    description: yup.string().required('cannot be empty'),
    type: yup.string().oneOf(allowedEventTypes, "is invalid").required('cannot be empty'),
    priority: yup.number().oneOf(eventPriorities, 'must be a number between 0 and 10').required('cannot be empty'),
  });
}
