import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';

import '../../packages/toujou-countdown/src/index.ts';

import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Countdown',
  component: 'toujou-countdown',
  argTypes: {
    targetDate: {
      control: 'date',
      description: 'The target date/time for the countdown',
    },
    hideLabels: {
      table: {
        category: 'Countdown Settings',
      },
      control: 'boolean',
      description: 'Hide the countdown labels',
    },
    hideFinishedDays: {
      table: {
        category: 'Countdown Settings',
      },
      control: 'boolean',
      description: 'Hide the days element once it reaches 00',
    },
    hideCounterOnFinished: {
      table: {
        category: 'Countdown Settings',
      },
      control: 'boolean',
      description: 'Hide the counter element once the target date has been reached',
    },
  },
  args: {
    targetDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
    hideLabels: false,
    hideFinishedDays: false,
    hideCounterOnFinished: false,
    onFinished: fn().mockName('toujou-countdown-finished'),
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
  tags: [
    'toujou v1',
    'toujou v1.5',
    'hissu v1',
    'hissu v1.5',
    'tabi v1',
    'tabi v1.5',
    'medatsu v1',
    'medatsu v1.5',
    'kojo'
  ]
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <toujou-countdown
        class="countdown"
        target-date="${new Date(args.targetDate).toISOString()}"
        aria-label="Countdown element"
        role="timer"
        element-design="default"
        ${args.hideLabels ? 'hide-labels' : ''}
        ${args.hideFinishedDays ? 'hide-finished-days' : ''}
        ${args.hideCounterOnFinished ? 'hide-counter-when-finished' : ''}
      >
        <div class="countdown__counter" aria-hidden="true">
          <div class="countdown__item" data-unit="days">
            <span class="countdown__value">0</span>
            ${args.hideLabels ? '' : '<span class="countdown__label">Days</span>'}
          </div>

          <span class="countdown__separator"></span>

          <div class="countdown__item" data-unit="hours">
            <span class="countdown__value">00</span>
            ${args.hideLabels ? '' : '<span class="countdown__label">Hours</span>'}
          </div>

          <span class="countdown__separator"></span>

          <div class="countdown__item" data-unit="minutes">
            <span class="countdown__value">00</span>
            ${args.hideLabels ? '' : '<span class="countdown__label">Minutes</span>'}
          </div>

          <span class="countdown__separator"></span>

          <div class="countdown__item" data-unit="seconds">
            <span class="countdown__value">00</span>
            ${args.hideLabels ? '' : '<span class="countdown__label">Seconds</span>'}
          </div>
        </div>

        <div class="countdown__message">
          <h3>Countdown finished!</h3>
          <p>This is the countdown success message.</p>
        </div>
      </toujou-countdown>
    `;

    const countdown = wrapper.querySelector('toujou-countdown');

    countdown?.addEventListener(
      'toujou-countdown-finished',
      args.onFinished
    );

    return wrapper;
  },
};
