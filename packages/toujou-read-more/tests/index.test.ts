import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import '../src/index';
import { ToujouReadMore } from '../src';

// Helper function to safely query elements from the shadowRoot
const queryShadow = (element: ToujouReadMore, selector: string): HTMLElement => {
  const node = element.shadowRoot?.querySelector(selector);
  if (!node) {
    throw new Error(`Element with selector "${selector}" not found in shadow root.`);
  }
  return node as HTMLElement;
};

// Helper function to safely query slotted elements
const querySlotted = (element: ToujouReadMore, selector: string): HTMLElement => {
  const node = element.querySelector(selector);
  if (!node) {
    throw new Error(`Slotted element with selector "${selector}" not found.`);
  }
  return node as HTMLElement;
};

// Helper to wait for the internal component update cycle (updateComplete + requestAnimationFrame delay)
const waitForOverflowCheck = async (element: ToujouReadMore) => {
  await element.updateComplete;
  // Wait for the requestAnimationFrame inside updated/firstUpdated to finish _checkOverflow
  await new Promise(resolve => setTimeout(resolve, 50));
};

/**
 * Stubs the scrollHeight and clientHeight properties on an element
 * to simulate overflow conditions for testing.
 * @param element The HTMLElement to stub.
 * @param scrollHeight The simulated scroll height (full content height).
 * @param clientHeight The simulated client height (visible container height).
 */
const stubDimensions = (element: HTMLElement, scrollHeight: number, clientHeight: number) => {
  Object.defineProperty(element, 'scrollHeight', { get: () => scrollHeight });
  Object.defineProperty(element, 'clientHeight', { get: () => clientHeight });
};

/**
 * Triggers the component's internal _checkOverflow method
 * by forcing an update to a property (maxLines).
 * This is necessary because _checkOverflow is a private method called
 * during the component's update lifecycle.
 * @param element The ToujouReadMore instance.
 */
const triggerOverflowCheck = async (element: ToujouReadMore) => {
  // Change the property value to force the 'updated' lifecycle hook to run,
  // which will trigger the internal _checkOverflow.
  element.maxLines = element.maxLines + 1;

  // Wait for the update cycle and the requestAnimationFrame delay within _checkOverflow to complete.
  await element.updateComplete;
  await new Promise(resolve => setTimeout(resolve, 50));
};

