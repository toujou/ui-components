import { expect, fixture, html } from '@open-wc/testing';
import '../src/index';
import { ToujouModal } from '../src/toujou-modal';

it('renders the modal with default properties', async () => {
  const el: ToujouModal = await fixture(html`<toujou-modal></toujou-modal>`);
  expect(el).to.exist;
  expect(el.opened).to.be.false;
  expect(el.noHeader).to.be.false;
});
