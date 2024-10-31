import {defineStore} from 'pinia';
import {checkPermission, createEvent, deleteEvent, fetchEvents, persistEvent} from "./utils/api.ts";
import {
  Event7,
  Event7Keys,
  getEmptyEvent,
  permissionForAdsGranted,
  removeDeletedEvent,
  removeUnsavedEvent,
  updateEvent,
} from "./utils/events7.ts";

export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [] as Event7[],
    canCreateAdsEvents: null as boolean | null,
    eventValidationErrors: [] as [Event7Keys, string][],
    eventCreationError: "" as string,
    editedEvents: [] as Event7[],
    selectedEvents: [] as Event7[],
    degradedMode: false,
  }),

  actions: {
    async fetchUserAdsPermission() {
      this.canCreateAdsEvents = await checkPermission();
      if (this.canCreateAdsEvents) {
        permissionForAdsGranted();
      }
    },

    async fetchEvents() {
      this.events = await fetchEvents()
    },

    async createOrUpdateEvent(event: Event7) {
      if (!event.id) {
        delete event.id;
        const newEvent = await createEvent(event)
        updateEvent(this.events, undefined, newEvent)
      } else {
        await persistEvent(event.id, event)
        updateEvent(this.events, event.id, event)
      }
    },

    async deleteEvents(events: Event7[]) {
      for await (const event of events) {
        if (event.id) {
          try {
            const deletedId = await deleteEvent(event.id)
            if (deletedId) {
              removeDeletedEvent(this.events, deletedId)
            }
          } catch (error) {
            console.error(`Failed to delete event ${event.id}:`, error);
          }
        }
      }
    },

    addEmptyEvent(): Event7 {
      this.events.push(getEmptyEvent());
      return this.events[this.events.length - 1]
    },

    removeUnsavedEvent() {
      removeUnsavedEvent(this.events)
    },

    setEventValidationErrors(eventValidationErrors: [Event7Keys, string][]) {
      this.eventValidationErrors = eventValidationErrors
    },

    clearErrors() {
      this.eventValidationErrors = []
      this.eventCreationError = "";
    },

    setEventCreationError(eventCreationError: string) {
      this.eventCreationError = eventCreationError;
    },

    setEditedEvents(editedEvents: Event7[]) {
      this.editedEvents = editedEvents;
    },

    setSelectedEvents(selectedEvents: Event7[]) {
      this.selectedEvents = selectedEvents;
    }
  },
});
