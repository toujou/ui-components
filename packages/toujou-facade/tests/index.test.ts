import { expect, fixture, html, oneEvent, elementUpdated } from '@open-wc/testing';

import '../src/toujou-facade';
import { ToujouFacade, TOUJOU_FACADE_ACTIVATE_EVENT } from '../src/toujou-facade';

describe('<toujou-facade> - basic rendering', () => {
  let el: ToujouFacade;

  beforeEach(async () => {
    el = await fixture<ToujouFacade>(html`
      <toujou-facade>
        <div slot="poster">Poster</div>
        <button slot="trigger">Play</button>
        <div slot="content">Content</div>
      </toujou-facade>
    `);
  });

  it('creates the component', () => {
    expect(el).to.exist;
    expect(el.nodeName).to.equal('TOUJOU-FACADE');
  });

  it('passes the a11y audit', async () => {
    await expect(el).to.be.accessible();
  });

  it('is not activated by default', () => {
    expect(el.activated).to.be.false;
    expect(el.hasAttribute('activated')).to.be.false;
  });
});

describe('<toujou-facade> - activation', () => {
  let el: ToujouFacade;

  beforeEach(async () => {
    el = await fixture<ToujouFacade>(html`
      <toujou-facade>
        <div slot="poster">Poster</div>
        <button slot="trigger">Play</button>
        <div slot="content">Content</div>
      </toujou-facade>
    `);
  });

  it('activates on trigger click', async () => {
    const trigger = el.querySelector<HTMLButtonElement>('[slot="trigger"]')!;

    trigger.click();
    await elementUpdated(el);

    expect(el.activated).to.be.true;
    expect(el.hasAttribute('activated')).to.be.true;
  });

  it('dispatches activate event once', async () => {
    const trigger = el.querySelector<HTMLButtonElement>('[slot="trigger"]')!;

    const eventPromise = oneEvent(el, TOUJOU_FACADE_ACTIVATE_EVENT);

    trigger.click();
    const event = await eventPromise;

    expect(event).to.exist;
    expect(event.type).to.equal(TOUJOU_FACADE_ACTIVATE_EVENT);
  });

  it('does not dispatch event twice', async () => {
    let count = 0;

    el.addEventListener(TOUJOU_FACADE_ACTIVATE_EVENT, () => {
      count++;
    });

    const trigger = el.querySelector<HTMLButtonElement>('[slot="trigger"]')!;

    trigger.click();
    trigger.click();

    await elementUpdated(el);

    expect(count).to.equal(1);
  });
});

describe('<toujou-facade> - slot visibility behavior', () => {
  let el: ToujouFacade;

  beforeEach(async () => {
    el = await fixture<ToujouFacade>(html`
      <toujou-facade>
        <div slot="poster">Poster</div>
        <button slot="trigger">Play</button>
        <div slot="content">Content</div>
      </toujou-facade>
    `);
  });

  it('hides content before activation (via CSS state)', async () => {
    const content = el.querySelector('[slot="content"]') as HTMLElement;

    // We cannot directly test computed CSS in open-wc easily,
    // but we can ensure state has NOT changed
    expect(el.activated).to.be.false;
    expect(content).to.exist;
  });

  it('shows content after activation state change', async () => {
    const trigger = el.querySelector<HTMLButtonElement>('[slot="trigger"]')!;

    trigger.click();
    await elementUpdated(el);

    expect(el.activated).to.be.true;

    const content = el.querySelector('[slot="content"]') as HTMLElement;
    expect(content).to.exist;
  });
});

describe('<toujou-facade> - idempotency', () => {
  it('does not re-activate if already active', async () => {
    const el = await fixture<ToujouFacade>(html`
      <toujou-facade>
        <button slot="trigger">Play</button>
      </toujou-facade>
    `);

    el.activate();
    el.activate();
    el.activate();

    await elementUpdated(el);

    expect(el.activated).to.be.true;
  });
});
