import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-map/dist/index';
import { sharedArgTypes, sharedArgs, MAPLIBRE_ACCESS_TOKEN } from './toujou-map.shared';

const meta: Meta = {
  title: 'Components/Toujou Map',
  component: 'toujou-map-static',
  parameters: { layout: 'centered' },
  argTypes: {
    'map-style': sharedArgTypes['map-style'],
    'zoom-level': sharedArgTypes['zoom-level'],
  },
  args: {
    'map-style': sharedArgs['map-style'],
    'zoom-level': sharedArgs['zoom-level'],
  },
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
