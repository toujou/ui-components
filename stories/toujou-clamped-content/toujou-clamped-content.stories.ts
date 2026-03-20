import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-clamped-content/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";
import './toujou-clamped-content.storyStyles.css';

const meta: Meta = {
  title: 'Components/Toujou Clamped Content',
  component: 'toujou-clamped-content',
  argTypes: {
    'is-open': {
      control: 'boolean',
      description: 'Whether the clamped content is initially expanded',
    },
  },
  args: {
    'is-open': false,
    onChanged: fn().mockName('toujou-clamped-content-changed'),
    onClampEnabledChanged: fn().mockName('toujou-clamped-content-clamp-enabled-changed'),
  },
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <toujou-clamped-content
      class="clamped-content"
      ?is-open=${args['is-open']}
      @toujou-clamped-content-changed=${args.onChanged}
      @toujou-clamped-content-clamp-enabled-changed=${args.onClampEnabledChanged}
    >
      <div slot="clamped-content">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
      </div>
      <button slot="show-button">Show more</button>
      <button slot="hide-button">Show less</button>
    </toujou-clamped-content>
  `,
};
