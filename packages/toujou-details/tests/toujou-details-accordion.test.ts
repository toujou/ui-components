import { expect, fixture, html } from '@open-wc/testing';
import '../src/index';
import sinon from 'sinon';
import { ToujouDetailsEventNames } from '../src/types/types';
import { ToujouDetailsAccordion } from '../src/toujou-details-accordion/toujou-details-accordion';

describe('ToujouDetailsAccordion', () => {
  it('renders correctly with default properties', async () => {
    const el: ToujouDetailsAccordion = await fixture(html`<toujou-details-accordion></toujou-details-accordion>`);
    expect(el).to.exist;
    expect(el.singleExpandMode).to.be.false;
    expect(el.toujouDetailsElements.size).to.equal(0);
  });

  it('dispatches DETAILS_ACCORDION_CONNECTED event on connect', async () => {
    const eventSpy = sinon.spy();
    const el: ToujouDetailsAccordion = await fixture(html`<toujou-details-accordion></toujou-details-accordion>`);
    el.addEventListener(ToujouDetailsEventNames.DETAILS_ACCORDION_CONNECTED, eventSpy);

    el.connectedCallback();
    expect(eventSpy).to.have.been.calledOnce;
  });

  it('adds details to the detailsElements set', async () => {
    const accordion: ToujouDetailsAccordion = await fixture(html`
    <toujou-details-accordion>
      <toujou-details></toujou-details>
      <toujou-details></toujou-details>
      <toujou-details></toujou-details>
    </toujou-details-accordion>
  `);

    expect(accordion.toujouDetailsElements.size).to.equal(3);
  });
});
