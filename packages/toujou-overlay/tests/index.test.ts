import { aTimeout, elementUpdated, expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { setOverlayCookie } from '../src/utils/cookie';

describe('Toujou Overlay', () => {
  let element: HTMLElement;
  beforeEach(async () => {
    document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });

    element = await fixture(html`
      <toujou-overlay id="overlay">
        <template><!--
         <div class="overlay__text">
            Hello World
         </div>
         <span class="overlay__warning" style="display:none;">Warning</span>
         <div class="overlay__buttons">
            <a class="overlay__button" data-overlay-value="yes">Yes</a>
            <a class="overlay__button" data-overlay-value="no">No</a>
         </div>
          
        --></template>
      </toujou-overlay>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-overlay'.toUpperCase());
  });

  it('it will render template on first update', async () => {
    expect(element.querySelector('.overlay__text')).not.to.be.null;
    expect(element.querySelector('.overlay__buttons')).not.to.be.null;
    expect(element).to.have.attribute('opened');

  });

  it('it will close overlay on yes click', async () => {
    const button: HTMLElement = element.querySelector('[data-overlay-value="yes"]');
    button.click();

    await elementUpdated(element);

    expect(element.querySelector('.overlay__text')).to.be.null;
    expect(element.querySelector('.overlay__buttons')).to.be.null;
    expect(element).not.to.have.attribute('opened');

  });

  it('it will set display block on warning and hide buttons on no click', async () => {
    const button: HTMLElement = element.querySelector('[data-overlay-value="no"]');
    button.click();

    await elementUpdated(element);

    expect(element.querySelector('.overlay__warning')).to.be.displayed;
    expect(element.querySelector('.overlay__buttons')).not.to.be.displayed;
  });

  it('it will hide overlay if cookie is set ', async () => {
    setOverlayCookie('overlay', 'accepted');
    element = await fixture(html`
      <toujou-overlay id="overlay">
        <template><!--
         <div class="overlay__text">
            Hello World
         </div>
         <span class="overlay__warning" style="display:none;">Warning</span>
         <div class="overlay__buttons">
            <a class="overlay__button" data-overlay-value="yes">Yes</a>
            <a class="overlay__button" data-overlay-value="no">No</a>
         </div>
          
        --></template>
      </toujou-overlay>
    `);

    expect(element.querySelector('.overlay__text')).to.be.null;
    expect(element.querySelector('.overlay__buttons')).to.be.null;
    expect(element).not.to.have.attribute('opened');
  });

  it('it will open overlay with delay', async () => {
    element = await fixture(html`
      <toujou-overlay id="overlay" delay="5">
        <template><!--
         <div class="overlay__text">
            Hello World
         </div>
        --></template>
      </toujou-overlay>
    `);

    expect(element.querySelector('.overlay__text')).to.be.null;

    await aTimeout(5);

    expect(element).to.have.attribute('opened');
    expect(element.querySelector('.overlay__text')).not.to.be.null;
  });

  it('it will hide overlay if #aas is  ', async () => {
    window.location.hash = '#aaa';
    element = await fixture(html`
      <toujou-overlay id="overlay">
        <template><!--
         <div class="overlay__text">
            Hello World
         </div>
         <span class="overlay__warning" style="display:none;">Warning</span>
         <div class="overlay__buttons">
            <a class="overlay__button" data-overlay-value="yes">Yes</a>
            <a class="overlay__button" data-overlay-value="no">No</a>
         </div>
          
        --></template>
      </toujou-overlay>
    `);

    expect(element.querySelector('.overlay__text')).to.be.null;
    expect(element.querySelector('.overlay__buttons')).to.be.null;
  });

});
