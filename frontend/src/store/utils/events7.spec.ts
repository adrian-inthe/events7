import {beforeEach, describe, expect, it} from 'vitest';
import {
  allowedEventTypes,
  Event7,
  getEmptyEvent,
  getEvent7RowSchema,
  permissionForAdsGranted,
  removeDeletedEvent,
  removeUnsavedEvent,
  updateEvent
} from './events7';

describe('Event Utilities', () => {
  describe('permissionForAdsGranted', () => {
    let originalAllowedEventTypes: string[];

    beforeEach(() => {
      originalAllowedEventTypes = [...allowedEventTypes];
      allowedEventTypes.length = 0;
    });

    afterEach(() => {
      allowedEventTypes.length = 0;
      allowedEventTypes.push(...originalAllowedEventTypes);
    });

    it('should add "ads" to allowedEventTypes if not already present', () => {
      permissionForAdsGranted();
      expect(allowedEventTypes).toContain('ads');
    });

    it('should not add "ads" to allowedEventTypes if already present', () => {
      allowedEventTypes.push('ads');
      permissionForAdsGranted();
      expect(allowedEventTypes.filter(type => type === 'ads')).toHaveLength(1);
    });
  });

  describe('getEmptyEvent', () => {
    it('should return an event with null properties', () => {
      const emptyEvent = getEmptyEvent();
      expect(emptyEvent).toEqual({id: null, name: null, description: null, type: null, priority: null});
    });
  });

  describe('removeUnsavedEvent', () => {
    it('should remove unsaved event (id: null) from the array', () => {
      const events = [{id: null, name: 'Unsaved Event'}, {id: 1, name: 'Saved Event'}];
      removeUnsavedEvent(events as Event7[]);
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({id: 1, name: 'Saved Event'});
    });

    it('should not modify the array if no unsaved event exists', () => {
      const events = [{id: 1, name: 'Saved Event'}];
      removeUnsavedEvent(events as Event7[]);
      expect(events).toHaveLength(1);
    });
  });

  describe('removeDeletedEvent', () => {
    it('should remove an event by its ID', () => {
      const events = [{id: 1, name: 'Event 1'}, {id: 2, name: 'Event 2'}];
      removeDeletedEvent(events as Event7[], 1);
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual({id: 2, name: 'Event 2'});
    });

    it('should not modify the array if the ID does not exist', () => {
      const events = [{id: 1, name: 'Event 1'}];
      removeDeletedEvent(events as Event7[], 2);
      expect(events).toHaveLength(1);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', () => {
      const events = [{id: 1, name: 'Old Event'}];
      const updatedEvent = {id: 1, name: 'Updated Event'};

      updateEvent(events as Event7[], 1, updatedEvent as Event7);
      expect(events[0]).toEqual(updatedEvent);
    });

    it('should not modify the array if the event ID is not found', () => {
      const events = [{id: 1, name: 'Old Event'}];
      const updatedEvent = {id: 2, name: 'New Event'};

      updateEvent(events as Event7[], 2, updatedEvent as Event7);
      expect(events[0]).toEqual({id: 1, name: 'Old Event'});
    });
  });

  describe('getEvent7RowSchema', () => {
    beforeAll(() => {

    })

    it('should validate a correct event object', async () => {
      const schema = getEvent7RowSchema();
      const validEvent = {
        name: 'Event Name',
        description: 'Event Description',
        type: 'crosspromo',
        priority: 5,
      };
      await expect(schema.validate(validEvent)).resolves.toEqual(validEvent);
    });

    it('should throw an error if required fields are missing', async () => {
      const schema = getEvent7RowSchema();
      const invalidEvent = {
        description: 'Event Description',
        type: 'crosspromo',
        priority: 5,
      };
      await expect(schema.validate(invalidEvent)).rejects.toThrow('cannot be empty');
    });

    it('should throw an error for invalid type', async () => {
      const schema = getEvent7RowSchema();
      const invalidEvent = {
        name: 'Event Name',
        description: 'Event Description',
        type: 'invalidType',
        priority: 5,
      };

      await expect(schema.validate(invalidEvent)).rejects.toThrow('is invalid');
    });

    it('should throw an error for invalid priority', async () => {
      const schema = getEvent7RowSchema();
      const invalidEvent = {
        name: 'Event Name',
        description: 'Event Description',
        type: 'crosspromo',
        priority: 11,
      };

      await expect(schema.validate(invalidEvent)).rejects.toThrow('must be a number between 0 and 10');
    });
  });
});
