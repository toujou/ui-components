import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-counter/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Counter',
  component: 'toujou-counter',
  argTypes: {
    startNumber: {
      control: 'text',
      description: 'The number to start counting from',
    },
    endNumber: {
      control: 'text',
      description: 'The number to count up/down to',
    },
    animationSpeed: {
      control: 'select',
      options: ['slow', 'medium', 'fast'],
      description: 'The animation speed — maps to a CSS variable on the component',
    },
    showPrefix: {
      control: 'boolean',
      description: 'Show the + prefix before the number',
    },
    showSuffix: {
      control: 'boolean',
      description: 'Show the suffix after the number',
    },
  },
  args: {
    startNumber: '0',
    endNumber: '1000',
    animationSpeed: 'slow',
    showPrefix: false,
    showSuffix: false,
    onAnimationStart: fn().mockName('toujou-counter-animation-start'),
    onAnimationEnd: fn().mockName('toujou-counter-animation-end'),
    onInit: fn().mockName('toujou-counter-init'),
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

export const Default: Story = {
  render: (args) => {
    console.log(args)
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <ul class="counter-grid" number-of-items="1">
        <li class="counter-grid__item">
          <toujou-counter
            class="counter"
            aria-label="Counter element"
            element-design="default"
            start-number="${args.startNumber}"
            end-number="${args.endNumber}"
            animationSpeed="${args.animationSpeed}"
            tabindex="0"
          >
            <figure class="counter__figure">
              <img class="counter__image" src="https://picsum.photos/84" alt="" loading="lazy">
            </figure>

            <span class="counter__number">
              ${args.showPrefix ? `<span class="counter__number-prefix">+</span>` : ''}
              <span class="counter__number-text">${args.endNumber}</span>
              ${args.showSuffix ? `<span class="counter__number-suffix">Km</span>` : ''}
            </span>

            <p class="counter__title">Default</p>
          </toujou-counter>
        </li>
      </ul>
    `;

    const counter = wrapper.querySelector('toujou-counter');
    counter.addEventListener('toujou-counter-animation-start', args.onAnimationStart);
    counter.addEventListener('toujou-counter-animation-end', args.onAnimationEnd);
    counter.addEventListener('toujou-counter-init', args.onInit);

    return wrapper;
  },
};

