import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import '../../packages/toujou-input-file/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Input File',
  component: 'toujou-input-file',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO, THEME_NAMES.CUSTOMIZATIONS]
  },
  tags: ['kojo', 'customizations']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <toujou-input-group class="input-group input-group--file">
      <label class="input-label" for="facade">Input File</label>
      <toujou-input-file>
        <input
          slot="input"
          data-element-type="FileUpload"
          type="file"
          class="input input--file-upload"
          placeholder="Add a file"
          aria-label="File"
        />
        <button
          slot="clear-chosen-file-button"
          type="button"
          aria-label="Clear file input"
          class="button"
          style="margin-top: 1rem;"
        >
          🗑️ Clear
        </button>
      </toujou-input-file>
    </toujou-input-group>
  `,
};
