import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Exit Warning',
  component: 'exit-warning',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO, THEME_NAMES.OTHER]
  },
  tags: ['kojo', 'other']
};

export default meta;
type Story = StoryObj;

export const ToujouExitWarning: Story = {
  render: (args) => html`
    <p>
      <span style="font-weight: bold;">
        This component cannot be rendered here
      </span>
      because it depends on <code>toujou-modal</code>, which is not available in this project.
    </p>
    <p>Please refer to the Docs tab for more info!</p>
  `,
};
