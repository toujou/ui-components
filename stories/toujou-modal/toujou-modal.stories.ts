import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Modal',
  component: 'toujou-modal',
  argTypes: {
    'no-backdrop': {
      control: 'boolean',
      description: 'Remove the backdrop overlay.',
    },
    'no-header': {
      control: 'boolean',
    },
    'allow-outside-scroll': {
      control: 'boolean',
    },
  },
  args: {
    'no-backdrop': false,
    'no-header': false,
    'allow-outside-scroll': false
  },
  parameters: {
    toujouThemes: [
      THEME_NAMES.TOUJOU_V1,
      THEME_NAMES.TOUJOU_V1_5,
      THEME_NAMES.HISSU_V1,
      THEME_NAMES.HISSU_V1_5,
      THEME_NAMES.TABI_V1,
      THEME_NAMES.TABI_V1_5,
      THEME_NAMES.MEDATSU_V1,
      THEME_NAMES.MEDATSU_V1_5,
      THEME_NAMES.KOJO,
      THEME_NAMES.OTHER,
      THEME_NAMES.CUSTOMIZATIONS
    ],
  },
  tags: ['toujou v1', 'toujou v1.5', 'hissu v1', 'hissu v1.5', 'tabi v1', 'tabi v1.5', 'medatsu v1', 'medatsu v1.5', 'kojo', 'other', 'customizations'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <button class="button" id="open">Open Modal</button>
    <toujou-modal
        id="myModal"
        class="modal"
        title="My Modal Title"
        keep-on-close
        ?no-backdrop=${args['no-backdrop']}
        ?no-header=${args['no-header']}
        ?allow-outside-scroll=${args['allow-outside-scroll']}
    >
      <p style="padding: 0 1rem;">
        This is the content of the modal.
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
        dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
        consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua
      </p>
    </toujou-modal>
  `,

  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('#open');
    const modal = canvasElement.querySelector('toujou-modal');

    button?.addEventListener('click', () => {
      modal?.setAttribute('opened', '');
    });
  },
};

// @ts-ignore
const MOCK_IFRAME_URL = `${import.meta.env.BASE_URL}iframe.html?viewMode=story&id=components-toujou-iframe-resizer-mock-content--mock-content`;

export const Iframe: Story = {
  render: (args) => html`
    <a class="button" href="${MOCK_IFRAME_URL}" target="toujou-modal">Open Link in Modal</a>
  `,
};
