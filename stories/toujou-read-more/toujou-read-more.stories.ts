import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { fn } from 'storybook/test';
import '../../packages/toujou-read-more/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Read More',
  component: 'toujou-read-more',
  argTypes: {
    'max-lines': {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Number of lines to show before truncating',
    },
  },
  args: {
    'max-lines': 3,
    onToggle: fn().mockName('toujou-read-more-toggle'),
    onReady: fn().mockName('toujou-read-more-ready'),
  },
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO],
  },
  tags: ['kojo'],
};

export default meta;
type Story = StoryObj;

const longText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu facilisis mi. Nulla aliquet mollis dolor eu fringilla.
Donec non lorem at dolor volutpat rhoncus in venenatis orci. Donec quis diam lacus. Sed et quam eget orci condimentum laoreet et non libero.
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed consectetur tincidunt libero non bibendum.
Sed mattis laoreet nibh eget viverra. Ut molestie ut dolor at malesuada. Donec odio est, dictum eget interdum quis, tincidunt dignissim neque.
Vestibulum accumsan risus elementum, pharetra felis sit amet, egestas libero. Ut feugiat, diam at pretium efficitur, turpis eros euismod quam, non congue urna nunc et lorem.
Aliquam ut placerat felis, sed scelerisque sapien. Aenean interdum lobortis urna sit amet fringilla.
Nulla mattis lorem sit amet nunc sodales, at pulvinar nisl maximus.
Vivamus ligula augue, luctus eget leo nec, aliquam porta quam. Donec dignissim sit amet nunc et euismod.
Proin vel velit nec massa tempor euismod vel sit amet justo. Integer ac tempor ipsum, et sodales odio. Aliquam elementum porttitor finibus.
Quisque eget magna ut lorem porta consequat quis sed turpis. Integer a velit ac libero suscipit viverra quis id nunc. Nulla facilisi
 Nunc lacinia, sapien non laoreet eleifend, massa orci aliquet nibh, vitae tincidunt nibh purus vestibulum odio. Mauris non mollis augue.
 Proin nulla lorem, porta in hendrerit ut, ultrices eget nibh. Suspendisse potenti. Quisque lacinia justo purus, vitae ultrices tortor sagittis nec.
 Etiam congue ante suscipit lorem euismod semper. Praesent quam ante, finibus in nibh eu, sollicitudin euismod arcu.
`;

export const Default: Story = {
  render: (args) => html`
    <toujou-read-more
      class="read-more"
      max-lines="${args['max-lines']}"
      @toujou-read-more-toggle=${args.onToggle}
      @toujou-read-more-ready=${args.onReady}
    >
      <p>${longText}</p>
      <button slot="open-button" class="button">Read more</button>
      <button slot="close-button" class="button">Read less</button>
    </toujou-read-more>
  `,
};

export const ShortContent: Story = {
  render: (args) => html`
    <toujou-read-more
      class="read-more"
      max-lines="${args['max-lines']}"
      @toujou-read-more-toggle=${args.onToggle}
      @toujou-read-more-ready=${args.onReady}
    >
      <p>This is short content that does not exceed the max lines limit, so no button will be shown.</p>
      <button slot="open-button" class="button">Read more</button>
      <button slot="close-button" class="button">Read less</button>
    </toujou-read-more>
  `,
};
