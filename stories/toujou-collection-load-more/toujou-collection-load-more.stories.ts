import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-collection-load-more/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Collection Load More',
  component: 'toujou-collection-load-more',
  argTypes: {
    'is-loading': {
      control: 'boolean',
      description: 'Shows the spinner slot instead of the default slot',
    },
  },
  args: {
    onLoadMoreDone: fn().mockName('toujou-collection-load-more-done'),
    onLoadMoreError: fn().mockName('toujou-collection-load-more-error'),
  },
  parameters: {
    toujouThemes: [
      THEME_NAMES.TOUJOU_V1,
      THEME_NAMES.TOUJOU_V1_5,
      THEME_NAMES.HISSU_V1,
      THEME_NAMES.HISSU_V1_5,
      THEME_NAMES.TABI_V1,
      THEME_NAMES.TABI_V1_5,
      THEME_NAMES.MEDATSU_V1,
      THEME_NAMES.MEDATSU_V1_5,
      THEME_NAMES.KOJO,
      THEME_NAMES.CUSTOMIZATIONS,
    ]
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'customizations']
};

export default meta;
type Story = StoryObj;

const FAKE_REQUEST_DELAY = 2000;

export const Default: Story = {
  decorators: [
    (story, context) => {
      window.addEventListener('toujou-collection-load-more-done', context.args.onLoadMoreDone);
      window.addEventListener('toujou-collection-load-more-error', context.args.onLoadMoreError);

      // Mock fetch to simulate a 3 second loading state
      window.fetch = () => new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            text: () => Promise.resolve(``),
          } as Response);
        }, FAKE_REQUEST_DELAY);
      });

      return story();
    }
  ],
  render: (args) => html`
    <toujou-collection-load-more class="collection-load-more" items-container-selector=".card-collection">
      <a href="#" class="storybook-button collection-load-more__button">Show more</a>
      <toujou-spinner slot="spinner" class="storybook-spinner collection-load-more__spinner"></toujou-spinner>
    </toujou-collection-load-more>
  `,
};
