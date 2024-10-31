import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEvent7Dto, Event7Dto } from './events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Post()
  async create(@Body() createEvent: CreateEvent7Dto) {
    return await this.eventsService.create(createEvent);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEvent: Event7Dto,
  ) {
    if (id !== updateEvent.id) {
      throw new BadRequestException(
        'The event ID does not match the ID in the request.',
      );
    }
    return await this.eventsService.update(id, updateEvent);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.eventsService.delete(id);
  }
}
