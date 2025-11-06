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
