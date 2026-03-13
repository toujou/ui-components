// @ts-ignore
import type { Preview } from '@storybook/web-components-vite'
export const globalTypes = {};

// Globals
import '../stories/globals/css/global.css';

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
