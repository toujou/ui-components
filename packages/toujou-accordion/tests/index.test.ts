import {
  html,
  fixture,
  expect,
  elementUpdated,
  oneEvent,
  fixtureSync,
} from '@open-wc/testing';

import { sendKeys } from "@web/test-runner-commands";

import '../src/toujou-accordion';

describe('toujou-accordion', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`
        <toujou-accordion>
          <div class="accordion__panel" data-for="panel-1" data-open="true">
            Panel 1
          </div>
          <div class="accordion__content" data-content="panel-1" >
            Content 1
          </div>
          <div class="accordion__panel" data-for="panel-2">
            Panel 2
          </div>
          <div class="accordion__content" data-content="panel-2">
            Content 2
          </div>
        </toujou-accordion>`
    );
  });

  it('can create component', () => {
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('TOUJOU-ACCORDION');
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });

  it('dispatches `toujou-accordion-ready` on firstUpdated', async () => {
    const el = fixtureSync('<toujou-accordion></toujou-accordion>');
    const ev = await oneEvent(el, 'toujou-accordion-ready');
    expect(ev).to.exist;
  });

  it('opens panels with data-open="true" by default',  () => {
    const content = element.querySelector('[data-content="panel-1"]');
    expect(content.classList.contains('accordion__content--active')).to.be.true;
  });

  it('sets correct a11y attributes',  () => {
    const openContent = element.querySelector('[data-content="panel-1"]');
    const openPanel = element.querySelector('[data-for="panel-1"]');

    const closedContent = element.querySelector('[data-content="panel-2"]');
    const closedPanel = element.querySelector('[data-for="panel-2"]');

    expect(openPanel.getAttribute('aria-expanded')).to.be.eq('true');
    expect(openContent.getAttribute('aria-hidden')).to.be.eq('false');

    expect(closedPanel.getAttribute('aria-expanded')).to.be.eq('false');
    expect(closedContent.getAttribute('aria-hidden')).to.be.eq('true');
  });

  it('can open panel on click', async () => {
    const openContent = element.querySelector('[data-content="panel-1"]');
    const openPanel = element.querySelector('[data-for="panel-1"]');

    const closedContent = element.querySelector('[data-content="panel-2"]');
    const closedPanel = element.querySelector('[data-for="panel-2"]');

    closedPanel.click();

    await elementUpdated(element);

    expect(closedContent.classList.contains('accordion__content--active')).to.be.true;

    expect(openPanel.getAttribute('aria-expanded')).to.be.eq('true');
    expect(openContent.getAttribute('aria-hidden')).to.be.eq('false');

    expect(closedPanel.getAttribute('aria-expanded')).to.be.eq('true');
    expect(closedContent.getAttribute('aria-hidden')).to.be.eq('false');
  });

  it('can close panel on click', async () => {
    const openContent = element.querySelector('[data-content="panel-1"]');
    const openPanel = element.querySelector('[data-for="panel-1"]');

    openPanel.click();

    await elementUpdated(element);

    expect(openContent.classList.contains('accordion__content--active')).to.be.false;

    expect(openPanel.getAttribute('aria-expanded')).to.be.eq('false');
    expect(openContent.getAttribute('aria-hidden')).to.be.eq('true');
  });

  it('will close other open panels on click on expand mode single', async () => {
    element.expandModeSingle = true;

    const openContent = element.querySelector('[data-content="panel-1"]');
    const openPanel = element.querySelector('[data-for="panel-1"]');

    const closedContent = element.querySelector('[data-content="panel-2"]');
    const closedPanel = element.querySelector('[data-for="panel-2"]');

    closedPanel.click();

    await elementUpdated(element);

    expect(closedContent.classList.contains('accordion__content--active')).to.be.true;

    expect(closedPanel.getAttribute('aria-expanded')).to.be.eq('true');
    expect(closedContent.getAttribute('aria-hidden')).to.be.eq('false');

    expect(openPanel.getAttribute('aria-expanded')).to.be.eq('false');
    expect(openContent.getAttribute('aria-hidden')).to.be.eq('true');
  });
});

describe('toujou-accordion keyboard interactions', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`
        <toujou-accordion>
          <div class="accordion__panel" data-for="panel-1" data-open="true">
            Panel 1
          </div>
          <div class="accordion__content" data-content="panel-1" >
            Content 1
          </div>
          <div class="accordion__panel" data-for="panel-2">
            Panel 2
          </div>
          <div class="accordion__content" data-content="panel-2">
            Content 2
          </div>
        </toujou-accordion>`
    );
  });

  it('toggles panel on Enter key', async () => {
    const panel = element.querySelector('[data-for="panel-2"]');
    panel.focus();
    await sendKeys({ press: 'Enter' });

    await elementUpdated(element);

    const content = element.querySelector('[data-content="panel-2"]');
    expect(content.classList.contains('accordion__content--active')).to.be.true;
  });

  it('toggles panel on Space key', async () => {
    const panel = element.querySelector('[data-for="panel-2"]');
    panel.focus();
    await sendKeys({ press: ' ' });

    await elementUpdated(element);

    const content = element.querySelector('[data-content="panel-2"]');
    expect(content.classList.contains('accordion__content--active')).to.be.true;
  });

  it('focuses next panel on ArrowDown', async () => {
    const panels = element.querySelectorAll('[data-for]');
    panels[0].focus();
    await sendKeys({ press: 'ArrowDown' });

    // Wait for focus to move
    await new Promise(r => setTimeout(r, 10));
    expect(document.activeElement).to.equal(panels[1]);
  });

  it('focuses previous panel on ArrowUp', async () => {
    const panels = element.querySelectorAll('[data-for]');
    panels[1].focus();
    await sendKeys({ press: 'ArrowUp' });

    await new Promise(r => setTimeout(r, 10));
    expect(document.activeElement).to.equal(panels[0]);
  });

  it('focuses first panel on Home key', async () => {
    const panels = element.querySelectorAll('[data-for]');
    panels[1].focus();
    await sendKeys({ press: 'Home' });

    await new Promise(r => setTimeout(r, 10));
    expect(document.activeElement).to.equal(panels[0]);
  });

  it('focuses last panel on End key', async () => {
    const panels = element.querySelectorAll('[data-for]');
    panels[0].focus();
    await sendKeys({ press: 'End' });

    await new Promise(r => setTimeout(r, 10));
    expect(document.activeElement).to.equal(panels[1]);
  });

});
