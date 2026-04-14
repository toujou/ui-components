import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-topbar/dist/index.js';
import '../../packages/toujou-burger-button/dist/index.js';

import { initMainNav } from '../globals/js/main-nav.js';
import { initTopbarActionsKeyboardBehavior } from '../globals/js/topbar-actions.js';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Topbar',
  component: 'toujou-topbar',
  parameters: {
    layout: 'fullscreen',
    toujouThemes: [THEME_NAMES.KOJO],
  },
  tags: ['kojo'],
  argTypes: {
    logoSize: {
      table: { category: 'Topbar settings', defaultValue: { summary: 'medium' } },
      description: 'Size of the logo',
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    titleType: {
      table: { category: 'Topbar settings', defaultValue: { summary: 'logo' } },
      description: 'Toggle between logo or text for the mobile page title',
      options: ['logo', 'title'],
      control: { type: 'radio' },
    },
    noTransitions: {
      table: { category: 'Topbar settings', defaultValue: { summary: 'false' } },
      description: 'Remove transitions from topbar elements',
      control: { type: 'boolean' },
    },
    openOnHover: {
      table: { category: 'Topbar settings', defaultValue: { summary: 'false' } },
      description: 'Open sub-navigation on hover',
      control: { type: 'boolean' },
    },
    languagePickerType: {
      table: { category: 'Topbar settings' },
      description: 'Type of language picker to show',
      options: ['none', 'inline', 'dropdown'],
      control: { type: 'radio' },
    },
  },
  args: {
    logoSize: 'medium',
    titleType: 'logo',
    noTransitions: false,
    openOnHover: false,
    languagePickerType: 'inline',
    onBreakpointChange: fn().mockName('toujou-topbar-breakpoint-change'),
  },
};

export default meta;
type Story = StoryObj;

const renderLogoSection = (args) => `
  <nav aria-label="Topbar Logo" style="display: contents;">
    <a aria-label="Zur Startseite" show-title-on-mobile="${args.titleType === 'title'}" class="topbar__logo-link" href="/">
      <span class="topbar__title">toujou Installation</span>
      <img class="topbar__logo topbar__logo--svg" src="https://picsum.photos/300/150" alt="Logo">
    </a>
  </nav>
`;

const renderActionsSection = () => `
  <ul class="topbar__actions">
    <li class="topbar__actions-item">
      <a href="#" class="topbar__actions-link" aria-label="Contact">
        <span class="topbar__actions-text">Contact</span>
        <i class="icon icon--size-xl icon--telephone" aria-hidden="true"></i>
      </a>
    </li>
    <li class="topbar__actions-item">
      <a href="#" class="topbar__actions-link" aria-label="Search">
        <span class="topbar__actions-text">Search</span>
        <i class="icon icon--size-xl icon--search" aria-hidden="true"></i>
      </a>
    </li>
  </ul>
`;

const renderLanguagePicker = (type) => {
  if (type === 'inline') {
    return `
      <nav class="language-picker" aria-label="Language picker">
        <ul class="language-picker__list">
          <li class="language-picker__item">
            <a href="#" class="language-picker__link" lang="en" hreflang="en" aria-current="true" aria-label="English">
              <span class="language-picker__iso-code">EN</span>
            </a>
          </li>
          <li class="language-picker__item">
            <a href="#" class="language-picker__link" lang="de" hreflang="de" aria-label="Deutsch">
              <span class="language-picker__iso-code">DE</span>
            </a>
          </li>
          <li class="language-picker__item">
            <a href="#" class="language-picker__link" lang="pt" hreflang="pt" aria-label="Português">
              <span class="language-picker__iso-code">PT</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  } else if (type === 'dropdown') {
    return `
      <nav class="language-picker-dropdown" aria-label="Language picker">
        <select name="language-picker" id="language-picker" class="language-picker-dropdown__select">
          <option value="#" selected>EN</option>
          <option value="#">DE</option>
          <option value="#">PT</option>
        </select>
        <label class="language-picker-dropdown__label" for="language-picker">▾</label>
      </nav>
    `;
  }
  return '';
};

const renderBurgerSection = () => `
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

const renderMainNav = (openOnHover) => `
  <nav id="mainNavigation" class="main-nav" aria-label="Main navigation" ${openOnHover ? 'data-is-open-on-hover' : ''}>
    <ul class="main-nav__list" data-nav-list-level="1">
      <li class="main-nav__list-item" data-nav-item-level="1">
        <a href="#" class="main-nav__link" aria-current="page">
          <span class="main-nav__text">Startseite</span>
        </a>
      </li>
      <li class="main-nav__list-item" data-nav-item-level="1" data-has-subnav>
        <a href="#" class="main-nav__link">
          <span class="main-nav__text" id="label_nav2">Bürgerservice</span>
        </a>
        <button class="main-nav__chevron" aria-label="Toggle menu Bürgerservice" aria-controls="nav2" aria-expanded="false" aria-pressed="false">
            <i class="icon icon--size-xl icon--chevron-down" aria-hidden="true"></i>
        </button>
        <ul class="main-nav__list" data-nav-list-level="2" id="nav2" aria-labelledby="label_nav2">
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Arbeit und Beruf</span></a>
          </li>
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Ausweise und Dokumente</span></a>
          </li>
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Bauen</span></a>
          </li>
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Familie und Partnerschaften</span></a>
          </li>
        </ul>
      </li>
      <li class="main-nav__list-item" data-nav-item-level="1">
        <a href="#" class="main-nav__link">
          <span class="main-nav__text">Online-Terminvergabe</span>
        </a>
      </li>
      <li class="main-nav__list-item" data-nav-item-level="1" data-has-subnav>
        <a href="#" class="main-nav__link">
          <span class="main-nav__text" id="label_nav4">Häufige Fragen</span>
        </a>
        <button class="main-nav__chevron" aria-label="Toggle menu Häufige Fragen" aria-controls="nav4" aria-expanded="false" aria-pressed="false">
            <i class="icon icon--size-xl icon--chevron-down" aria-hidden="true"></i>
        </button>
        <ul class="main-nav__list" data-nav-list-level="2" id="nav4" aria-labelledby="label_nav4">
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Arbeit und Beruf</span></a>
          </li>
          <li class="main-nav__list-item" data-nav-item-level="2">
            <a href="#" class="main-nav__link"><span class="main-nav__text">Ausweise und Dokumente</span></a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
`;

const renderServiceNav = () => `
  <nav class="service-nav">
    <a href="#" class="service-nav__link">Impressum</a>
    <a href="#" class="service-nav__link">Datenschutz</a>
    <a href="#" class="service-nav__link">Kontakt</a>
  </nav>
`;

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.style.containerType = 'inline-size';
    wrapper.style.containerName = 'containerWrapper';

    wrapper.innerHTML = `
      <toujou-topbar
        id="topbar"
        class="topbar"
        logo-size="${args.logoSize}"
        ${args.noTransitions ? 'no-transitions' : ''}
      >
        ${renderLogoSection(args)}
        ${renderActionsSection()}
        ${args.languagePickerType !== 'none' ? renderLanguagePicker(args.languagePickerType) : ''}
        ${renderBurgerSection()}
        ${renderMainNav(args.openOnHover)}
        ${renderServiceNav()}
      </toujou-topbar>
    `;

    const topbar = wrapper.querySelector('toujou-topbar');
    topbar.addEventListener('toujou-topbar-breakpoint-change', args.onBreakpointChange);

    /* Initialize the custom JS for the main nav */
    setTimeout(() => {
      initMainNav();
      initTopbarActionsKeyboardBehavior();
    });

    return wrapper;
  },
};
