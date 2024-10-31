import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { UsersService } from '../users/users.service';
import { CreateEvent7Dto, Event7Dto } from './events.dto';

const notExistingId = 123;
const eventInList = {
  id: 1,
  name: 'Event 1',
  description: 'First event',
  type: 'app',
  priority: 5,
};

const eventNotInList = {
  id: 999,
  name: 'Event 999',
  description: '999th event',
  type: 'app',
  priority: 7,
};

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: UsersService,
          useValue: {
            permissionToManipulateAds: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      jest.spyOn(service, 'findAll').mockImplementation(() => [eventInList]);
      expect(await controller.findAll()).toStrictEqual([eventInList]);
    });
  });

  describe('findOne', () => {
    it('should return one event when in list', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => eventInList);
      expect(await controller.findOne(eventInList.id)).toStrictEqual(
        eventInList,
      );
    });

    it('should propagate NotFoundException from eventsService', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException() as never);
      await expect(controller.findOne(eventNotInList.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should return created event', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(eventInList));
      expect(await controller.create(eventInList as CreateEvent7Dto)).toBe(
        eventInList,
      );
    });
  });

  describe('update', () => {
    it('should return updated event when IDs match', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation(() => Promise.resolve(eventInList));
      expect(
        await controller.update(eventInList.id, eventInList as Event7Dto),
      ).toBe(eventInList);
    });

    it("should raise BadRequestException when IDs don't match", async () => {
      await expect(
        controller.update(notExistingId, eventInList as Event7Dto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should propagate NotFoundException from eventsService', async () => {
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException() as never);
      await expect(
        controller.update(eventNotInList.id, eventNotInList as Event7Dto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should remove an event and return nothing', async () => {
      jest.spyOn(service, 'delete').mockImplementation(() => undefined);
      expect(await controller.delete(eventInList.id)).toBeUndefined();
    });

    it('should propagate NotFoundException from eventsService', async () => {
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(new NotFoundException() as never);
      await expect(controller.delete(eventNotInList.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
