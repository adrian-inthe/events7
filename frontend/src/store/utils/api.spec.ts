import {describe, expect, it, Mock, vi} from 'vitest';
import {checkPermission, createEvent, deleteEvent, fetchEvents, persistEvent} from './api.ts';
import {Event7} from "./events7.ts";

global.fetch = vi.fn();

describe('API Functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('checkPermission', () => {
    it('should check permission successfully', async () => {
      const mockResponse = {canCreateAdsEvents: true};
      (fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const permission = await checkPermission();
      expect(permission).toBe(true);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/users/permissions/ads');
    });

    it('should handle errors when checking permission', async () => {
      (fetch as Mock).mockRejectedValueOnce(new Error('Network Error'));
      await expect(checkPermission()).rejects.toThrow("Couldn't fetch permission");
    });
  });

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      const mockEvents = [{id: 1, name: 'Event 1'}];
      (fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockEvents),
      });

      const events = await fetchEvents();
      expect(events).toEqual(mockEvents);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/events');
    });

    it('should handle errors when fetching events', async () => {
      (fetch as Mock).mockRejectedValueOnce(new Error('Network Error'));
      await expect(fetchEvents()).rejects.toThrow("Couldn't fetch events");
    });
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockEvent = {id: 1, name: 'New Event'};
      (fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockEvent),
      });

      const event = await createEvent(mockEvent as Event7);
      expect(event).toEqual(mockEvent);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/events', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockEvent),
      }));
    });

    it('should handle errors when creating an event', async () => {
      const mockEvent = {id: null, name: 'New Event'};
      (fetch as Mock).mockRejectedValueOnce(new Error('Some error'));
      await expect(createEvent(mockEvent as Event7)).rejects.toThrow("Some error");
    });
  });

  describe('persistEvent', () => {
    it('should persist an event successfully', async () => {
      const mockEvent = {id: 1, name: 'Updated Event'};
      (fetch as Mock).mockResolvedValueOnce({
        json: vi.fn().mockResolvedValueOnce(mockEvent),
      });

      const event = await persistEvent(1, mockEvent as Event7);
      expect(event).toEqual(mockEvent);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/events/1', expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(mockEvent),
      }));
    });

    it('should handle errors when persisting an event', async () => {
      const mockEvent = {id: 1, name: 'Updated Event'};
      (fetch as Mock).mockRejectedValueOnce(new Error('Some error'));
      await expect(persistEvent(1, mockEvent as Event7)).rejects.toThrow("Couldn't persist event");
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event successfully', async () => {
      (fetch as Mock).mockResolvedValueOnce({ok: true});

      const id = 1;
      const result = await deleteEvent(id);
      expect(result).toBe(id);
      expect(fetch).toHaveBeenCalledWith(`http://localhost:3000/events/${id}`, expect.objectContaining({
        method: 'DELETE',
      }));
    });

    it('should throw an error if deletion fails', async () => {
      (fetch as Mock).mockResolvedValueOnce({ok: false});
      const id = 1;
      (fetch as Mock).mockRejectedValueOnce(new Error('Some error'));
      await expect(deleteEvent(id)).rejects.toThrow(`Couldn't delete event ${id}`);
    });
  });
});
