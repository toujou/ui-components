import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-rating-stars/src/index.ts';

const meta: Meta = {
  title: 'Components/Toujou Rating Stars',
  component: 'toujou-rating-stars',
  argTypes: {
    'rating-value': {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
      description: 'The rating value. Supports decimal values for partial stars',
    },
    'rating-suffix': {
      control: 'text',
      description: 'Optional suffix shown after the stars (e.g. "4.5 / 5")',
    },
  },
  args: {
    'rating-value': 3.5,
    'rating-suffix': '',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <toujou-rating-stars
      class="rating-stars"
      rating-value="${args['rating-value']}"
      rating-total="5"
      rating-suffix="${args['rating-suffix']}"
      aria-label="${args['rating-value']} out of ${args['rating-total']} stars"
    ></toujou-rating-stars>
  `,
};

