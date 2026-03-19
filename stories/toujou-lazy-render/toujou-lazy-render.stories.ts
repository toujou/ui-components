import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-lazy-render/src/index.ts';
import './toujou-lazy-render.storyStyles.css';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Lazy Render',
  component: 'toujou-lazy-render',
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
  render: () => html`
    <div class="lazy-render-story">
      <p class="lazy-render-story__hint">⬇ Scroll down to see the lazy rendered content appear</p>

      <!-- Spacer to push the component below the fold -->
      <div class="lazy-render-story__spacer"></div>

      <toujou-lazy-render>
        <template>
          <div class="lazy-render-story__content">
            <h2>Lazy rendered content</h2>
            <p>This content was rendered when this component became visible in the viewport.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </template>
      </toujou-lazy-render>

      <toujou-lazy-render>
        <template>
          <div class="lazy-render-story__content">
            <h2>Some other lazy rendered content</h2>
            <p>This content was rendered when this component became visible in the viewport.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </template>
      </toujou-lazy-render>
    </div>
  `,
};
