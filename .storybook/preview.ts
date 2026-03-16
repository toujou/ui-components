// @ts-ignore
import type { Preview } from '@storybook/web-components-vite'
export const globalTypes = {};

// Globals
import '../stories/globals/css/global.css';
import '../stories/globals/css/preview.css';



const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        // Push docs entries to the end
        const aIsDoc = a.type === 'docs';
        const bIsDoc = b.type === 'docs';
        if (aIsDoc && !bIsDoc) return 1;
        if (!aIsDoc && bIsDoc) return -1;
        return 0;
      },
    },
  }
};

export default preview;
export { decorators } from './decorators';
