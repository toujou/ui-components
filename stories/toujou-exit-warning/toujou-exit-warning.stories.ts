import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';

import { THEME_NAMES } from "../globals/js/constants";

import '../../packages/toujou-exit-warning/src/index';

const meta: Meta = {
  title: 'Components/Toujou Exit Warning',
  component: 'exit-warning',
  parameters: {
    toujouThemes: [THEME_NAMES.KOJO, THEME_NAMES.OTHER]
  },
  tags: ['kojo', 'other']
};

export default meta;
type Story = StoryObj;

export const ToujouExitWarning: Story = {
  render: (args) => html`
    <a href="https://www.example.com" target="toujou-exit-warning">External link</a>
    <exit-warning title="Sie sind dabei die Seite zu verlassen" redirectDelay="6">
      <template><p>Sie werden in <strong>\${secondsRemaining} Sekunden</strong> auf die Seite <a href="\${targetUrl}">\${targetUrl}</a> weitergeleitet. Wenn Sie dies abbrechen wollen, schließen Sie dieses Popup.</p></template>
    </exit-warning>
  `,
};
