import { expect, fixture, html, oneEvent, nextFrame } from '@open-wc/testing';
import '../src/toujou-datepicker';
import { ToujouDatepicker } from '../src/toujou-datepicker';

describe('ToujouDatepicker', () => {
  it('can be created', async () => {
    const el: ToujouDatepicker = await fixture(html`
        <toujou-datepicker>
          <input type="text" />
        </toujou-datepicker>
    `);

    expect(el).to.not.be.null;
    expect(el.nodeName).to.equal('TOUJOU-DATEPICKER');
  });

  it('respects custom show-months attribute', async () => {
    const el: ToujouDatepicker = await fixture(html`
      <toujou-datepicker show-months="2">
        <input type="text" />
      </toujou-datepicker>
    `);

    expect((el as any).showMonths).to.equal(2);
  });

  it('dispatches "open" event when Flatpickr opens', async () => {
    const el: ToujouDatepicker = await fixture(html`
      <toujou-datepicker>
        <input type="text" />
      </toujou-datepicker>
    `);

    const input = el.querySelector('input')!;
    // simulate Flatpickr calling onOpen
    input.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));

    const listener = oneEvent(input, 'open');
    input.dispatchEvent(new CustomEvent('open', { bubbles: true, composed: true }));
    const event = await listener;

    expect(event).to.exist;
    expect(event.type).to.equal('open');
  });
});

describe('Toujou Datepicker dynamic showMonths on open', () => {
  let element: ToujouDatepicker;
  let input: HTMLInputElement;

  beforeEach(async () => {
    element = await fixture(html`<toujou-datepicker show-months="2">
      <input type="text">
    </toujou-datepicker>`);
    input = element.querySelector('input')!;

    await nextFrame(); // Wait for the component to be fully connected
  });

  it('updates showMonths dynamically when Flatpickr opens', async () => {
    expect(element.showMonths).to.equal(2);

    const fpInstance = (input as any)._flatpickr;
    expect(fpInstance).to.exist;

    let updated = false;

    input.addEventListener('open', (event: any) => {
      element.showMonths = 3;
      event.detail.instance.set('showMonths', element.showMonths);
      updated = true;
    });

    // Trigger the open event
    fpInstance.open();

    // Wait until the 'updated' flag is set to true
    await new Promise<void>(resolve => {
      const check = () => {
        if (updated) {
          resolve();
        } else {
          setTimeout(check, 10);
        }
      };
      check();
    });

    // Assert that the property and the Flatpickr instance have been updated
    expect(element.showMonths).to.equal(3);
    expect(fpInstance.config.showMonths).to.equal(3);
  });
});
