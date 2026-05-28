import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-media-info/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Media Info',
  component: 'toujou-media-info',
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the media info panel is open',
    },
  },
  args: {
    open: false,
  },
  parameters: {
    toujouThemes: [
      THEME_NAMES.TOUJOU_V1_5,
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1.5', 'kojo', 'other', 'customizations']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <figure class="media-info-story__figure" style="position: relative; width: 100%; max-width: 640px; height: auto; aspect-ratio: var(--aspect-ratio-default); margin: 0;">
      <img
        class="media-info-story__image"
        src="https://picsum.photos/800/450"
        alt="Example image"
        style="width: 100%; height: auto; aspect-ratio: var(--aspect-ratio-default); object-fit: cover; vertical-align: middle;"
      />
      <toujou-media-info class="media-info" ?open=${args.open}>
        <button
          slot="open-button"
          class="media-info__toggle"
          aria-label="Show image info"
          style="background-color: var(--color-primary); color: white; padding: var(--spacing-xs) var(--spacing-s); border-radius: var(--border-radius-normal);"
        >open</button>
        <button
          slot="close-button"
          class="media-info__toggle"
          aria-label="Hide image info"
          style="background-color: var(--color-primary); color: white; padding: var(--spacing-xs) var(--spacing-s); border-radius: var(--border-radius-normal);"
        >close</button>
        <figcaption slot="figcaption" class="media-info__figcaption">
          This is the image caption with some descriptive text about the photo.
        </figcaption>
        <small slot="copyright" class="media-info__copyright">
          © 2025 Photographer Name
        </small>
      </toujou-media-info>
    </figure>
  `,
};
