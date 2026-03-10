import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-breadcrumb/src/index.ts';

const meta: Meta = {
  title: 'Components/Toujou Breadcrumb',
  component: 'toujou-breadcrumb',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <toujou-breadcrumb>
      <div slot="toggle-buttons">
        <button class="breadcrumb__toggle">Menu</button>
      </div>
      <ol slot="list" class="breadcrumb__list">
        <li class="breadcrumb__item"><a href="#">Home</a></li>
        <li class="breadcrumb__item"><a href="#">Category</a></li>
        <li class="breadcrumb__item"><a href="#">Subcategory</a></li>
        <li class="breadcrumb__item">Current Page</li>
      </ol>
    </toujou-breadcrumb>
  `,
};
