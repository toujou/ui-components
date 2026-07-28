import { expect, fixture, oneEvent } from '@open-wc/testing';

import '../src/index';

const renderCountdown = (targetDate: string) => `
  <toujou-countdown
    target-date="${targetDate}"
    role="timer"
    aria-label="Countdown"
  >
    <div class="countdown__counter">
      <div class="countdown__item" data-unit="days">
        <span class="countdown__value">0</span>
        <span class="countdown__label">Days</span>
      </div>

      <div class="countdown__item" data-unit="hours">
        <span class="countdown__value">00</span>
        <span class="countdown__label">Hours</span>
      </div>

      <div class="countdown__item" data-unit="minutes">
        <span class="countdown__value">00</span>
        <span class="countdown__label">Minutes</span>
      </div>

      <div class="countdown__item" data-unit="seconds">
        <span class="countdown__value">00</span>
        <span class="countdown__label">Seconds</span>
      </div>
    </div>
  </toujou-countdown>
`;

describe('Toujou Countdown - basic rendering', () => {
  it('can create component', async () => {
    const element = await fixture(renderCountdown(
      new Date(Date.now() + 10000).toISOString()
    ));

    expect(element).to.not.be.null;
    expect(element.nodeName).to.equal('TOUJOu-COUNTDOWN'.toUpperCase());
  });

  it('passes the a11y audit', async () => {
    const element = await fixture(renderCountdown(
      new Date(Date.now() + 10000).toISOString()
    ));

    await expect(element).to.be.accessible();
  });
});


describe('Toujou Countdown - countdown values', () => {
  it('renders remaining time correctly', async () => {
    const target = new Date(Date.now() + (
      1 * 86400000 +
      2 * 3600000 +
      3 * 60000 +
      4000
    ));

    const element = await fixture(
      renderCountdown(target.toISOString())
    );

    expect(
      element.querySelector('[data-unit="days"] .countdown__value')?.textContent
    ).to.equal('1');

    expect(
      element.querySelector('[data-unit="hours"] .countdown__value')?.textContent
    ).to.equal('02');

    expect(
      element.querySelector('[data-unit="minutes"] .countdown__value')?.textContent
    ).to.equal('03');
  });

  it('formats values with leading zeros', async () => {
    const target = new Date(Date.now() + 5000);

    const element = await fixture(
      renderCountdown(target.toISOString())
    );

    expect(
      element.querySelector('[data-unit="seconds"] .countdown__value')?.textContent
    ).to.match(/^\d{2}$/);
  });
});


describe('Toujou Countdown - finished state', () => {
  it('sets finished attribute when countdown reaches zero', async () => {
    const element = await fixture(
      renderCountdown(
        new Date(Date.now() - 1000).toISOString()
      )
    );

    expect(element.hasAttribute('countdown-finished'))
      .to.equal(true);
  });

  it('sets days item state to finished', async () => {
    const element = await fixture(
      renderCountdown(
        new Date(Date.now() - 1000).toISOString()
      )
    );

    const daysItem = element.querySelector('[data-unit="days"]');

    expect(daysItem?.getAttribute('data-state'))
      .to.equal('finished');
  });
});


describe('Toujou Countdown - events', () => {
  it('dispatches toujou-countdown-finished event', async () => {
    const element = document.createElement('div');

    document.body.appendChild(element);

    const eventPromise = oneEvent(
      element,
      'toujou-countdown-finished'
    );

    element.innerHTML = renderCountdown(
      new Date(Date.now() - 1000).toISOString()
    );

    const event = await eventPromise as CustomEvent;

    expect(event).to.exist;

    document.body.removeChild(element);
  });

  it('includes the countdown element in event detail', async () => {
    const element = document.createElement('div');

    document.body.appendChild(element);

    const eventPromise = oneEvent(
      element,
      'toujou-countdown-finished'
    );

    element.innerHTML = renderCountdown(
      new Date(Date.now() - 1000).toISOString()
    );

    const event = await eventPromise as CustomEvent;

    expect(event.detail.element)
      .to.equal(element.querySelector('toujou-countdown'));

    document.body.removeChild(element);
  });
});


describe('Toujou Countdown - attribute changes', () => {
  it('updates when target-date changes', async () => {
    const element = await fixture(
      renderCountdown(
        new Date(Date.now() + 86400000).toISOString()
      )
    );

    const countdown = element as HTMLElement;

    countdown.setAttribute(
      'target-date',
      new Date(Date.now() - 1000).toISOString()
    );

    expect(
      countdown.hasAttribute('countdown-finished')
    ).to.equal(true);
  });
});


describe('Toujou Countdown - invalid values', () => {
  it('does not crash with invalid target-date', async () => {
    const element = await fixture(
      renderCountdown('invalid-date')
    );

    expect(element).to.exist;
    expect(
      element.hasAttribute('countdown-finished')
    ).to.equal(false);
  });
});
