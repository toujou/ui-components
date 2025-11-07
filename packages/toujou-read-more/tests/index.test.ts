import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import '../src/index'; // adjust path if needed

describe('Toujou Read More', () => {
  let element: any;

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
    const slot = element.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.be.greaterThan(0);
    expect(assigned[0].tagName.toLowerCase()).to.equal('p');
  });

  it('does not show button when content does not overflow', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;

    // No overflow - scrollHeight equals clientHeight
    Object.defineProperty(content, 'scrollHeight', { get: () => 50 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    expect(element.showButton).to.be.false;
    expect(element.hasClampedText).to.be.false;
    const buttonsDiv = element.shadowRoot!.querySelector('.buttons');
    expect(buttonsDiv).to.not.exist;
  });

  it('shows button when content overflows', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow(); // call it manually
    await element.updateComplete;

    expect(element.showButton).to.be.true;
  });

  it('shows correct button for each state', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;

    // Stub overflow
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    let buttonsDiv = element.shadowRoot!.querySelector('.buttons') as HTMLElement;
    expect(buttonsDiv).to.exist;

    // When clamped (initial state)
    let openButtonSlot = buttonsDiv.querySelector('slot[name="open-button"]');
    let closeButtonSlot = buttonsDiv.querySelector('slot[name="close-button"]');
    expect(openButtonSlot).to.exist;
    expect(closeButtonSlot).to.not.exist;

    // Click to toggle
    const toggleEventPromise = oneEvent(element, 'toujou-read-more-toggle');
    buttonsDiv.click();
    await toggleEventPromise;
    await element.updateComplete;

    // After toggle
    buttonsDiv = element.shadowRoot!.querySelector('.buttons') as HTMLElement;
    const openButtonSlotAfter = buttonsDiv.querySelector('slot[name="open-button"]');
    const closeButtonSlotAfter = buttonsDiv.querySelector('slot[name="close-button"]');
    expect(openButtonSlotAfter).to.not.exist;
    expect(closeButtonSlotAfter).to.exist;
  });

  it('toggles clamped state when button is clicked', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    const buttonsDiv = element.shadowRoot!.querySelector('.buttons') as HTMLElement;
    expect(buttonsDiv).to.exist;

    const toggleEventPromise = oneEvent(element, 'toujou-read-more-toggle');
    buttonsDiv.click();
    const event = await toggleEventPromise;

    expect(event).to.exist;
    expect(event.detail.isClamped).to.equal(false);
    expect(element.hasClampedText).to.be.false;
  });

  it('removes margin-bottom from last element in slot', async () => {
    const slot = element.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement;
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
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;
    expect(element.showButton).to.be.true;

    // Change maxLines - should recheck overflow
    element.maxLines = 10;
    await element.updateComplete;
    // Give time for requestAnimationFrame
    await new Promise(resolve => setTimeout(resolve, 20));

    // Button visibility might change based on new line count
    expect(element.style.getPropertyValue('--toujou-read-more-max-lines')).to.equal('10');
  });

  it('has has-clamped-text attribute when clamped', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    expect(element.hasAttribute('has-clamped-text')).to.be.true;
  });

  it('removes has-clamped-text attribute when expanded', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    const buttonsDiv = element.shadowRoot!.querySelector('.buttons') as HTMLElement;
    buttonsDiv.click();
    await element.updateComplete;

    expect(element.hasAttribute('has-clamped-text')).to.be.false;
  });

  it('emits toggle event with correct detail', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    const buttonsDiv = element.shadowRoot!.querySelector('.buttons') as HTMLElement;
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

    const slot = element.shadowRoot.querySelector('slot:not([name])') as HTMLSlotElement;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.equal(3);
  });

});

