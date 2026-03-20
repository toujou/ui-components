import { Meta, StoryObj } from '@storybook/web-components-vite';
import { fn } from 'storybook/test';
import '../../packages/toujou-datepicker/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Datepicker',
  component: 'toujou-datepicker',
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple', 'range'],
      description: 'The selection mode of the datepicker',
    },
    dateFormat: {
      control: 'text',
      description: 'The format string for the date value (Flatpickr format)',
    },
    altFormat: {
      control: 'text',
      description: 'Alternative display format shown to the user',
    },
    showMonths: {
      control: 'number',
      description: 'Number of months to show at once',
    },
    enableTime: {
      control: 'boolean',
      description: 'Whether to show a time picker alongside the date picker',
    },
    monthPicker: {
      control: 'boolean',
      description: 'Whether to show a month picker instead of a day picker',
    },
  },
  args: {
    mode: 'single',
    dateFormat: 'd.m.Y',
    altFormat: null,
    showMonths: 1,
    enableTime: false,
    monthPicker: false,
    onOpen: fn().mockName('open'),
    onClose: fn().mockName('close'),
  },
  parameters: {
    toujouThemes: [
      THEME_NAMES.TOUJOU_V1,
      THEME_NAMES.HISSU_V1,
      THEME_NAMES.TABI_V1,
      THEME_NAMES.MEDATSU_V1,
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ]
  },
  tags: ['toujou v1', 'hissu v1', 'tabi v1', 'medatsu v1', 'kojo', 'other', 'customizations']
};

export default meta;
type Story = StoryObj;

function formatTimestamp(timestamp: number): string {
  if (isNaN(timestamp)) return ''; // Invalid timestamp

  const date = new Date(timestamp);

  if (isNaN(date.getTime())) return ''; // Invalid timestamp

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const renderDatepicker = (args) => {
  const wrapper = document.createElement('div');
  const formattedMinDate = formatTimestamp(args.minDate);
  const formattedMaxDate = formatTimestamp(args.maxDate);

  wrapper.innerHTML = `
    <toujou-input-group class="input-group input-group--date-jquery" data-format="Y-m-d">
      <label class="input-label" for="dateFrom">Date picker</label>
      <toujou-datepicker
        class="datepicker"
        mode="${args.mode}"
        date-format="${args.dateFormat}"
        ${args.altFormat ? `alt-format="${args.altFormat}"` : ''}
        ${args.showMonths > 1 ? `show-months="${args.showMonths}"` : ''}
        ${args.enableTime ? 'enableTime' : ''}
        ${args.monthPicker ? 'monthPicker' : ''}
        minDate="${formattedMinDate}"
        maxDate="${formattedMaxDate}"
      >
        <input
          name="dateFrom"
          class="form-control input input--datepicker"
          placeholder="Select a date"
          type="text"
        />
      </toujou-datepicker>
    </toujou-input-group>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('open', args.onOpen);
  input.addEventListener('close', args.onClose);

  return wrapper;
};

export const Default: Story = {
  render: (args) => renderDatepicker(args),
};

