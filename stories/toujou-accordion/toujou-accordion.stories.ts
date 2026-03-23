import { fn } from 'storybook/test';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../packages/toujou-accordion/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Accordion',
  component: 'toujou-accordion',
  argTypes: {
    'expand-mode-single': {
      control: 'boolean',
      description: 'Only one panel can be open at a time',
    },
  },
  parameters: {
    toujouThemes: [THEME_NAMES.TOUJOU_V1, THEME_NAMES.HISSU_V1, THEME_NAMES.TABI_V1, THEME_NAMES.MEDATSU_V1, THEME_NAMES.CUSTOMIZATIONS, THEME_NAMES.OTHER],
  },
  args: {
    'expand-mode-single': false,
  },
  tags: ['toujou v1', 'hissu v1', 'tabi v1', 'medatsu v1', 'customizations', 'other']
};

export default meta;
type Story = StoryObj;

const onAccordionChange = fn().mockName('accordion-change');
const onAccordionReady = fn().mockName('toujou-accordion-ready');

const renderChevron = () => `<i class="chevron"></i>`;

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-accordion class="accordion" ${args['expand-mode-single'] ? 'expand-mode-single' : ''}>
        <div class="accordion__panel" data-for="item-1" data-open="true">
          <h3 class="accordion__title">Panel 1 — Click to toggle</h3>
          ${renderChevron()}
        </div>
        <div class="accordion__content" data-content="item-1">
          <p>Content for panel 1.</p>
        </div>

        <div class="accordion__panel" data-for="item-2">
          <h3 class="accordion__title">Panel 2 — Click to toggle</h3>
          ${renderChevron()}
        </div>
        <div class="accordion__content" data-content="item-2">
          <p>Content for panel 2.</p>
        </div>

        <div class="accordion__panel" data-for="item-3">
          <h3 class="accordion__title">Panel 3 — Click to toggle</h3>
          ${renderChevron()}
        </div>
        <div class="accordion__content" data-content="item-3">
          <p>Content for panel 3.</p>
        </div>
      </toujou-accordion>
    `;

    const accordion = wrapper.querySelector('toujou-accordion');
    accordion.addEventListener('accordion-change', onAccordionChange);
    accordion.addEventListener('toujou-accordion-ready', onAccordionReady);

    return wrapper;
  },
};
