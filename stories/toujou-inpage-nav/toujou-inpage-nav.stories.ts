import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-inpage-nav/src/index.ts';
import './toujou-inpage-nav.storyStyles.css';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Inpage Nav',
  component: 'toujou-inpage-nav',
  argTypes: {
    alignment: {
      control: 'radio',
      options: ['left', 'center'],
      description: 'Alignment of the nav items',
    },
    width: {
      control: 'radio',
      options: ['text', 'wide', 'fullwidth'],
      description: 'Width of the inpage nav element',
    },
    showLabel: {
      control: 'boolean',
      description: 'Show the label element',
    },
    showCTA: {
      control: 'boolean',
      description: 'Show the CTA button',
    },
    isSticky: {
      control: 'boolean',
      description: 'Whether the nav sticks to the top when scrolling',
    },
  },
  args: {
    alignment: 'left',
    width: 'text',
    showLabel: true,
    showCTA: true,
    isSticky: false,
    onConnected: fn().mockName('toujou-inpage-nav-connected'),
    onDisconnected: fn().mockName('toujou-inpage-nav-disconnected'),
    onStuckStateChange: fn().mockName('toujou-inpage-nav-stuck-state-change'),
  },
  parameters: {
    layout: 'fullscreen',
    toujouThemes: [THEME_NAMES.KOJO, THEME_NAMES.OTHER, THEME_NAMES.CUSTOMIZATIONS],
  },
  tags: ['kojo', 'other', 'customizations']
};

export default meta;
type Story = StoryObj;

const sectionsData = [
  { id: 'section-one', label: 'Section One' },
  { id: 'section-two', label: 'Section Two' },
  { id: 'section-three', label: 'Section Three' },
];

const loremIpsum = `
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
`;

const renderInpageNav = (args) => `
  <toujou-inpage-nav
    class="inpage-nav"
    alignment="${args.alignment}"
    element-width="${args.width}"
    element-design="default"
    ${args.isSticky ? 'is-sticky' : ''}
  >
    <button
      class="inpage-nav__toggle"
      aria-label="Toggle the inpage navigation"
      aria-expanded="false"
      aria-hidden="false"
      aria-controls="inpage-nav-list"
    >
      <i class="icon icon--chevron-down"></i>
    </button>

    ${args.showLabel ? `<span class="inpage-nav__label">Auf dieser Seite</span>` : ''}

    <nav id="inpage-nav-list" class="inpage-nav__nav">
      <ul class="inpage-nav__list">
        ${sectionsData.map((section) => `
          <li class="inpage-nav__item">
            <a class="inpage-nav__link" href="#${section.id}">${section.label}</a>
          </li>
        `).join('')}
      </ul>
    </nav>

    ${args.showCTA ? `
      <a href="#" slot="cta" class="button inpage-nav__cta">Buy now</a>
    ` : ''}
  </toujou-inpage-nav>
`;

const renderSections = () =>
  sectionsData.map((section) => `
    <section id="${section.id}" class="inpage-nav-story__section">
      <h2>${section.label}</h2>
      ${loremIpsum}
    </section>
  `).join('');

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <main class="inpage-nav-story">
        ${renderInpageNav(args)}
        ${renderSections()}
      </main>
    `;

    const nav = wrapper.querySelector('toujou-inpage-nav');
    nav.addEventListener('toujou-inpage-nav-connected', args.onConnected);
    nav.addEventListener('toujou-inpage-nav-disconnected', args.onDisconnected);
    nav.addEventListener('toujou-inpage-nav-stuck-state-change', args.onStuckStateChange);

    return wrapper;
  },
};
