import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-breadcrumb/src/index.ts';
import './toujou-breadcrumb.storyStyles.css';

const meta: Meta = {
  title: 'Components/Toujou Breadcrumb',
  component: 'toujou-breadcrumb',
  args: {
    onModeChange: fn().mockName('toujou-breadcrumb-mode-change'),
    onMenuOpen: fn().mockName('toujou-breadcrumb-menu-open'),
    onMenuClose: fn().mockName('toujou-breadcrumb-menu-close'),
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <toujou-breadcrumb
      class="breadcrumb"
      @toujou-breadcrumb-mode-change=${args.onModeChange}
      @toujou-breadcrumb-menu-open=${args.onMenuOpen}
      @toujou-breadcrumb-menu-close=${args.onMenuClose}
    >
      <div slot="toggle-buttons">
        <button class="breadcrumb__toggle">☰</button>
      </div>
      <ol slot="list" class="breadcrumb__list">
        <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Home</a></li>
        <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Category</a></li>
        <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Subcategory</a></li>
        <li class="breadcrumb__item"><a class="breadcrumb__link" href="#">Current Page</a></li>
      </ol>
    </toujou-breadcrumb>
  `,
};
