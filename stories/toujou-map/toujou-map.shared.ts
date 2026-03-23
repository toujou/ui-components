import type { ArgTypes } from '@storybook/web-components';
import { fn } from 'storybook/test';

import { MAPLIBRE_ACCESS_TOKEN, MAP_STYLE } from '../globals/js/constants';

export { MAPLIBRE_ACCESS_TOKEN };

export const sharedArgTypes: Partial<ArgTypes> = {
  'map-style': {
    control: { type: 'select' },
    options: [
      'mapbox://styles/mapbox/light-v10',
      'mapbox://styles/mapbox/dark-v10',
      'mapbox://styles/mapbox/streets-v11',
      'mapbox://styles/mapbox/satellite-v9',
    ],
    description: 'The map style URL',
  },
  'zoom-on-scroll': {
    control: { type: 'boolean' },
    description: 'Enable zooming with the scroll wheel',
  },
  'reduced-motion': {
    control: { type: 'boolean' },
    description: 'Disable map animations',
  },
  'fullscreen-control': {
    control: { type: 'boolean' },
    description: 'Show the fullscreen control button',
  },
  'zoom-level': {
    table: {
      category: 'Mapbox settings',
      defaultValue: { summary: '12' },
    },
    name: 'Zoom level',
    description: "Choose the map's initial zoom level",
    control: { type: 'range', min: 0, max: 22, step: 1 },
  },
};

export const sharedArgs = {
  'map-style': MAP_STYLE,
  'zoom-level': 12,
  'zoom-on-scroll': false,
  'reduced-motion': false,
  'fullscreen-control': false,
  onReady: fn().mockName('toujou-map-ready'),
  onLoaded: fn().mockName('toujou-map-loaded'),
  onError: fn().mockName('toujou-map-error'),
};

export const renderMapAttributes = (args) => `
  access-token="${MAPLIBRE_ACCESS_TOKEN}"
  map-style="${args['map-style']}"
  ${args['zoom-on-scroll'] ? 'zoom-on-scroll' : ''}
  ${args['reduced-motion'] ? 'reduced-motion' : ''}
  ${args['fullscreen-control'] ? 'fullscreen-control' : ''}
  zoom="${args['zoom-level']}"
  interactive
`;
