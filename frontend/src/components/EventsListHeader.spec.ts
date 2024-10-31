import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import EventsListHeader from './EventsListHeader.vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import {createPinia, setActivePinia} from 'pinia';
import {useEventsStore} from '../store/eventsStore';
import {Event7} from "../store/utils/events7.ts";

vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button><slot></slot></button>',
  },
}));

vi.mock('primevue/tag', () => ({
  default: {
    name: 'Tag',
    template: '<div><slot></slot></div>',
  },
}));

describe('EventsListHeader', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const store = useEventsStore(pinia);
    store.canCreateAdsEvents = false;
    store.selectedEvents = [];
  });

  it('should render two buttons and a tag', () => {
    const wrapper = mount(EventsListHeader, {
      global: {
        directives: {
          tooltip: {},
        },
      }
    });
    expect(wrapper.findComponent(Button).exists()).toBe(true);
    expect(wrapper.findAllComponents(Button).length).toBe(2);
    expect(wrapper.findComponent(Tag).exists()).toBe(true);
  });

  it('should render with correct button states based on selected events and Ads permission', async () => {
    // TODO test tooltip
    const wrapper = mount(EventsListHeader, {
      global: {
        directives: {
          tooltip: {},
        },
      }
    });

    const newEventButton = wrapper.findAllComponents(Button)[0];
    expect(newEventButton.attributes('disabled')).toBeUndefined();

    const deleteButton = wrapper.findAllComponents(Button)[1];
    expect(deleteButton.attributes('disabled')).toBe('');

    const store = useEventsStore();
    store.selectedEvents = [{id: 1}] as Event7[];
    await wrapper.vm.$nextTick();
    expect(deleteButton.attributes('disabled')).toBeUndefined();
  });

  it('should displays correct Tag severity based on Ads permission', async () => {
    const store = useEventsStore();
    const wrapper = mount(EventsListHeader, {
      global: {
        directives: {
          tooltip: {},
        },
      },
    });

    let tag = wrapper.findComponent(Tag);

    store.canCreateAdsEvents = true;
    await wrapper.vm.$nextTick();
    expect(tag.attributes('severity')).toBe('success');

    store.canCreateAdsEvents = null;
    await wrapper.vm.$nextTick();
    expect(tag.attributes('severity')).toBe('secondary');

    store.canCreateAdsEvents = false;
    await wrapper.vm.$nextTick();
    expect(tag.attributes('severity')).toBe('danger');
  });
});
