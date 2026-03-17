import { Meta, StoryObj } from '@storybook/web-components';
import '../../packages/toujou-contact-box/src/index.ts';
import './toujou-contact-box.storyStyles.css';
import { THEME_NAMES } from "../globals/js/constants";

const meta: Meta = {
  title: 'Components/Toujou Contact Box',
  component: 'toujou-contact-box',
  parameters: {
    toujouThemes: [THEME_NAMES.DEPRECATED]
  },
  tags: ['deprecated']
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <!-- Hidden checkbox that controls the contact box state -->
      <input type="checkbox" name="contact-state" id="contact-state" class="state-input" aria-hidden="true" style="margin-bottom: 2rem;"/>
      <label for="contact-state" class="button">Open contact box</label>

      <p>This element isn't currently used on any of our themes.</p>
      <p>Instead, we have refactored our templates to use native dialog elements, which is better for a11y.</p>
      <br>
      <p>You can <strong>check the checkbox</strong> to see the contact box (without any real styling)</p>

      <toujou-contact-box class="contact-box">
        <button class="contact-box__close storybook-button" aria-label="Close contact box">Close
        </button>
        <div class="contact-box__content">
          <h3 class="contact-box__headline">Kontakt</h3>
          <p class="contact-box__message">This is a dummy contact box message</p>
          <div class="contact-box__items">
            <div class="contact-box__item">
              <a class="contact-box__link" href="#">0123 4567899</a>
            </div>
            <div class="contact-box__item">
              <a class="contact-box__link" href="#">info@test.de</a>
            </div>
          </div>
        </div>
      </toujou-contact-box>
    `;

    return wrapper;
  },
};
