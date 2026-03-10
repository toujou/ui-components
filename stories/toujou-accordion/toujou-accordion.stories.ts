import { html } from 'lit';
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

const accordionContent = html`
  <div class="accordion__panel" data-for="item-1" data-open="true">
    Panel 1 — Click to toggle
  </div>
  <div class="accordion__content" data-content="item-1">
    <div class="accordion__content-inner">
      Content for panel 1. This is open by default because of <code>data-open="true"</code>.
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
`;

export const Default: Story = {
  render: (args) => html`
    <toujou-accordion class="accordion" ?expand-mode-single=${args['expand-mode-single']}>
      ${accordionContent}
    </toujou-accordion>
  `,
};
