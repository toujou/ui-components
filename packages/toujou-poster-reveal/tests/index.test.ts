import {
  expect,
  fixture,
  html,
  oneEvent,
  elementUpdated,
} from '@open-wc/testing';

import '../src/toujou-poster-reveal';
import {
  ToujouPosterReveal,
  TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT,
} from '../src/toujou-poster-reveal';

describe('<toujou-poster-reveal>', () => {
  let el: ToujouPosterReveal;

  beforeEach(async () => {
    el = await fixture<ToujouPosterReveal>(html`
      <toujou-poster-reveal>
        <div slot="poster">Poster</div>
        <button slot="trigger">Play</button>
        <div slot="content">Content</div>
      </toujou-poster-reveal>
    `);
  });

  describe('basic rendering', () => {
    it('creates the component', () => {
      expect(el).to.exist;
      expect(el.tagName).to.equal('TOUJOU-POSTER-REVEAL');
    });

    it('passes the a11y audit', async () => {
      await expect(el).to.be.accessible();
    });

    it('is not activated by default', () => {
      expect(el.activated).to.be.false;
      expect(el.hasAttribute('activated')).to.be.false;
    });

    it('renders poster and trigger slots before activation', () => {
      const slots = el.shadowRoot?.querySelectorAll('slot');

      expect(slots).to.have.length(2);
      expect(slots?.[0].getAttribute('name')).to.equal('poster');
      expect(slots?.[1].getAttribute('name')).to.equal('trigger');
    });
  });

  describe('activation', () => {
    it('activates when trigger is clicked', async () => {
      const trigger = el.querySelector<HTMLButtonElement>(
        '[slot="trigger"]',
      )!;

      trigger.click();

      await elementUpdated(el);

      expect(el.activated).to.be.true;
      expect(el.hasAttribute('activated')).to.be.true;
    });

    it('activates when activate() is called', async () => {
      el.activate();

      await elementUpdated(el);

      expect(el.activated).to.be.true;
      expect(el.hasAttribute('activated')).to.be.true;
    });

    it('dispatches activate event', async () => {
      const eventPromise = oneEvent(
        el,
        TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT,
      );

      el.activate();

      const event = await eventPromise;

      expect(event.type).to.equal(
        TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT,
      );
    });

    it('dispatches a bubbling and composed event', async () => {
      const eventPromise = oneEvent(
        el,
        TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT,
      );

      el.activate();

      const event = (await eventPromise) as CustomEvent;

      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('dispatches the event only once', async () => {
      let count = 0;

      el.addEventListener(
        TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT,
        () => {
          count++;
        },
      );

      el.activate();
      el.activate();
      el.activate();

      await elementUpdated(el);

      expect(count).to.equal(1);
    });
  });

  describe('conditional rendering', () => {
    it('renders content slot after activation', async () => {
      el.activate();

      await elementUpdated(el);

      const slots = el.shadowRoot?.querySelectorAll('slot');

      expect(slots).to.have.length(1);
      expect(slots?.[0].getAttribute('name')).to.equal('content');
    });
  });

  describe('idempotency', () => {
    it('does not re-activate if already active', async () => {
      const element = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
        </toujou-poster-reveal>
      `);

      element.activate();
      element.activate();
      element.activate();

      await elementUpdated(element);

      expect(element.activated).to.be.true;
    });
  });
});
