import { fn } from 'storybook/test';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-burger-button/src/index.ts';
import './toujou-burger-button.storyStyles.css';
import { THEME_NAMES } from '../globals/js/constants';

const meta: Meta = {
  title: 'Components/Toujou Burger Button',
  component: 'toujou-burger-button',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

const onStateChange = fn().mockName('burger-button-state-change');

export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <toujou-burger-button
          class="burger-button"
          role="button"
          aria-pressed="false"
          aria-haspopup="true"
          aria-controls="mainNavigation"
          aria-expanded="false"
          aria-label="Menu button"
          toggle-element-selector="#topbar"
          tabindex="0"
        >
          <span class="burger-button__line" line-position="top" aria-hidden="true" slot="content"></span>
          <span class="burger-button__line" line-position="middle" aria-hidden="true" slot="content"></span>
          <span class="burger-button__line" line-position="bottom" aria-hidden="true" slot="content"></span>
        </toujou-burger-button>
    `;

    const button = wrapper.querySelector('toujou-burger-button');

    button.addEventListener('toujou-burger-button-state-change', (event: CustomEvent) => {
      onStateChange(event);
    });

    return wrapper;
  },
};
