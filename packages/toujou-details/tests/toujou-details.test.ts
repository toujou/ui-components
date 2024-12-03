import { expect, fixture, html } from '@open-wc/testing';
import { ToujouDetails } from '../src/toujou-details/toujou-details';
import '../src/index';
import sinon from 'sinon';

describe('Toujou Details', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-details></toujou-details>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-details'.toUpperCase());
  });

  it('reflects "is-open" property correctly', async () => {
    const el: ToujouDetails = await fixture(html`<toujou-details is-open></toujou-details>`);
    const details = el.shadowRoot.querySelector('details');
    expect(details.hasAttribute('open')).to.be.true;

    el.isOpen = false;
    await el.updateComplete;
    expect(details.hasAttribute('open')).to.be.false;
  });

  it('dispatches "toujou-details-connected" when added to an accordion', async () => {
    const parent = document.createElement('div');
    parent.innerHTML = `
      <toujou-details-accordion>
        <toujou-details></toujou-details>
      </toujou-details-accordion>
    `;
    document.body.appendChild(parent);

    const details: ToujouDetails = parent.querySelector('toujou-details');
    const eventSpy = sinon.spy();
    details.addEventListener('toujou-details-connected', eventSpy);

    // Trigger connectedCallback manually by appending to DOM
    parent.querySelector('toujou-details-accordion').appendChild(details);

    await details.updateComplete;
    expect(eventSpy).to.have.been.calledOnce;
    expect(eventSpy.firstCall.args[0].detail.detailsEl).to.equal(details);

    document.body.removeChild(parent);
  });

  it('exposes correct parts via "exportparts"', async () => {
    const el: ToujouDetails = await fixture(html`<toujou-details></toujou-details>`);
    const details = el.shadowRoot.querySelector('details');

    expect(details).to.have.attribute('exportparts');
    expect(details.getAttribute('exportparts')).to.include('details-summary');
    expect(details.getAttribute('exportparts')).to.include('details-content');
  });

  it('Clicking the title toggles the elemenent', async () => {
    const el: ToujouDetails = await fixture(html`<toujou-details>
      <h3 slot="summary" class="details__title">This is the summary</h3>
    </toujou-details>`);
    const details: HTMLDetailsElement = el.shadowRoot.querySelector('details');
    const title: HTMLElement = el.querySelector('.details__title');

    expect(details.open).to.be.false;

    title.click();
    expect(details.open).to.be.true;

    title.click();
    expect(details.open).to.be.false;
  });

});
