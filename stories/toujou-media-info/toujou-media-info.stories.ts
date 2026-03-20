import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-media-info/dist/index.js';
import './toujou-media-info.storyStyles.css';
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
    <figure class="media-info-story__figure">
      <img
        class="media-info-story__image"
        src="https://picsum.photos/800/450"
        alt="Example image"
      />
      <toujou-media-info class="media-info" ?open=${args.open}>
        <button slot="open-button" class="media-info__toggle" aria-label="Show image info">open</button>
        <button slot="close-button" class="media-info__toggle" aria-label="Hide image info">close</button>
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
