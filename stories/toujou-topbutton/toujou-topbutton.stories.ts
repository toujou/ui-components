import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-topbutton/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Topbutton',
  component: 'toujou-topbutton',
  parameters: {
    layout: 'fullscreen',
    toujouThemes: [THEME_NAMES.KOJO],
  },
  tags: ['kojo'],
};

export default meta;
type Story = StoryObj;

const loremIpsum = `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;

export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.marginBottom = 'var(--spacing-xl)';

    wrapper.innerHTML = `
      <main style="padding: 2rem;">
        <h1>Topbutton</h1>
        <h5>Scroll down to see the topbutton appear</h5>
        ${loremIpsum.repeat(40)}

        <toujou-topbutton
          title="Nach oben"
          aria-label="Nach oben"
          class="topbutton"
          role="button"
          tabindex="0"
        >
          <i class="icon icon--arrow-left" style="rotate: 90deg; background-color: var(--color-bg)"></i>
        </toujou-topbutton>
      </main>
    `;

    return wrapper;
  },
};

