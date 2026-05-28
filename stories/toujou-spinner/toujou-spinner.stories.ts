import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-spinner/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Spinner',
  component: 'toujou-spinner',
  argTypes: {
    size: {
      control: 'text',
      description: 'Size of the spinner via --toujou-spinner-size CSS variable (e.g. "5rem", "80px")',
    },
    thickness: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Stroke thickness via --toujou-spinner-thickness CSS variable',
    },
    'centered-on-page': {
      control: 'boolean',
      description: 'When present, the spinner is fixed and centered on the page',
    },
  },
  args: {
    size: '5rem',
    thickness: 4,
    'centered-on-page': false,
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
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <toujou-spinner
      class="spinner"
      ?centered-on-page=${args['centered-on-page']}
      style="
        --toujou-spinner-size: ${args.size};
        --toujou-spinner-thickness: ${args.thickness};
      "
    ></toujou-spinner>
  `,
};

