import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-tabs/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

interface TabItem {
  id: number;
  label: string;
  content: string;
}

interface TabsStoryArgs {
  orientation: string;
  alignment: string;
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 1,
    label: 'Item One',
    content: '<h3>This is the content for Item One</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
  },
  {
    id: 2,
    label: 'Item Two',
    content: '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
  },
  {
    id: 3,
    label: 'Item Three',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>',
  },
  {
    id: 4,
    label: 'Item Four with a longer name',
    content: '<p>Some small content</p>',
  },
  {
    id: 5,
    label: 'Item Five',
    content: '<p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
  },
];

const meta: Meta = {
  title: 'Components/Toujou Tabs',
  component: 'toujou-tabs',
  args: {
    orientation: 'horizontal',
    alignment: 'left',
  },
  argTypes: {
    orientation: {
      name: 'Orientation',
      description: 'Set the tabs element orientation',
      options: ['vertical', 'horizontal'],
      control: { type: 'radio' },
      table: {
        category: 'Tabs Settings',
        defaultValue: { summary: 'vertical' },
      },
    },
    alignment: {
      name: 'Buttons alignment',
      description: 'Set the alignment for the tabs buttons',
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
      table: {
        category: 'Tabs Settings',
        defaultValue: { summary: 'left' },
      },
    },
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
      THEME_NAMES.KOJO
    ]
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo']
};

export default meta;
type Story = StoryObj;

const renderTabButtons = (items: TabItem[]) => items.map((item, index) => `
    <button
        role="tab"
        aria-selected="${index === 0 ? 'true' : 'false'}"
        aria-controls="panel-${item.id}"
        id="tab-${item.id}"
        tabindex="${index === 0 ? '0' : '-1'}"
        class="tabs__button"
    >${item.label}</button>
`).join('');

const renderTabPanels = (items: TabItem[]) => items.map((item, index) => `
    <div
        id="panel-${item.id}"
        role="tabpanel"
        tabindex="0"
        aria-labelledby="tab-${item.id}"
        class="tabs__panel"
        ${index !== 0 ? 'hidden' : ''}
    >
        ${item.content}
    </div>
`).join('');

export const Default: Story = {
  render: (args) => `
      <toujou-tabs
          class="tabs"
          data-orientation="${args.orientation}"
          data-alignment="${args.alignment}"
          element-design="${args.elementDesign}"
      >
          <div class="tabs__header">
              <button
                  class="tabs__scroll-button tabs__scroll-button--prev"
                  aria-hidden="true"
                  aria-label="Scroll tab list left"
                  tabindex="-1"
                  hidden
              >
                  <toujou-icon class="icon icon--chevron-left" icon-name="chevron-left" icon-size="m" icon-color="font"></toujou-icon>
              </button>

              <div role="tablist" aria-label="Select a tab" class="tabs__buttons">
                  ${renderTabButtons(TAB_ITEMS)}
              </div>

              <button
                  class="tabs__scroll-button tabs__scroll-button--next"
                  aria-hidden="true"
                  aria-label="Scroll tab list right"
                  tabindex="-1"
                  hidden
              >
                  <toujou-icon class="icon icon--chevron-right" icon-name="chevron-right" icon-size="m" icon-color="font"></toujou-icon>
              </button>
          </div>

          <div class="tabs__panels">
              ${renderTabPanels(TAB_ITEMS)}
          </div>
      </toujou-tabs>
  `,
};

