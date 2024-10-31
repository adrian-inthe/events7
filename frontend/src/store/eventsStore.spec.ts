import {beforeEach, describe, expect, it, vi} from 'vitest';
import {createPinia, setActivePinia} from 'pinia';
import {useEventsStore} from './eventsStore';
import * as api from './utils/api.ts';
import * as events7 from './utils/events7.ts';
import {Event7} from './utils/events7.ts';

describe('eventsStore', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('should initialize with default values', () => {
    const store = useEventsStore();
    expect(store.events).toEqual([]);
    expect(store.canCreateAdsEvents).toBeNull();
    expect(store.eventValidationErrors).toEqual([]);
    expect(store.editedEvents).toEqual([]);
    expect(store.selectedEvents).toEqual([]);
  });

  it('should fetch user ads permission and set canCreateAdsEvents', async () => {
    const store = useEventsStore();
    vi.spyOn(api, 'checkPermission').mockResolvedValue(true);

    await store.fetchUserAdsPermission();

    expect(store.canCreateAdsEvents).toBe(true);
  });

  it('should handle error when fetching user ads permission', async () => {
    const store = useEventsStore();
    vi.spyOn(api, 'checkPermission').mockRejectedValue(new Error('API Error'));

    await expect(store.fetchUserAdsPermission()).rejects.toThrow(Error)
    expect(store.canCreateAdsEvents).toBeNull();
  });

  it('should fetch events and update the store', async () => {
    const store = useEventsStore();
    const mockEvents = [{id: 1, name: 'Test Event'}];

    vi.spyOn(api, 'fetchEvents').mockResolvedValue(mockEvents);

    await store.fetchEvents();

    expect(store.events).toEqual(mockEvents);
  });

  it('should handle error when fetching events', async () => {
    const store = useEventsStore();
    vi.spyOn(api, 'fetchEvents').mockRejectedValue(new Error('API Error'));

    await expect(store.fetchEvents()).rejects.toThrow(Error)

    expect(store.events).toEqual([]);
  });

  it('should create a new event and update the store', async () => {
    const store = useEventsStore();
    const newEvent = {id: null, name: 'New Event'};
    const createdEvent = {id: 1, name: 'New Event'};

    vi.spyOn(api, 'createEvent').mockResolvedValue(createdEvent);
    vi.spyOn(events7, 'updateEvent').mockImplementation(() => {
      store.events.push(createdEvent as Event7);
    });

    await store.createOrUpdateEvent(newEvent as Event7);

    expect(store.events).toContainEqual(createdEvent);
  });

  it('should update an existing event', async () => {
    const store = useEventsStore();
    const existingEvent = {id: 1, name: 'Existing Event'};
    store.events.push(existingEvent as Event7);
    const updatedEvent = {...existingEvent, name: 'Updated Event'};

    vi.spyOn(api, 'persistEvent').mockResolvedValue(undefined);
    vi.spyOn(events7, 'updateEvent').mockImplementation(() => {
      const index = store.events.findIndex(event => event.id === existingEvent.id);
      if (index !== -1) {
        store.events[index] = updatedEvent as Event7;
      }
    });

    await store.createOrUpdateEvent(updatedEvent as Event7);

    expect(store.events).toContainEqual(updatedEvent);
  });

  it('should handle error when creating/updating an event', async () => {
    const store = useEventsStore();
    const newEvent = {id: null, name: 'New Event'};

    vi.spyOn(api, 'createEvent').mockRejectedValue(new Error('API Error'));

    await expect(store.createOrUpdateEvent(newEvent as Event7)).rejects.toThrow(Error)

    expect(store.events).toHaveLength(0);
  });

  it('should delete events and update the store', async () => {
    const store = useEventsStore();
    const eventToDelete = {id: 1, name: 'Event to Delete'};
    store.events.push(eventToDelete as Event7);

    vi.spyOn(api, 'deleteEvent').mockResolvedValue(eventToDelete.id);
    vi.spyOn(events7, 'removeDeletedEvent').mockImplementation(() => {
      store.events = store.events.filter(event => event.id !== eventToDelete.id);
    });

    await store.deleteEvents([eventToDelete as Event7]);

    expect(store.events).not.toContainEqual(eventToDelete);
  });

  it('should handle error when deleting events', async () => {
    const store = useEventsStore();
    const eventToDelete = {id: 1, name: 'Event to Delete'};
    store.events.push(eventToDelete as Event7);

    vi.spyOn(api, 'deleteEvent').mockRejectedValue(new Error('API Error'));

    await store.deleteEvents([eventToDelete as Event7]);

    expect(store.events).toContainEqual(eventToDelete);
  });

  it('should add an empty event to the store', () => {
    const store = useEventsStore();
    const emptyEvent = store.addEmptyEvent();

    expect(store.events).toContainEqual(emptyEvent);
    expect(emptyEvent).toEqual(expect.objectContaining({ /* expected properties of empty event */}));
  });

  it('should remove unsaved events from the store', () => {
    const store = useEventsStore();
    store.events.push({id: null, name: 'Unsaved Event'} as Event7);

    vi.spyOn(events7, 'removeUnsavedEvent').mockImplementation(() => {
      store.events = store.events.filter(event => event.id !== null);
    });

    store.removeUnsavedEvent();

    expect(store.events).toHaveLength(0);
  });

  it('should set event validation errors', () => {
    const store = useEventsStore();
    const validationErrors: [keyof Event7, string][] = [['name', 'Name is required']];

    store.setEventValidationErrors(validationErrors);

    expect(store.eventValidationErrors).toEqual(validationErrors);
  });

  it('should clear event validation errors', () => {
    const store = useEventsStore();
    store.setEventValidationErrors([['name', 'Name is required']]);

    store.clearErrors();

    expect(store.eventValidationErrors).toEqual([]);
  });

  it('should set edited events', () => {
    const store = useEventsStore();
    const editedEvents = [{id: 1, name: 'Edited Event'}];

    store.setEditedEvents(editedEvents as Event7[]);

    expect(store.editedEvents).toEqual(editedEvents);
  });

  it('should set selected events', () => {
    const store = useEventsStore();
    const selectedEvents = [{id: 1, name: 'Selected Event'}];

    store.setSelectedEvents(selectedEvents as Event7[]);

    expect(store.selectedEvents).toEqual(selectedEvents);
  });
});
