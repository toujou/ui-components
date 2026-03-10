import { fn } from 'storybook/test';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-accordion/src/index.ts';

import './toujou-accordion.stories.css';

const meta: Meta = {
  title: 'Components/Toujou Accordion',
  component: 'toujou-accordion',
  argTypes: {
    'expand-mode-single': {
      control: 'boolean',
      description: 'Only one panel can be open at a time',
    },
  },
  args: {
    'expand-mode-single': false,
  },
};

export default meta;
type Story = StoryObj;

const onAccordionChange = fn().mockName('accordion-change');
const onAccordionReady = fn().mockName('toujou-accordion-ready');

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-accordion class="accordion" ${args['expand-mode-single'] ? 'expand-mode-single' : ''}>
        <div class="accordion__panel" data-for="item-1" data-open="true">
          Panel 1 — Click to toggle
        </div>
        <div class="accordion__content" data-content="item-1">
          <div class="accordion__content-inner">
            Content for panel 1.
          </div>
        </div>

        <div class="accordion__panel" data-for="item-2">
          Panel 2 — Click to toggle
        </div>
        <div class="accordion__content" data-content="item-2">
          <div class="accordion__content-inner">
            Content for panel 2.
          </div>
        </div>

        <div class="accordion__panel" data-for="item-3">
          Panel 3 — Click to toggle
        </div>
        <div class="accordion__content" data-content="item-3">
          <div class="accordion__content-inner">
            Content for panel 3.
          </div>
        </div>
      </toujou-accordion>
    `;

    const accordion = wrapper.querySelector('toujou-accordion');
    accordion.addEventListener('accordion-change', onAccordionChange);
    accordion.addEventListener('toujou-accordion-ready', onAccordionReady);

    return wrapper;
  },
};
