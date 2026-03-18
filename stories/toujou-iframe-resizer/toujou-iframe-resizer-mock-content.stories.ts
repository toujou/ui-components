import { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Toujou Iframe Resizer/Mock Content',
  // the "!dev" tag hides this story from the sidebar
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

const AWAIT_TIME = 3000;
const MOCK_CONTENT = `
  <h1>Iframe content has been loaded!</h1>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  <h2>Another headline</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  <h2>And yet another headline</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  <h2>One more headline</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
`;

const addMockContent = async () => {
  await new Promise(resolve => setTimeout(resolve, AWAIT_TIME));
  const contentSection = document.querySelector('#iframe-content-section');
  if (!contentSection) return;
  contentSection.innerHTML = MOCK_CONTENT;
};

export const MockContent: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section id="iframe-content-section" style="border: 4px solid purple; padding: 2rem;">
        <h1>Iframe content loading...</h1>
      </section>
    `;

    const script = document.createElement('script');
    script.src = '/node_modules/iframe-resizer/js/iframeResizer.contentWindow.min.js';
    document.head.appendChild(script);

    addMockContent();
    return wrapper;
  },
};
