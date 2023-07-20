import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Contact Box', () => {
  let testPage: Element;

  beforeEach(async () => {
    testPage = await fixture(html`
      <input type="checkbox" name="contact-state" id="contact-state" class="state-input" aria-hidden="true">
      <label for="contact-state" class="button">Open contact box</label>
      <toujou-contact-box class="contact-box">
        <div class="contact-box__card">
          <button class="contact-box__close" aria-label="Close contact box">
            <toujou-icon class="icon" icon-size="ms" icon-name="close" icon-color="font"></toujou-icon>
          </button>

          <div class="contact-box__content" slot="content">
            <h3 class="contact-box__headline">Kontakt</h3>
            <div class="contact-box__items">
              <div class="contact-box__item">
                <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="telephone"></toujou-icon>
                <a class="contact-box__link" href="#">0911 23980870</a>
              </div>
              <div class="contact-box__item">
                <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="email"></toujou-icon>
                <a class="contact-box__link" href="#">info@dfau.de</a>
              </div>
              <div class="contact-box__item">
                <toujou-icon class="icon" icon-size="ms" icon-color="font" icon-name="calendar-day"></toujou-icon>
                <span class="contact-box__link">Mo. - Fr.: 9:00 - 18:00h</span>
              </div>
            </div>
          </div>
        </div>
      </toujou-contact-box>
    `);
  });

  it('can create component', async () => {
    const element = document.querySelector('.contact-box');

    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-contact-box'.toUpperCase());
  });
});
