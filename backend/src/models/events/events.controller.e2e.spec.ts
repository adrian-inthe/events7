import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

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
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/events (GET) returns a list of events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    response.body.forEach((event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('priority');
    });
  });

  it('/events/:id (GET) with an existing ID returns the event', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/${eventInList.id}`)
      .expect(200);

    expect(typeof response.body === 'object').toBe(true);
    expect(response.body).toHaveProperty('id', eventInList.id);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('type');
    expect(response.body).toHaveProperty('priority');
  });

  it('/events/:id (GET) with a non existing ID returns an error', async () => {
    const response = await request(app.getHttpServer())
      .get(`/events/${eventNotInList.id}`)
      .expect(404);

    expect(response.body).toHaveProperty('message');
  });

  it('/events (POST) with a valid event successfully adds it', async () => {
    const validCreateEvent = {
      name: 'Created',
      description: 'Created',
      type: 'liveops',
      priority: 8,
    };
    const response = await request(app.getHttpServer())
      .post(`/events`)
      .send(validCreateEvent)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(Number),
      name: validCreateEvent.name,
      description: validCreateEvent.description,
      type: validCreateEvent.type,
      priority: validCreateEvent.priority,
    });
  });

  it('/events (POST) with an invalid event returns an error', () => {
    const invalidCreateEvent = {
      name: '',
      type: 'invalid_type',
    };

    return request(app.getHttpServer())
      .post('/events')
      .send(invalidCreateEvent)
      .expect(400);
  });

  it('/events/:id (PUT) with a valid event successfully updates it', async () => {
    const updateEvent = {
      id: eventInList.id,
      name: 'Updated',
      description: 'Updated',
      type: 'app',
      priority: 8,
    };

    const response = await request(app.getHttpServer())
      .put(`/events/${eventInList.id}`)
      .send(updateEvent)
      .expect(200);

    expect(response.body).toEqual({
      id: eventInList.id,
      name: updateEvent.name,
      description: updateEvent.description,
      type: updateEvent.type,
      priority: updateEvent.priority,
    });
  });

  it('/events/:id (PUT) with mismatching IDs returns an error', async () => {
    let response = await request(app.getHttpServer())
      .put(`/events/${eventInList.id}`)
      .send(eventNotInList)
      .expect(400);

    expect(response.body).toHaveProperty(
      'message',
      'The event ID does not match the ID in the request.',
    );

    response = await request(app.getHttpServer())
      .put(`/events/${eventNotInList.id}`)
      .send(eventInList)
      .expect(400);

    expect(response.body).toHaveProperty(
      'message',
      'The event ID does not match the ID in the request.',
    );
  });

  it('/events/:id (DELETE) with a valid ID deletes the event', async () => {
    await request(app.getHttpServer())
      .get(`/events/${eventInList.id}`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/events/${eventInList.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/events/${eventInList.id}`)
      .expect(404);
  });

  it('/events/:id (DELETE) with a non existing ID returns an error', async () => {
    await request(app.getHttpServer())
      .get(`/events/${eventNotInList.id}`)
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/events/${eventNotInList.id}`)
      .expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
