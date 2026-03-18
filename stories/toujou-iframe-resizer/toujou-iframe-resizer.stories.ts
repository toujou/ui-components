import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-iframe-resizer/src/index.ts';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Iframe Resizer',
  component: 'toujou-iframe-resizer',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO]
  },
  tags: ['kojo']
};

export default meta;
type Story = StoryObj;

const MOCK_IFRAME_URL = '/iframe.html?viewMode=story&id=components-toujou-iframe-resizer-mock-content--mock-content';

export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <h2>Test</h2>
      <p>The iframe content loads after 3 seconds. Notice how the iframe without the resizer stays at a fixed height, while the one with the resizer grows to fit the content.</p>

      <h4><span style="color: var(--color-error);">Without</span> toujou-iframe-resizer</h4>
      <iframe
        src="${MOCK_IFRAME_URL}"
        width="100%"
        height="100%"
        scrolling="yes"
        style="border: 0;"
        title="iframe without resizer"
      ></iframe>

      <br /><br /><br />

      <h4><span style="color: var(--color-success);">With</span> toujou-iframe-resizer</h4>
      <toujou-iframe-resizer>
        <iframe
          src="${MOCK_IFRAME_URL}"
          width="100%"
          height="100%"
          scrolling="yes"
          style="border: 0;"
          title="iframe with resizer"
        ></iframe>
      </toujou-iframe-resizer>
    `;
    return wrapper;
  },
};