describe('Toujou Read More', () => {
  let element: ToujouReadMore;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-read-more max-lines="3">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem.</p>
        <button id="open-button" slot="open-button">Read more</button>
        <button id="close-button" slot="close-button">Read less</button>
      </toujou-read-more>
    `);
  });

  it('can be instantiated', () => {
    expect(element).to.exist;
    expect(element.nodeName.toLowerCase()).to.equal('toujou-read-more');
  });

  it('has default properties', () => {
    expect(element.maxLines).to.equal(3);
    expect(element.hasClampedText).to.be.true;
    expect(element.showButton).to.be.false;
  });

  it('renders content slot', () => {
    const slot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.be.greaterThan(0);
    expect(assigned[0].tagName.toLowerCase()).to.equal('p');
  });

  it('does not show button when content does not overflow', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 50, 50);

    await triggerOverflowCheck(element);

    expect(element.showButton).to.be.false;
    expect(element.hasClampedText).to.be.false;
    const buttonsDiv = element.shadowRoot?.querySelector('.buttons');
    expect(buttonsDiv).to.not.exist;
  });

  it('shows button when content overflows', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    // Trigger check via public property change
    await triggerOverflowCheck(element);

    expect(element.showButton).to.be.true;
  });

  it('shows correct button for each state', async () => {
    const content = queryShadow(element, '.content');

    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    let buttonsDiv = queryShadow(element, '.buttons');

    // When clamped (initial state)
    const openButtonSlot = buttonsDiv.querySelector('slot[name="open-button"]');
    const closeButtonSlot = buttonsDiv.querySelector('slot[name="close-button"]');
    expect(openButtonSlot).to.exist;
    expect(closeButtonSlot).to.not.exist;

    // Click to toggle
    const toggleEventPromise = oneEvent(element, 'toujou-read-more-toggle');
    buttonsDiv.click();
    await toggleEventPromise;
    await element.updateComplete;

    // After toggle (Expanded state)
    buttonsDiv = queryShadow(element, '.buttons');
    const openButtonSlotAfter = buttonsDiv.querySelector('slot[name="open-button"]');
    const closeButtonSlotAfter = buttonsDiv.querySelector('slot[name="close-button"]');
    expect(openButtonSlotAfter).to.not.exist;
    expect(closeButtonSlotAfter).to.exist;
  });

  it('toggles clamped state when button is clicked', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const buttonsDiv = queryShadow(element, '.buttons');
    expect(buttonsDiv).to.exist;

    const toggleEventPromise = oneEvent(element, 'toujou-read-more-toggle');
    buttonsDiv.click();
    const event = await toggleEventPromise;

    expect(event).to.exist;
    expect(event.detail.isClamped).to.equal(false);
    expect(element.hasClampedText).to.be.false;
  });

  it('removes margin-bottom from last element in slot', async () => {
    const slot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    slot.dispatchEvent(new Event('slotchange'));
    const assigned = slot.assignedElements() as HTMLElement[];
    const last = assigned[assigned.length - 1];
    expect(last.style.marginBottom).to.equal('0px');
  });

  it('applies correct CSS custom property on initialization', () => {
    expect(element.style.getPropertyValue('--toujou-read-more-max-lines')).to.equal('3');
  });

  it('reacts to maxLines change', async () => {
    element.maxLines = 5;
    await element.updateComplete;
    expect(element.style.getPropertyValue('--toujou-read-more-max-lines')).to.equal('5');
  });

  it('rechecks overflow when maxLines changes', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    // Initial check (from fixture setup)
    await triggerOverflowCheck(element);
    expect(element.showButton).to.be.true;

    // Change maxLines - should recheck overflow
    element.maxLines = 10;
    await element.updateComplete;

    // Give time for requestAnimationFrame
    await new Promise(resolve => setTimeout(resolve, 20));

    expect(element.style.getPropertyValue('--toujou-read-more-max-lines')).to.equal('10');
  });

  it('has has-clamped-text attribute when clamped', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    expect(element.hasAttribute('has-clamped-text')).to.be.true;
  });

  it('removes has-clamped-text attribute when expanded', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const buttonsDiv = queryShadow(element, '.buttons');
    buttonsDiv.click();
    await element.updateComplete;

    expect(element.hasAttribute('has-clamped-text')).to.be.false;
  });

  it('emits toggle event with correct detail', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const buttonsDiv = queryShadow(element, '.buttons');
    const toggleEventPromise = oneEvent(element, 'toujou-read-more-toggle');

    buttonsDiv.click();
    const event = await toggleEventPromise;

    expect(event).to.exist;
    expect(event.detail).to.have.property('isClamped');
    expect(event.type).to.equal('toujou-read-more-toggle');
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });

  it('handles multiple paragraphs in content slot', async () => {
    element = await fixture(html`
      <toujou-read-more max-lines="3">
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <p>Third paragraph</p>
        <button slot="open-button">Read more</button>
        <button slot="close-button">Read less</button>
      </toujou-read-more>
    `);

    const slot = element.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.equal(3);
  });

});

describe('Toujou Read More - Accessibility Tests', () => {
  let element: ToujouReadMore;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-read-more max-lines="3">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem.</p>
        <button id="open-button" slot="open-button">Read more</button>
        <button id="close-button" slot="close-button">Read less</button>
      </toujou-read-more>
    `);
  });

  it('content div has correct role', () => {
    const content = queryShadow(element, '.content');
    expect(content.getAttribute('role')).to.equal('region');
  });

  it('has aria-label content region', () => {
    const content = queryShadow(element, '.content');
    expect(content.getAttribute('aria-label')).to.equal('Expandable content');
  });

  it('content region has id', () => {
    const content = queryShadow(element, '.content');
    expect(content.id).to.equal('read-more-content');
  });

  it('sets aria-expanded="false" when clamped', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const openButton = querySlotted(element, '#open-button');
    expect(openButton.getAttribute('aria-expanded')).to.equal('false');
  });

  it('sets aria-expanded="true" when expanded', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    // Click the actual button
    const openButton = querySlotted(element, '#open-button');
    openButton.click();
    await element.updateComplete;

    // Accessibility attributes update after a promise/update cycle
    await triggerOverflowCheck(element);

    const closeButton = querySlotted(element, '#close-button');

    expect(closeButton.getAttribute('aria-expanded')).to.equal('true');
  });

  it('sets aria-controls on open button', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const openButton = querySlotted(element, '#open-button');
    expect(openButton.getAttribute('aria-controls')).to.equal('read-more-content');
  });

  it('sets aria-controls on close button', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    // Click to expand
    const openButton = querySlotted(element, '#open-button');
    openButton.click();
    await element.updateComplete;

    await waitForOverflowCheck(element);

    const closeButton = querySlotted(element, '#close-button');
    expect(closeButton.getAttribute('aria-controls')).to.equal('read-more-content');
  });

  it('updates aria-expanded when toggling', async () => {
    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    const openButton = querySlotted(element, '#open-button');
    expect(openButton.getAttribute('aria-expanded')).to.equal('false');

    // Expand
    openButton.click();
    await element.updateComplete;
    await waitForOverflowCheck(element);

    const closeButton = querySlotted(element, '#close-button');
    expect(closeButton.getAttribute('aria-expanded')).to.equal('true');

    // Collapse
    closeButton.click();
    await element.updateComplete;
    await waitForOverflowCheck(element);

    const openButtonAgain = querySlotted(element, '#open-button');
    expect(openButtonAgain.getAttribute('aria-expanded')).to.equal('false');
  });

  it('handles multiple buttons in same slot', async () => {
    element = await fixture(html`
      <toujou-read-more max-lines="3">
        <p>Content</p>
        <button id="open-1" slot="open-button">Read more 1</button>
        <button id="open-2" slot="open-button">Read more 2</button>
        <button id="close-1" slot="close-button">Read less 1</button>
        <button id="close-2" slot="close-button">Read less 2</button>
      </toujou-read-more>
    `);

    const content = queryShadow(element, '.content');
    stubDimensions(content, 100, 50);

    await triggerOverflowCheck(element);

    // Both open buttons should have correct attributes
    const openButton1 = querySlotted(element, '#open-1');
    const openButton2 = querySlotted(element, '#open-2');

    expect(openButton1.getAttribute('aria-expanded')).to.equal('false');
    expect(openButton2.getAttribute('aria-expanded')).to.equal('false');
    expect(openButton1.getAttribute('aria-controls')).to.equal('read-more-content');
    expect(openButton2.getAttribute('aria-controls')).to.equal('read-more-content');
  });
});