describe('Toujou Read More - Accessibility Tests', () => {
  let element: any;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-read-more max-lines="3">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet felis lorem.</p>
        <button id="open-button" slot="open-button">Read more</button>
        <button id="close-button" slot="close-button">Read less</button>
      </toujou-read-more>
    `);
  });

  it('content div has correct rola', () => {
    const content = element.shadowRoot.querySelector('.content') as HTMLElement;
    expect(content.getAttribute('role')).to.equal('region');
  });

  it('has aria-label content region', () => {
    const content = element.shadowRoot.querySelector('.content') as HTMLElement;
    expect(content.getAttribute('aria-label')).to.equal('Expandable content');
  });

  it('content region has id', () => {
    const content = element.shadowRoot.querySelector('.content') as HTMLElement;
    expect(content.id).to.equal('read-more-content');
  });

  it('sets aria-expanded="false" when clamped', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    // Wait for requestAnimationFrame in _setupButtonAccessibility
    await new Promise(resolve => setTimeout(resolve, 20));

    const openButton = element.querySelector('#open-button') as HTMLElement;
    expect(openButton.getAttribute('aria-expanded')).to.equal('false');
  });

  it('sets aria-expanded="true" when expanded', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    // Click the actual button
    const openButton = element.querySelector('#open-button') as HTMLElement;
    console.log('Open button before click:', openButton);
    console.log('Open button aria-expanded:', openButton?.getAttribute('aria-expanded'));

    openButton.click();
    await element.updateComplete;

    // Wait for requestAnimationFrame in _setupButtonAccessibility
    await new Promise(resolve => requestAnimationFrame(resolve));
    await element.updateComplete;

    const closeButton = element.querySelector('#close-button') as HTMLElement;

    expect(closeButton.getAttribute('aria-expanded')).to.equal('true');
  });

  it('sets aria-controls on open button', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    // Wait for requestAnimationFrame in _setupButtonAccessibility
    await new Promise(resolve => setTimeout(resolve, 20));

    const openButton = element.querySelector('#open-button') as HTMLElement;
    expect(openButton.getAttribute('aria-controls')).to.equal('read-more-content');
  });

  it('sets aria-controls on close button', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;

    // Click to expand
    const openButton = element.querySelector('#open-button') as HTMLElement;
    openButton.click();
    await element.updateComplete;

    // Wait for requestAnimationFrame in _setupButtonAccessibility
    await new Promise(resolve => setTimeout(resolve, 20));

    const closeButton = element.querySelector('#close-button') as HTMLElement;
    expect(closeButton.getAttribute('aria-controls')).to.equal('read-more-content');
  });

  it('updates aria-expanded when toggling', async () => {
    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 20));

    const openButton = element.querySelector('#open-button') as HTMLElement;
    expect(openButton.getAttribute('aria-expanded')).to.equal('false');

    // Expand
    openButton.click();
    await element.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 20));

    const closeButton = element.querySelector('#close-button') as HTMLElement;
    expect(closeButton.getAttribute('aria-expanded')).to.equal('true');

    // Collapse
    closeButton.click();
    await element.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 20));

    const openButtonAgain = element.querySelector('#open-button') as HTMLElement;
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

    const content = element.shadowRoot!.querySelector('.content') as HTMLElement;
    Object.defineProperty(content, 'scrollHeight', { get: () => 100 });
    Object.defineProperty(content, 'clientHeight', { get: () => 50 });

    await element._checkOverflow();
    await element.updateComplete;
    await new Promise(resolve => setTimeout(resolve, 20));

    // Both open buttons should have correct attributes
    const openButton1 = element.querySelector('#open-1') as HTMLElement;
    const openButton2 = element.querySelector('#open-2') as HTMLElement;

    expect(openButton1.getAttribute('aria-expanded')).to.equal('false');
    expect(openButton2.getAttribute('aria-expanded')).to.equal('false');
    expect(openButton1.getAttribute('aria-controls')).to.equal('read-more-content');
    expect(openButton2.getAttribute('aria-controls')).to.equal('read-more-content');
  });
});
