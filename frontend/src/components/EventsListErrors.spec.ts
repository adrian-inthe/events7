import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import EventsListErrors from './EventsListErrors.vue';
import Message from 'primevue/message';
import {createPinia, setActivePinia} from 'pinia';

vi.mock('primevue/message', () => ({
  default: {
    name: 'Message',
    template: '<div><slot name="icon"></slot><slot></slot></div>',
  },
}));

vi.mock('../store/eventsStore', () => {
  return {
    useEventsStore: () => ({
      eventValidationErrors: [
        ['name', 'cannot be empty'],
      ],
      eventCreationError: "Event hasn't been saved"
    }),
  };
});

describe('EventsListErrors', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('renders event validation errors', () => {
    const wrapper = mount(EventsListErrors);

    const messages = wrapper.findAllComponents(Message);
    expect(messages).toHaveLength(2);
    expect(messages[0].text()).toContain('name: cannot be empty');
    expect(messages[1].text()).toContain('Event hasn\'t been saved');

    const icons = wrapper.findAll('i.pi');
    expect(icons.length).toBe(2);
  });
});
