import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEvent7Dto, Event7Dto } from './events.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';

export interface Event7 {
  readonly id: number;
  name: string;
  description: string;
  type: string;
  priority: number;
}

@Injectable()
export class EventsService {
  // TODO move to persistence service
  private events: Event7[] = [
    {
      id: 1,
      name: 'Event One',
      description: 'First event',
      type: 'app',
      priority: 5,
    },
    {
      id: 2,
      name: 'Event Two',
      description: 'Second event',
      type: 'ads',
      priority: 8,
    },
  ];
  private nextId = 3;

  constructor(private readonly usersService: UsersService) {}

  findAll(): Event7[] {
    return this.events;
  }

  findOne(id: number): Event7 {
    const event = this.events.find((event) => event.id === id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async create(eventToCreate: CreateEvent7Dto): Promise<Event7> {
    if (eventToCreate.type === 'ads') {
      if (!(await this.usersService.permissionToManipulateAds())) {
        throw new Error('Permission to manipulate Ads denied');
      }
    }
    const errors = await validate(plainToClass(CreateEvent7Dto, eventToCreate));
    if (errors.length > 0) {
      throw new BadRequestException('Invalid event'); // TODO throw the validation errors
    }
    const event = { id: this.nextId++, ...eventToCreate };
    this.events.push(event);
    return event;
  }

  async update(id: number, eventToUpdate: Event7Dto): Promise<Event7> {
    if (id !== eventToUpdate.id) {
      throw new Error(`ID field update forbidden`);
    }
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (this.events[index].type === 'ads' || eventToUpdate.type === 'ads') {
      if (!(await this.usersService.permissionToManipulateAds())) {
        throw new Error('Permission to manipulate Ads denied');
      }
    }
    this.events[index] = { ...this.events[index], ...eventToUpdate };
    return this.events[index];
  }

  async delete(id: number): Promise<void> {
    const index = this.events.findIndex((event) => event.id === id);
    if (index === -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    if (this.events[index].type === 'ads') {
      if (!(await this.usersService.permissionToManipulateAds())) {
        throw new Error('Permission to manipulate Ads denied');
      }
    }
    this.events.splice(index, 1);
  }
}
