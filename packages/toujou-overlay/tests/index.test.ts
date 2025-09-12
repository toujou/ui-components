import { aTimeout, elementUpdated, expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { setOverlayStorageValue } from '../src/utils/storage';
import { ToujouOverlay } from '../src';
import sinon from 'sinon';

describe('Toujou Overlay', () => {
  let element: ToujouOverlay;

  beforeEach(async () => {
    document.cookie.split(';').forEach(function(c) { document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/'); });
    localStorage.clear();
    window.location.hash = '';

    element = await fixture(html`
      <toujou-overlay id="overlay" role="dialog" aria-modal="true">
        <template><!--
          <button
            class="overlay__close-button overlay-button-close-trigger"
            aria-label="{f:translate(key:'LLL:EXT:toujou/Resources/Private/Language/Frontend.xlf:overlay.button.close')}"
          ></button>

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

  it('should close when close button is clicked', async () => {
    await elementUpdated(element);

    const closeButton = element.querySelector('.overlay__close-button') as HTMLElement;
    expect(closeButton).to.not.be.null;

    closeButton.click();
    await elementUpdated(element);

    expect(element.querySelector('.overlay__text')).to.be.null;
    expect(element).not.to.have.attribute('opened');
  });

  it('it will set display block on warning and hide buttons on no click', async () => {
    const button: HTMLElement = element.querySelector('[data-overlay-value="no"]');
    button.click();

    await elementUpdated(element);

    expect(element.querySelector('.overlay__warning')).to.be.displayed;
    expect(element.querySelector('.overlay__buttons')).not.to.be.displayed;
  });

  it('it will hide overlay if cookie is set', async () => {
    setOverlayStorageValue('overlay', 'accepted');
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

  it('it will hide overlay if #aas is set via url', async () => {
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

  it('should have correct accessibility attributes when opened', async () => {
    expect(element.getAttribute('role')).to.equal('dialog');
    expect(element.getAttribute('aria-modal')).to.equal('true');
  });

  it('should set aria-hidden="true" when overlay is closed', async () => {
    element.opened = true;
    await elementUpdated(element);

    const yesButton = element.querySelector('[data-overlay-value="yes"]') as HTMLElement;
    expect(yesButton).to.not.be.null;

    yesButton.click();
    await elementUpdated(element);

    expect(element.getAttribute('aria-hidden')).to.equal('true');
  });

  it('should dispatch a "toujou-overlay-show" event when opened', async () => {
    const eventSpy = sinon.spy();
    document.addEventListener('toujou-overlay-show', eventSpy);

    // Ensure 'opened' is false before test
    element.opened = false;
    await elementUpdated(element);

    element.opened = true;
    await elementUpdated(element);

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(eventSpy).to.have.been.calledOnce;
  });

  it('should dispatch a "toujou-overlay-hide" event when opened', async () => {
    const eventSpy = sinon.spy();
    document.addEventListener('toujou-overlay-hide', eventSpy);

    // Ensure overlay is opened first, so buttons render
    element.opened = true;
    await elementUpdated(element);

    const yesButton = element.querySelector('[data-overlay-value="yes"]') as HTMLElement;
    yesButton.click();
    await elementUpdated(element);

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(eventSpy).to.have.been.calledOnce;
  });

  it('should add and remove body class when toggled', async () => {
    element.opened = true;
    await elementUpdated(element);

    expect(document.body.classList.contains('toujou-overlay-open')).to.be.true;

    const yesButton = element.querySelector('[data-overlay-value="yes"]') as HTMLElement;
    yesButton.click();
    await elementUpdated(element);

    expect(document.body.classList.contains('toujou-overlay-open')).to.be.false;
  });

  it('it will set storage-mode by default on "session"', async () => {
    await elementUpdated(element);
    expect(element.getAttribute('storage-mode')).to.equal('session');
  });

  it('it will hide overlay if localStorage overlay value is set to "accepted" on storage mode "localStorage"', async () => {
    localStorage.setItem('toujou-overlay-local', 'accepted');
    element = await fixture(html`
      <toujou-overlay id="local" storage-mode="localStorage">
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
    await elementUpdated(element);

    expect(element.getAttribute('storage-mode')).to.equal('localStorage');
    expect(element.querySelector('.overlay__text')).to.be.null;
    expect(element.querySelector('.overlay__buttons')).to.be.null;
    expect(element).not.to.have.attribute('opened');
  });

  it('it will set localStorage overlay value on close on storageMode localStorage', async () => {
    element = await fixture(html`
      <toujou-overlay id="local" storage-mode="localStorage">
        <template><!--
         <div class="overlay__text">
            Hello World
         </div>
         <span class="overlay__warning" style="display:none;">Warning</span>
         <button
            class="overlay__close-button overlay-button-close-trigger"
            aria-label="close"
          ></button>

        --></template>
      </toujou-overlay>
    `);

    await elementUpdated(element);

    const closeButton = element.querySelector('.overlay__close-button') as HTMLElement;
    expect(closeButton).to.not.be.null;

    closeButton.click();
    await elementUpdated(element);

    expect(localStorage.getItem('toujou-overlay-local')).to.be.equal('accepted');
  });
});
