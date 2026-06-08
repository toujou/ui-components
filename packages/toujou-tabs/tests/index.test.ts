import { elementUpdated, expect, fixture, html, oneEvent } from '@open-wc/testing';

import '../src/index';
import { sendKeys } from "@web/test-runner-commands";

const renderTabs = (activeIndex: number = 0) => html`
    <toujou-tabs class="tabs">
        <div class="tabs__header">
            <button
                class="tabs__scroll-button tabs__scroll-button--prev"
                aria-hidden="true"
                tabindex="-1"
                hidden
            >prev</button>

            <div role="tablist" aria-label="Select a tab" class="tabs__buttons">
                <button
                    role="tab"
                    aria-selected="${activeIndex === 0 ? 'true' : 'false'}"
                    aria-controls="panel-1"
                    id="tab-1"
                    tabindex="${activeIndex === 0 ? '0' : '-1'}"
                    class="tabs__button"
                >Tab One</button>
                <button
                    role="tab"
                    aria-selected="${activeIndex === 1 ? 'true' : 'false'}"
                    aria-controls="panel-2"
                    id="tab-2"
                    tabindex="${activeIndex === 1 ? '0' : '-1'}"
                    class="tabs__button"
                >Tab Two</button>
                <button
                    role="tab"
                    aria-selected="${activeIndex === 2 ? 'true' : 'false'}"
                    aria-controls="panel-3"
                    id="tab-3"
                    tabindex="${activeIndex === 2 ? '0' : '-1'}"
                    class="tabs__button"
                >Tab Three</button>
            </div>

            <button
                class="tabs__scroll-button tabs__scroll-button--next"
                aria-hidden="true"
                tabindex="-1"
                hidden
            >next</button>
        </div>

        <div class="tabs__panels">
            <div
                id="panel-1"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="tab-1"
                class="tabs__panel"
                ?hidden="${activeIndex !== 0}"
            >Content One</div>
            <div
                id="panel-2"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="tab-2"
                class="tabs__panel"
                ?hidden="${activeIndex !== 1}"
            >Content Two</div>
            <div
                id="panel-3"
                role="tabpanel"
                tabindex="0"
                aria-labelledby="tab-3"
                class="tabs__panel"
                ?hidden="${activeIndex !== 2}"
            >Content Three</div>
        </div>
    </toujou-tabs>
`;

describe('Toujou Tabs - basic rendering', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(renderTabs());
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-tabs'.toUpperCase());
  });

  it('passes the a11y audit', async () => {
    await expect(element).to.be.accessible();
  });
});

describe('Toujou Tabs - initial state', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(renderTabs());
  });

  it('sets first tab as active by default', () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    expect(firstButton.getAttribute('aria-selected')).to.equal('true');
    expect(firstButton.getAttribute('tabindex')).to.equal('0');
  });

  it('hides all panels except the first on init', () => {
    const panels = element.querySelectorAll('.tabs__panel');
    expect(panels[0].hasAttribute('hidden')).to.be.false;
    expect(panels[1].hasAttribute('hidden')).to.be.true;
    expect(panels[2].hasAttribute('hidden')).to.be.true;
  });

  it('sets inactive tab buttons to tabindex -1 on init', () => {
    const buttons = element.querySelectorAll<HTMLButtonElement>('.tabs__button');
    expect(buttons[1].getAttribute('tabindex')).to.equal('-1');
    expect(buttons[2].getAttribute('tabindex')).to.equal('-1');
  });

  it('respects aria-selected="true" in markup to set initial active tab', async () => {
    const el = await fixture(renderTabs(1));
    const secondButton = el.querySelector<HTMLButtonElement>('#tab-2')!;
    expect(secondButton.getAttribute('aria-selected')).to.equal('true');

    const firstPanel = el.querySelector('#panel-1')!;
    const secondPanel = el.querySelector('#panel-2')!;
    expect(firstPanel.hasAttribute('hidden')).to.be.true;
    expect(secondPanel.hasAttribute('hidden')).to.be.false;
  });
});

