import { Meta, StoryObj } from '@storybook/web-components-vite';

/**
 * This is a helper story used as the iframe source in the toujou-iframe-resizer story.
 * It simulates a page that loads content asynchronously after a delay, which allows
 * us to demonstrate the iframe resizing behavior when content height changes.
 */
const meta: Meta = {
  title: 'Components/Toujou Iframe Resizer/Mock Content',
  tags: ['!dev'], // the "!dev" tag hides this story from the sidebar while keeping it accessible via URL
};

export default meta;
type Story = StoryObj;

/** Time in milliseconds to wait before injecting the mock content, simulating an async load */
const AWAIT_TIME = 3000;

/** Mock HTML content injected into the iframe after the await time */
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

/**
 * Waits for AWAIT_TIME milliseconds then replaces the placeholder content
 * in #iframe-content-section with the mock HTML, causing the iframe to grow in height.
 */
const addMockContent = async () => {
  await new Promise(resolve => setTimeout(resolve, AWAIT_TIME));
  const contentSection = document.querySelector('#iframe-content-section');
  if (!contentSection) return;
  contentSection.innerHTML = MOCK_CONTENT;
};

/**
 * The mock content story — renders a placeholder section that gets replaced with
 * content after a delay. Also injects the iframeResizer.contentWindow script required
 * by the iframe-resizer library to communicate height changes to the parent page.
 */
export const MockContent: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <section id="iframe-content-section" style="border: 4px solid purple; padding: 2rem;">
        <h1>Iframe content loading...</h1>
      </section>
    `;

    // Required by iframe-resizer on the content (iframe) side.
    // Without this script the parent page cannot receive height change notifications.
    const script = document.createElement('script');
    script.src = '/node_modules/iframe-resizer/js/iframeResizer.contentWindow.min.js';
    document.head.appendChild(script);

    addMockContent();
    return wrapper;
  },
};
