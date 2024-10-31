import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EventsHeader from './EventsHeader.vue';

describe('EventsHeader', () => {
  it('renders without errors', () => {
    const wrapper = mount(EventsHeader);

    const header = wrapper.find('header');
    expect(header.exists()).toBe(true);

    const title = wrapper.find('h1');
    expect(title.text()).toBe('Events7');

    const subtitle = wrapper.find('h2');
    expect(subtitle.text()).toBe('Dashboard');
  });
});