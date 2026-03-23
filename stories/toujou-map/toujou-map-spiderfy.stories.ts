import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-map/dist/index';

import { sharedArgTypes, sharedArgs, renderMapAttributes } from './toujou-map.shared';
import { spiderfyGeoMock } from './mocks/spiderfy.mock';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Map',
  component: 'toujou-map-spiderfy',
  argTypes: sharedArgTypes,
  args: sharedArgs,
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

export const Spiderfy: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-map class="map" center="[11.0762549, 49.4579779]" zoom="11" ${renderMapAttributes(args)}>
        <toujou-map-geojson source-id="spiderfy-source" cluster cluster-radius="40" cluster-max-zoom="14"></toujou-map-geojson>
        <toujou-map-layer layer-id="clusters" source="spiderfy-source" type="circle"></toujou-map-layer>
        <toujou-map-layer layer-id="cluster-count" source="spiderfy-source" type="symbol"></toujou-map-layer>
        <toujou-map-layer layer-id="unclustered-points" source="spiderfy-source" type="circle"></toujou-map-layer>
        <toujou-map-layer layer-id="spiderfy-points" source="spiderfy-legs" type="circle"></toujou-map-layer>
        <toujou-map-layer layer-id="spiderfy-lines" source="spiderfy-legs" type="line"></toujou-map-layer>
        <toujou-map-spiderfy source-id="spiderfy-legs" source="spiderfy-source" min-zoom="12"></toujou-map-spiderfy>
      </toujou-map>
    `;

    const map = wrapper.querySelector('toujou-map');
    const geoJson = wrapper.querySelector('toujou-map-geojson') as any;
    const clusterLayer = wrapper.querySelector('[layer-id="clusters"]') as any;
    const clusterCountLayer = wrapper.querySelector('[layer-id="cluster-count"]') as any;
    const unclusteredLayer = wrapper.querySelector('[layer-id="unclustered-points"]') as any;
    const spiderfyPointsLayer = wrapper.querySelector('[layer-id="spiderfy-points"]') as any;
    const spiderfyLinesLayer = wrapper.querySelector('[layer-id="spiderfy-lines"]') as any;
    const spiderfy = wrapper.querySelector('toujou-map-spiderfy') as any;

    clusterLayer.filter = ['has', 'point_count'];
    clusterLayer.paint = { 'circle-color': '#007ce8', 'circle-radius': 20 };
    clusterCountLayer.filter = ['has', 'point_count'];
    clusterCountLayer.layout = { 'text-field': '{point_count_abbreviated}', 'text-size': 14 };
    clusterCountLayer.paint = { 'text-color': '#ffffff' };
    unclusteredLayer.filter = ['!', ['has', 'point_count']];
    unclusteredLayer.paint = { 'circle-color': '#007ce8', 'circle-radius': 8 };
    spiderfyPointsLayer.filter = ['==', '$type', 'Point'];
    spiderfyPointsLayer.paint = { 'circle-color': '#0050b3', 'circle-radius': 8 };
    spiderfyLinesLayer.filter = ['==', '$type', 'LineString'];
    spiderfyLinesLayer.paint = { 'line-color': '#0050b3', 'line-width': 1 };
    spiderfy.leavesSeparation = 60;

    map.addEventListener('toujou-map-ready', (e) => {
      args.onReady(e);
      setTimeout(() => { geoJson.sourceData = spiderfyGeoMock; }, 100);
    });
    map.addEventListener('toujou-map-loaded', args.onLoaded);
    map.addEventListener('toujou-map-error', args.onError);

    return wrapper;
  },
};
