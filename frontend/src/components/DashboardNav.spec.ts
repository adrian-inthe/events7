import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import DashboardNav from './DashboardNav.vue';

vi.mock('primevue/card', () => ({
  default: {
    name: 'Card',
    template: '<div><slot name="content"></slot></div>',
  },
}));

describe('DashboardNav', () => {
  it('renders without errors', () => {
    const wrapper = mount(DashboardNav);

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://outfit7.com/favicon.png');

    const icons = wrapper.findAll('i.pi');
    expect(icons.length).toBe(3);
  });
});
