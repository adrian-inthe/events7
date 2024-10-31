import { Event7, EventsService } from './events.service';
import { CreateEvent7Dto, Event7Dto, Event7Type } from './events.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

let mockEventsList: Event7[];

describe('EventsService', () => {
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);

    mockEventsList = [
      { id: 1, name: 'n1', description: 'd1', type: 'liveops', priority: 8 },
      { id: 2, name: 'n2', description: 'd2', type: 'ads', priority: 8 },
    ];
  });

  describe('findAll', () => {
    it('should return an array of events', () => {
      (eventsService as any).events = mockEventsList;
      const event = eventsService.findAll();
      expect(event).toEqual(mockEventsList);

      (eventsService as any).events = [];
      const event2 = eventsService.findAll();
      expect(event2).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return the event with the given ID', () => {
      (eventsService as any).events = mockEventsList;
      const event = eventsService.findOne(mockEventsList[0].id);
      expect(event).toEqual(mockEventsList[0]);
    });

    it('should throw NotFoundException if the event does not exist', () => {
      (eventsService as any).events = mockEventsList;
      expect(() => eventsService.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new event for valid data', async () => {
      const event = await eventsService.create({
        name: 'New Event',
        description: 'New Description',
        type: Event7Type.LiveOps,
        priority: 7,
      });

      expect(event).toEqual({
        id: expect.any(Number),
        name: 'New Event',
        description: 'New Description',
        type: 'liveops',
        priority: 7,
      });
    });

    it('should throw BadRequestException for invalid data', async () => {
      await expect(
        eventsService.create({} as unknown as CreateEvent7Dto), // invalid
      ).rejects.toThrow(BadRequestException);

      await expect(
        eventsService.create({
          name: 1, // invalid
          description: 'VALID',
          type: 'app',
          priority: 10,
        } as unknown as CreateEvent7Dto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        eventsService.create({
          name: 'VALID',
          description: 1, // invalid
          type: 'app',
          priority: 10,
        } as unknown as CreateEvent7Dto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        eventsService.create({
          name: 'VALID',
          description: 'VALID',
          type: 'INVALID', // invalid
          priority: 10,
        } as unknown as CreateEvent7Dto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        eventsService.create({
          name: 'VALID',
          description: 'VALID',
          type: 'app',
          priority: 11, // invalid
        } as unknown as CreateEvent7Dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    function getUpdatedEvent(mockEventIdToCopy: Event7, fieldToUpdate: any) {
      return Object.assign({}, mockEventIdToCopy, fieldToUpdate);
    }

    it('should update the event with the given ID', async () => {
      (eventsService as any).events = mockEventsList;
      const updatedEvent = getUpdatedEvent(mockEventsList[0], {
        name: 'updated',
      });
      const result = await eventsService.update(
        mockEventsList[0].id,
        updatedEvent as Event7Dto,
      );
      expect(result).toEqual(updatedEvent);
      expect((eventsService as any).events[0]).toEqual(updatedEvent);
    });

    it('should not update an event\'s ID', async () => {
      (eventsService as any).events = mockEventsList;
      const eventToUpdateIndex = 0;
      const updatedEvent = getUpdatedEvent(mockEventsList[eventToUpdateIndex], {
        id: 123,
      });
      await expect(
        eventsService.update(
          mockEventsList[eventToUpdateIndex].id,
          updatedEvent as Event7Dto,
        ),
      ).rejects.toThrow('ID field update forbidden');
      expect((eventsService as any).events[eventToUpdateIndex]).not.toEqual(
        updatedEvent,
      );
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      (eventsService as any).events = mockEventsList;
      const updatedEvent = {
        id: 999,
        name: 'updated',
        description: 'updated',
        type: 'ads',
        priority: 8,
      };
      await expect(
        eventsService.update(999, updatedEvent as Event7Dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the event with the given ID', async () => {
      (eventsService as any).events = mockEventsList;
      const idToDelete = 1;
      const eventToDelete = (eventsService as any).events.find(
        (event) => event.id === idToDelete,
      );
      expect(eventToDelete).not.toBeNull();
      expect(await eventsService.delete(eventToDelete.id)).toBeUndefined();
      expect(
        (eventsService as any).events.find((event) => event.id === idToDelete),
      ).toBeUndefined();
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      (eventsService as any).events = mockEventsList;
      await expect(eventsService.delete(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
