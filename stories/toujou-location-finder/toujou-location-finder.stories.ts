import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-location-finder/dist/index';
import '../../packages/toujou-map/dist/index';
import './toujou-location-finder.storyStyles.css';

import { mockFetch } from '../globals/js/mockFetch';
import { placesGeoMockResp } from "./mocks/plagcesgeo.mock";
import { placesTeaserMockResp_all, placesTeaserMockResp_singleTeaser } from "./mocks/placesteaser.mock";
import { THEME_NAMES } from "../globals/js/constants";

const MAPLIBRE_ACCESS_TOKEN = 'pk.eyJ1IjoiZGZhdSIsImEiOiJjbDdyanc5aHUwZzA2M29wMmM4cjJud2IxIn0.EtfjXD2re5QUhatJJoKPYg';



const meta: Meta = {
  title: 'Components/Toujou Location Finder',
  component: 'toujou-location-finder',
  argTypes: {
    'reduced-motion': {
      control: 'boolean',
      description: 'Disable map animations',
    },
  },
  args: {
    'reduced-motion': false,
    onReady: fn().mockName('toujou-location-finder-ready'),
  },
  parameters: {
    layout: 'fullscreen',
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

export const Default: Story = {
    decorators: [
      (story, context) => {
        mockFetch([
          {
            // GeoJSON endpoint
            match: (url) => url.includes('north='),
            response: {
              text: () => JSON.stringify(placesGeoMockResp),
              json: () => placesGeoMockResp,
            },
          },
          {
            // Single teaser for popup — no comma or %2C in the ids
            match: (url) => url.includes('ids=') && !url.includes('%2C') && !url.includes(','),
            response: {
              text: () => placesTeaserMockResp_singleTeaser,
            },
          },
          {
            // Multiple teasers for sidebar — has %2C (encoded comma)
            match: (url) => url.includes('ids=') && (url.includes('%2C') || url.includes(',')),
            response: {
              text: () => placesTeaserMockResp_all,
            },
          },
        ]);

        window.addEventListener('toujou-location-finder-ready', context.args.onReady);
        return story();
      },
    ],
  render: (args) => html`
    <toujou-location-finder
      class="location-finder"
      bounds="[8.2, 48.5, 9.5, 50.3]"
      teaserurl="/mock-teaser"
      geojsonurl="/mock-geojson"
      filterparams="&amp;pagetypes=34&amp;pages=1000435&amp;recursive=2&amp;hmac=3e4c316ebf46da7e82bcb3c911655e561fb95f52"
      map-style="mapbox://styles/mapbox/light-v10"
      access-token="${MAPLIBRE_ACCESS_TOKEN}"
      @toujou-location-finder-ready="${args.onReady}"
    >
      <button
        class="button location-finder__map-toggle"
        slot="location-finder-map-toggle"
      >
        <span class="location-finder__map-toggle-show-text">Show map</span>
        <span class="location-finder__map-toggle-hide-text">Hide map</span>
      </button>
    </toujou-location-finder>
  `,
};
