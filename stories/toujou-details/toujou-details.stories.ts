import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-details/src/index.ts';
import './toujou-details.storyStyles.css';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Details',
  component: 'toujou-details',
  argTypes: {
    'is-open': {
      control: 'boolean',
      description: 'Whether the details element is open',
    },
  },
  args: {
    'is-open': false,
    onToggle: fn().mockName('toujou-details-toggle'),
    onConnected: fn().mockName('toujou-details-connected'),
  },
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

export const Details: Story = {
  render: (args) => html`
    <toujou-details
      class="details"
      element-design="default"
      ?is-open=${args['is-open']}
      @toujou-details-toggle=${args.onToggle}
      @toujou-details-connected=${args.onConnected}
    >
      <h3 slot="summary" class="details__title">Summary title</h3>
      <p slot="summary" class="details__subtitle">Summary subtitle</p>

      <i class="details__chevron icon icon--chevron-down" slot="chevron"></i>

      <div slot="content">
        <p>This is the details content. It can contain any HTML content.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </toujou-details>
  `,
};
