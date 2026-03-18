import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-input-password-toggle/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Input Password Toggle',
  component: 'toujou-input-password-toggle',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <toujou-input-group class="input-group input-group--date-jquery" data-format="Y-m-d">
      <label class="input-label" for="facade">Input Password Toggle</label>
      <toujou-input-password-toggle>
        <input
          slot="input"
          type="password"
          class="input input--password"
          placeholder="Enter your password"
          aria-label="Password"
        />
        <button
          slot="show-password-button"
          type="button"
          aria-label="Show password"
          class="button"
          style="margin-top: 1rem;"
        >
          👁 Show
        </button>
        <button
          slot="hide-password-button"
          type="button"
          aria-label="Hide password"
          class="button"
          style="margin-top: 1rem;"
        >
          🙈 Hide
        </button>
      </toujou-input-password-toggle>
    </toujou-input-group>
  `,
};
