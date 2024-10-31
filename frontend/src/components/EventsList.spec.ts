import {mount} from '@vue/test-utils';
import {createPinia, setActivePinia} from 'pinia';
import {describe, expect, it, vi} from 'vitest';
import EventsList from './EventsList.vue';
import {useEventsStore} from '../store/eventsStore';

const headerMock = {
  template: '<div>Header</div>',
};

const datatableMock = {
  template: '<div>Datatable</div>',
};

const errorsMock = {
  template: '<div>Errors</div>',
};

describe('EventsList', () => {
  let fetchEvents: any;

  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const store = useEventsStore();
    fetchEvents = vi.fn();
    store.fetchEvents = fetchEvents;
  });

  it('shows "Events list not available" if fetch fails', async () => {
    fetchEvents.mockImplementationOnce(() => {
      throw new Error("Failed to fetch events");
    });

    const wrapper = mount(EventsList, {
      global: {
        components: {
          EventsListHeader: headerMock,
          EventsListDatatable: datatableMock,
          EventsListErrors: errorsMock,
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('strong').text()).toBe('Events list not available');
    expect(wrapper.findComponent(headerMock).exists()).toBe(false);
    expect(wrapper.findComponent(errorsMock).exists()).toBe(false);
  });
});
