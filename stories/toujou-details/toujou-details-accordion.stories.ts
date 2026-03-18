import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-details/src/index.ts';
import './toujou-details.storyStyles.css';
import './toujou-details-accordion.stoyStyles.css';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Details',
  component: 'toujou-details-accordion',
  argTypes: {
    'single-expand-mode': {
      control: 'boolean',
      description: 'When true, opening one details element closes all others',
    },
  },
  args: {
    'single-expand-mode': false,
    onToggle: fn().mockName('toujou-details-toggle'),
    onAccordionConnected: fn().mockName('toujou-details-accordion-connected'),
  },
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

const renderAccordion = (args) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <toujou-details-accordion
      class="details-accordion"
      ${args['single-expand-mode'] ? 'single-expand-mode' : ''}
    >
      <toujou-details
        id="details-1"
        class="details"
        element-design="default"
        ?is-open=${args['is-open']}
        @toujou-details-toggle=${args.onToggle}
        @toujou-details-connected=${args.onConnected}
      >
        <h3 slot="summary" class="details__title">Summary title 1</h3>
        <p slot="summary" class="details__subtitle">Summary subtitle 1</p>

        <i class="details__chevron icon icon--chevron-down" slot="chevron"></i>

        <div slot="content">
          <h4>Content 1</h4>
          <p>This is the details content. It can contain any HTML content.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </toujou-details>

      <toujou-details
        id="details-2"
        class="details"
        element-design="default"
        ?is-open=${args['is-open']}
        @toujou-details-toggle=${args.onToggle}
        @toujou-details-connected=${args.onConnected}
      >
        <h3 slot="summary" class="details__title">Summary title 2</h3>
        <p slot="summary" class="details__subtitle">Summary subtitle 2</p>

        <i class="details__chevron icon icon--chevron-down" slot="chevron"></i>

        <div slot="content">
          <h4>Content 2</h4>
          <p>This is the details content. It can contain any HTML content.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </toujou-details>

        <toujou-details
          id="details-3"
          class="details"
          element-design="default"
          ?is-open=${args['is-open']}
          @toujou-details-toggle=${args.onToggle}
          @toujou-details-connected=${args.onConnected}
        >
          <h3 slot="summary" class="details__title">Summary title 3</h3>
          <p slot="summary" class="details__subtitle">Summary subtitle 3</p>

          <i class="details__chevron icon icon--chevron-down" slot="chevron"></i>

          <div slot="content">
            <h4>Content 3</h4>
            <p>This is the details content. It can contain any HTML content.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </toujou-details>
      </toujou-details-accordion>
  `;

  const accordion = wrapper.querySelector('toujou-details-accordion');
  accordion.addEventListener('toujou-details-toggle', args.onToggle);
  accordion.addEventListener('toujou-details-accordion-connected', args.onAccordionConnected);

  return wrapper;
};

export const DetailsAccordion: Story = {
  render: (args) => renderAccordion(args),
};
