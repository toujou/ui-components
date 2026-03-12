// @ts-ignore
import type { Preview } from '@storybook/web-components-vite'

// Globals
import '../stories/globals/css/global.css';
import '../stories/globals/js/story-info/story-info';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