describe('Toujou Tabs - events', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(renderTabs());
  });

  it('dispatches toujou-tabs-ready on connectedCallback', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const eventPromise = oneEvent(container, 'toujou-tabs-ready');

    container.innerHTML = `
        <toujou-tabs class="tabs">
            <div class="tabs__header">
                <button class="tabs__scroll-button tabs__scroll-button--prev" hidden>prev</button>
                <div role="tablist" class="tabs__buttons">
                    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" class="tabs__button">Tab One</button>
                </div>
                <button class="tabs__scroll-button tabs__scroll-button--next" hidden>next</button>
            </div>
            <div class="tabs__panels">
                <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" class="tabs__panel">Content</div>
            </div>
        </toujou-tabs>
    `;

    const ev = await eventPromise;
    expect(ev).to.exist;

    document.body.removeChild(container);
  });

  it('toujou-tabs-ready event contains activeTabId and tabCount', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const eventPromise = oneEvent(container, 'toujou-tabs-ready');

    container.innerHTML = `
        <toujou-tabs class="tabs">
            <div class="tabs__header">
                <button class="tabs__scroll-button tabs__scroll-button--prev" hidden>prev</button>
                <div role="tablist" class="tabs__buttons">
                    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1" class="tabs__button">Tab One</button>
                    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2" class="tabs__button">Tab Two</button>
                </div>
                <button class="tabs__scroll-button tabs__scroll-button--next" hidden>next</button>
            </div>
            <div class="tabs__panels">
                <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" class="tabs__panel">Content</div>
                <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" class="tabs__panel" hidden>Content</div>
            </div>
        </toujou-tabs>
    `;

    const ev = await eventPromise as CustomEvent;
    expect(ev.detail.activeTabId).to.equal('tab-1');
    expect(ev.detail.tabCount).to.equal(2);

    document.body.removeChild(container);
  });

  it('dispatches toujou-tabs-change when a new tab is selected', async () => {
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    const eventPromise = oneEvent(element, 'toujou-tabs-change');
    secondButton.click();
    const ev = await eventPromise as CustomEvent;
    expect(ev.detail.activeTabId).to.equal('tab-2');
    expect(ev.detail.previousTabId).to.equal('tab-1');
  });

  it('does not dispatch toujou-tabs-change when clicking the already active tab', async () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    let eventFired = false;
    element.addEventListener('toujou-tabs-change', () => { eventFired = true; });
    firstButton.click();
    // Use a small wait instead of elementUpdated since no LitElement render cycle is triggered
    await new Promise(r => setTimeout(r, 50));
    expect(eventFired).to.be.false;
  });
});

describe('Toujou Tabs - click interactions', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(renderTabs());
  });

  it('activates clicked tab button', async () => {
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    secondButton.click();
    await elementUpdated(element);
    expect(secondButton.getAttribute('aria-selected')).to.equal('true');
    expect(secondButton.getAttribute('tabindex')).to.equal('0');
  });

  it('deactivates previously active tab button on click', async () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    secondButton.click();
    await elementUpdated(element);
    expect(firstButton.getAttribute('aria-selected')).to.equal('false');
    expect(firstButton.getAttribute('tabindex')).to.equal('-1');
  });

  it('shows the correct panel when a tab is clicked', async () => {
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    secondButton.click();
    await elementUpdated(element);
    const firstPanel = element.querySelector('#panel-1')!;
    const secondPanel = element.querySelector('#panel-2')!;
    expect(firstPanel.hasAttribute('hidden')).to.be.true;
    expect(secondPanel.hasAttribute('hidden')).to.be.false;
  });
});

describe('Toujou Tabs - keyboard navigation', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(renderTabs());
  });

  it('moves to next tab on ArrowRight', async () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    firstButton.focus();
    await sendKeys({ press: 'ArrowRight' });
    await elementUpdated(element);
    expect(document.activeElement).to.equal(secondButton);
    expect(secondButton.getAttribute('aria-selected')).to.equal('true');
  });

  it('moves to previous tab on ArrowLeft', async () => {
    const secondButton = element.querySelector<HTMLButtonElement>('#tab-2')!;
    secondButton.click();
    await elementUpdated(element);
    secondButton.focus();
    await sendKeys({ press: 'ArrowLeft' });
    await elementUpdated(element);
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    expect(document.activeElement).to.equal(firstButton);
    expect(firstButton.getAttribute('aria-selected')).to.equal('true');
  });

  it('wraps from last tab to first on ArrowRight', async () => {
    const thirdButton = element.querySelector<HTMLButtonElement>('#tab-3')!;
    thirdButton.click();
    await elementUpdated(element);
    thirdButton.focus();
    await sendKeys({ press: 'ArrowRight' });
    await elementUpdated(element);
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    expect(document.activeElement).to.equal(firstButton);
    expect(firstButton.getAttribute('aria-selected')).to.equal('true');
  });

  it('wraps from first tab to last on ArrowLeft', async () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    firstButton.focus();
    await sendKeys({ press: 'ArrowLeft' });
    await elementUpdated(element);
    const thirdButton = element.querySelector<HTMLButtonElement>('#tab-3')!;
    expect(document.activeElement).to.equal(thirdButton);
    expect(thirdButton.getAttribute('aria-selected')).to.equal('true');
  });

  it('moves to first tab on Home key', async () => {
    const thirdButton = element.querySelector<HTMLButtonElement>('#tab-3')!;
    thirdButton.click();
    await elementUpdated(element);
    thirdButton.focus();
    await sendKeys({ press: 'Home' });
    await elementUpdated(element);
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    expect(document.activeElement).to.equal(firstButton);
    expect(firstButton.getAttribute('aria-selected')).to.equal('true');
  });

  it('moves to last tab on End key', async () => {
    const firstButton = element.querySelector<HTMLButtonElement>('#tab-1')!;
    firstButton.focus();
    await sendKeys({ press: 'End' });
    await elementUpdated(element);
    const thirdButton = element.querySelector<HTMLButtonElement>('#tab-3')!;
    expect(document.activeElement).to.equal(thirdButton);
    expect(thirdButton.getAttribute('aria-selected')).to.equal('true');
  });
});
