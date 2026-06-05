import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-slider-progressbar/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Slider Progressbar',
  component: 'toujou-slider-progressbar',
  argTypes: {
    height: {
      control: 'text',
      description: 'Height of the progressbar via --toujou-slider-progressbar-height CSS variable (e.g. "4px", ".5rem")',
    },
    'animation-duration': {
      control: 'text',
      description: 'Duration of animation via --toujou-slider-progressbar-animation-duration CSS variable (e.g. "6s", "500ms")'
    },
    color: {
      control: 'text',
      description: 'Color of the progressbar via --toujou-slider-progressbar-color CSS variable (e.g. "rgb(204 51 0)")'
    },
  },
  args: {
    height: '4px',
    'animation-duration': '6s',
    color: 'var(--color-primary)'
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
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'other', 'customizations'],
}

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <toujou-slider-progressbar
      style="
        --toujou-slider-progressbar-height: ${args.height};
        --toujou-slider-progressbar-animation-duration: ${args['animation-duration']};
        --toujou-slider-progressbar-color: ${args.color};
      "
    ></toujou-slider-progressbar>
  `,
};
