import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-burger/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Burger',
  component: 'toujou-burger',
  parameters: {
    toujouThemes: [THEME_NAMES.DEPRECATED]
  },
  tags: ['deprecated']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <input type="checkbox" id="burger-state" />
    <nav id="navigation" aria-hidden="true">
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
    <toujou-burger
      listen-to="#burger-state"
      toggle-element="#navigation"
    >
      <label for="burger-state" style="cursor: pointer;">
        ☰ Menu
      </label>
    </toujou-burger>
  `;

    return wrapper;
  },
};
