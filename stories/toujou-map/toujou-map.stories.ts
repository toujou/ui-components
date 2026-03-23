import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-map/dist/index';

import { sharedArgTypes, sharedArgs, renderMapAttributes } from './toujou-map.shared';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Map',
  component: 'toujou-map',
  argTypes: {
    ...sharedArgTypes,
    onPopupOpened: { table: { disable: true } },
    onPopupClosed: { table: { disable: true } },
  },
  args: {
    ...sharedArgs,
    onPopupOpened: fn().mockName('toujou-map-popup-opened'),
    onPopupClosed: fn().mockName('toujou-map-popup-closed'),
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
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-map class="map" center="[11.0762549, 49.4579779]" ${renderMapAttributes(args)}></toujou-map>
    `;
    const map = wrapper.querySelector('toujou-map');
    map.addEventListener('toujou-map-ready', args.onReady);
    map.addEventListener('toujou-map-loaded', args.onLoaded);
    map.addEventListener('toujou-map-error', args.onError);
    return wrapper;
  },
};

export const WithMarker: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-map class="map" center="[11.0762549, 49.4579779]" ${renderMapAttributes(args)}>
        <toujou-map-marker color="var(--color-primary)"></toujou-map-marker>
      </toujou-map>
    `;
    const map = wrapper.querySelector('toujou-map');
    const marker = wrapper.querySelector('toujou-map-marker') as any;
    marker.coordinates = [11.0762549, 49.4579779];
    map.addEventListener('toujou-map-ready', args.onReady);
    map.addEventListener('toujou-map-loaded', args.onLoaded);
    map.addEventListener('toujou-map-error', args.onError);
    return wrapper;
  },
};

export const WithPopup: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <toujou-map class="map" center="[11.0762549, 49.4579779]" ${renderMapAttributes(args)}>
        <toujou-map-marker color="var(--color-primary)"></toujou-map-marker>
        <toujou-map-popup close-button close-on-outside-click>
          <div class="map-popup__content" style="padding: var(--spacing-s);">
            <h3>DFAU GmbH</h3>
            <p>Nice street 4, 12345 Nürnberg</p>
          </div>
        </toujou-map-popup>
      </toujou-map>
    `;
    const map = wrapper.querySelector('toujou-map');
    const marker = wrapper.querySelector('toujou-map-marker') as any;
    const popup = wrapper.querySelector('toujou-map-popup') as any;
    marker.coordinates = [11.0762549, 49.4579779];
    popup.coordinates = [11.0762549, 49.4579779];
    map.addEventListener('toujou-map-ready', args.onReady);
    map.addEventListener('toujou-map-loaded', args.onLoaded);
    map.addEventListener('toujou-map-error', args.onError);
    popup.addEventListener('toujou-map-popup-opened', args.onPopupOpened);
    popup.addEventListener('toujou-map-popup-closed', args.onPopupClosed);
    return wrapper;
  },
};
