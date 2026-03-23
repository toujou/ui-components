import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-timeline/dist/index.js';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Timeline',
  component: 'toujou-timeline',
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
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo'],
  argTypes: {
    direction: {
      table: { category: 'Timeline Settings', defaultValue: { summary: 'vertical' } },
      description: 'Choose between a vertical or horizontal timeline',
      options: ['vertical', 'horizontal'],
      control: { type: 'radio' },
    },
    showLegend: {
      table: { category: 'Timeline Settings', defaultValue: { summary: 'false' } },
      description: 'Show the legend element',
      control: { type: 'boolean' },
    },
  },
  args: {
    direction: 'vertical',
    showLegend: false,
    onReady: fn().mockName('toujou-timeline-ready'),
    onNewObservation: fn().mockName('toujou-timeline-new-observation'),
  },
};

export default meta;
type Story = StoryObj;

const timelineItems = [
  { year: '2023', id: 'timeline-year-2023', title: 'Title 2023', subtitle: '12 November', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.' },
  { year: null, id: null, title: 'Title without year', subtitle: '14 Januar', text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { year: '2024', id: 'timeline-year-2024', title: 'Title 2024', subtitle: 'Subtitle 2024', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.' },
  { year: '2025', id: 'timeline-year-2025', title: 'Title 2025', subtitle: 'Some subtitle', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
  { year: '2026', id: 'timeline-year-2026', title: 'Title 2026', subtitle: 'Nice subtitle', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
  { year: '2027', id: 'timeline-year-2027', title: 'Title 2027', subtitle: 'Crazy subtitle', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
  { year: '2028', id: 'timeline-year-2028', title: 'Title 2028', subtitle: 'Another subtitle', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.' },
];

const renderLegend = () => `
  <toujou-timeline-legend class="timeline-legend">
    <ul class="timeline-legend__list">
      ${timelineItems
  .filter((item) => item.year)
  .map((item) => `
          <li class="timeline-legend__item">
            <a href="#${item.id}" class="timeline-legend__link">${item.year}</a>
          </li>
        `).join('')}
    </ul>
  </toujou-timeline-legend>
`;

const renderItems = () =>
  timelineItems.map((item) => `
    <toujou-timeline-item class="timeline-item" role="listitem">
      ${item.year ? `<h2 class="timeline-item__year" id="${item.id}">${item.year}</h2>` : ''}
      <div class="timeline-card">
        <figure class="timeline-card__figure">
          <img class="timeline-card__image" src="https://picsum.photos/400/300" alt="" loading="lazy" />
        </figure>
        <div class="timeline-card__bottom">
          <h3 class="timeline-card__title">${item.title}</h3>
          <h4 class="timeline-card__subtitle">${item.subtitle}</h4>
          <p class="timeline-card__text">${item.text}</p>
          <a href="#" class="timeline-card__button">Read more</a>
        </div>
      </div>
    </toujou-timeline-item>
  `).join('');

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <main style="container-type: inline-size; container-name: mainContainer;">
        <toujou-timeline
          class="timeline"
          timeline-direction="${args.direction}"
          ${args.showLegend ? 'timeline-show-legend' : ''}
          aria-label="Timeline"
        >
          ${args.showLegend ? renderLegend() : ''}
          <div class="timeline__container" role="list">
            ${renderItems()}
          </div>
        </toujou-timeline>
      </main>
    `;

    const timeline = wrapper.querySelector('toujou-timeline');
    timeline.addEventListener('toujou-timeline-ready', args.onReady);
    timeline.addEventListener('toujou-timeline-new-observation', args.onNewObservation);

    return wrapper;
  },
};
