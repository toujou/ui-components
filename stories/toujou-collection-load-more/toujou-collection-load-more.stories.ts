// stories/toujou-collection-load-more/toujou-collection-load-more.stories.ts
import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-collection-load-more/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";
import './toujou-collection-load-more.storyStyles.css';

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
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
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
