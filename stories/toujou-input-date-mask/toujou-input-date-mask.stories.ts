import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-input-date-mask/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Input Date Mask',
  component: 'toujou-input-date-mask',
  argTypes: {
    mask: {
      control: 'select',
      options: ['dd.mm.yyyy', 'mm/dd/yyyy', 'yyyy-mm-dd'],
      description: 'The date mask format',
    },
    'show-mask-on-hover': {
      control: 'boolean',
      description: 'Show the mask placeholder when hovering the input',
    },
    'show-mask-on-focus': {
      control: 'boolean',
      description: 'Show the mask placeholder when the input is focused',
    },
    'custom-validation-error-message': {
      control: 'text',
      description: 'Custom validation error message shown when the date is invalid',
    },
  },
  args: {
    mask: 'dd.mm.yyyy',
    'show-mask-on-hover': true,
    'show-mask-on-focus': true,
    'custom-validation-error-message': 'Please enter a valid date',
  },
  parameters: {
    toujouThemes: [THEME_NAMES.CUSTOMIZATIONS]
  },
  tags: ['customizations']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <form>
        <toujou-input-group class="input-group input-group--date-jquery" data-format="Y-m-d">
          <label class="input-label" for="facade">Date input mask</label>
          <toujou-input-date-mask
            mask="${args.mask}"
            ${args['show-mask-on-hover'] ? 'show-mask-on-hover' : ''}
            ${args['show-mask-on-focus'] ? 'show-mask-on-focus' : ''}
            custom-validation-error-message="${args['custom-validation-error-message']}"
          >
            <input
              slot="facade"
              id="facade"
              type="text"
              class="input input--date-mask"
              aria-label="Date input"
            />
            <input
              slot="input"
              type="hidden"
              id="hidden"
              name="date"
              class="input input--date-mask-hidden"
            />
          </toujou-input-date-mask>
        </toujou-input-group>
        <button type="submit" style="margin-top: 1rem;" class="button">Submit</button>
      </form>
    `;
    return wrapper;
  },
};
