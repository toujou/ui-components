import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-map/src/index';

import { sharedArgTypes, sharedArgs, MAPLIBRE_ACCESS_TOKEN } from './toujou-map.shared';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Map',
  component: 'toujou-map-static',
  argTypes: {
    'map-style': sharedArgTypes['map-style'],
    'zoom-level': sharedArgTypes['zoom-level'],
  },
  args: {
    'map-style': sharedArgs['map-style'],
    'zoom-level': sharedArgs['zoom-level'],
  },
  parameters: {
    layout: 'centered',
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
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations']
};

export default meta;
type Story = StoryObj;

export const Static: Story = {
  render: (args) => html`
    <toujou-map-static
      access-token="${MAPLIBRE_ACCESS_TOKEN}"
      map-style="${args['map-style']}"
      .center="${[11.0762549, 49.4579779]}"
      .width="${600}"
      .height="${400}"
      .zoom="${args['zoom-level']}"
    >
      <toujou-map-marker
        color="#ff0000"
        .coordinates="${[11.0762549, 49.4579779]}"
      ></toujou-map-marker>
    </toujou-map-static>
  `,
};
