import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-overlay/src/index';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Overlay',
  component: 'toujou-overlay',
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
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations'],
  argTypes: {
    delay: {
      control: { type: 'range', min: 0, max: 5000, step: 100 },
      description: 'Delay in milliseconds before the overlay appears',
    },
    'storage-mode': {
      control: 'radio',
      options: ['session', 'local', 'none'],
      description: 'Storage mode for remembering the overlay decision',
    },
    showLogo: {
      table: { category: 'Content' },
      control: 'boolean',
      description: 'Show a logo in the overlay',
    },
    showCloseButton: {
      table: { category: 'Content' },
      control: 'boolean',
      description: 'Show a close button',
    },
    showConclusionText: {
      table: { category: 'Content' },
      control: 'boolean',
      description: 'Show conclusion text below the buttons',
    },
    showBackgroundImage: {
      table: { category: 'Content' },
      control: 'boolean',
      description: 'Show a background image',
    },
  },
  args: {
    delay: 0,
    'storage-mode': 'session',
    showLogo: false,
    showCloseButton: false,
    showConclusionText: false,
    showBackgroundImage: false,
  },
};

export default meta;
type Story = StoryObj;

// Clear storage so the overlay always shows when the story loads
const clearOverlayStorage = () => {
  try {
    sessionStorage.removeItem('toujou-overlay-super-overlay');
    localStorage.removeItem('toujou-overlay-super-overlay');
  } catch (e) {
    // ignore
  }
};

export const Default: Story = {
  render: (args) => {
    clearOverlayStorage();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <main>
        <section style="padding: var(--spacing-normal);">
          <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. </p>
          <p>Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. </p>
          <p>Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere.</p>
          <p>Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.</p>
        </section>

        <section style="padding: var(--spacing-normal);">
          <button id="reset-overlay" class="button">
            🔄 Reset overlay (clear storage)
          </button>
        </section>

        <toujou-overlay
          id="super-overlay"
          class="overlay"
          delay="${args.delay}"
          storage-mode="${args['storage-mode']}"
          role="dialog"
          aria-modal="true"
          aria-label="Overlay"
        >
          <template>
            ${args.showBackgroundImage ? `
              <img src="https://picsum.photos/2400/2400" class="overlay__background" alt="" />
            ` : ''}

            <section class="overlay__infos">
              ${args.showLogo ? `
                <img class="overlay__logo" src="https://picsum.photos/640/320" alt="Logo" />
              ` : ''}

              <h1 class="overlay__title">Sind Sie 18 Jahre oder älter?</h1>

              <p class="overlay__warning">Leider haben Sie noch nicht das nötige Lebensalter erreicht.</p>

              <section class="overlay__buttons">
                <button
                  class="button overlay__button"
                  data-overlay-value="yes"
                >Ja, ich bin 18 Jahre oder älter</button>

                <button
                  class="button overlay__button"
                  data-overlay-value="no"
                >Nein, ich bin unter 18 Jahre alt</button>
              </section>

              ${args.showConclusionText ? `
                <p class="overlay__conclusion">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              ` : ''}

              ${args.showCloseButton ? `
                <button class="button overlay-button-close-trigger" aria-label="Close overlay">✕</button>
              ` : ''}
            </section>
          </template>
        </toujou-overlay>
      </main>
    `;

    wrapper.querySelector('#reset-overlay').addEventListener('click', () => {
      clearOverlayStorage();
      const overlay = wrapper.querySelector('toujou-overlay') as any;
      overlay.opened = true;
    });

    return wrapper;
  },
};

