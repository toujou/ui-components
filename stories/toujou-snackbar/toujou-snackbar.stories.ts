import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-snackbar/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Snackbar',
  component: 'toujou-snackbar',
  argTypes: {
    snackbarVariant: {
      table: { category: 'Snackbar settings', defaultValue: { summary: 'info' } },
      name: 'Variant',
      description: 'Visual style of the snackbar',
      options: ['info', 'success', 'warning', 'error'],
      control: { type: 'radio' },
    },
    snackbarType: {
      table: { category: 'Snackbar settings', defaultValue: { summary: 'auto' } },
      name: 'Type',
      description: 'Auto hides after duration, action requires manual dismissal',
      options: ['auto', 'action'],
      control: { type: 'radio' },
    },
    snackbarDuration: {
      table: { category: 'Snackbar settings' },
      name: 'Duration (ms)',
      description: 'How long the snackbar stays visible (only for auto type)',
      control: { type: 'number' },
    },
    snackbarMessage: {
      table: { category: 'Snackbar settings' },
      name: 'Message',
      description: 'The message displayed in the snackbar',
      control: { type: 'text' },
    },
  },
  args: {
    snackbarVariant: 'info',
    snackbarType: 'auto',
    snackbarDuration: 4000,
    snackbarMessage: 'This is a snackbar message!',
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
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations'],
};

export default meta;
type Story = StoryObj;

const createSnackbarEvent = (args) => new CustomEvent('toujou-add-snackbar', {
  bubbles: true,
  composed: true,
  detail: {
    message: args.snackbarMessage,
    type: args.snackbarType,
    buttonText: 'OK',
    duration: args.snackbarDuration,
    variant: args.snackbarVariant,
  },
});

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div style="padding: 2rem;">
        <button id="snackbar-trigger" class="button">Show snackbar</button>
        <toujou-snackbar
          class="snackbar"
          aria-live="assertive"
          tabindex="-1"
          button-aria-label="Close the snackbar"
        ></toujou-snackbar>
      </div>
    `;

    wrapper.querySelector('#snackbar-trigger').addEventListener('click', (event) => {
      (event.target as HTMLElement).dispatchEvent(createSnackbarEvent(args));
    });

    return wrapper;
  },
};
