import { expect, fixture, html } from '@open-wc/testing';

import '../src';

describe('toujou-input-date-mask', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
            <toujou-input-date-mask mask="dd.mm.yyyy">
                <input placeholder="tt.mm.jjjj"
                       required
                       autocomplete="off"
                       type="tel"
                       id="facade"
                       slot="facade"
                />
                <input type="hidden"
                       slot="input"
                       id="hidden"
                       value="2022-01-03"
                />

            </toujou-input-date-mask>
        `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-input-date-mask'.toUpperCase());
  });

  it('will initialize input element with input mask', async () => {
    const inputElement = element.querySelector('#facade') as any;

    expect(inputElement.inputmask).to.not.be.null;
    expect(inputElement.inputmask.userOptions.mask).to.be.equal('99.99.9999');
    expect(inputElement.inputmask.userOptions.showMaskOnFocus).to.be.false;
    expect(inputElement.inputmask.userOptions.showMaskOnHover).to.be.false;
  });

  it('will set validity state to false on incomplete date string', async () => {
    const inputElement = element.querySelector('#facade') as HTMLInputElement;
    const hiddenElement = element.querySelector('#hidden') as HTMLInputElement;

    inputElement.value = '12';

    inputElement.dispatchEvent(new CustomEvent('input'));
    expect(inputElement.checkValidity()).to.be.false;
    expect(hiddenElement.value).to.be.equal('');
  });

  it('will set validity state to false on invalid date string', async () => {
    const inputElement = element.querySelector('#facade') as HTMLInputElement;
    const hiddenElement = element.querySelector('#hidden') as HTMLInputElement;

    inputElement.value = '31.13.2001';

    inputElement.dispatchEvent(new CustomEvent('input'));
    expect(inputElement.checkValidity()).to.be.false;
    expect(hiddenElement.value).to.be.equal('');
  });

  it('will set validity state to true on valid date string', async () => {
    const inputElement = element.querySelector('#facade') as HTMLInputElement;
    const hiddenElement = element.querySelector('#hidden') as HTMLInputElement;
    inputElement.value = '13.12.2001';

    inputElement.dispatchEvent(new CustomEvent('input'));
    expect(inputElement.checkValidity()).to.be.true;

    expect(hiddenElement.value).to.be.equal('2001-12-13');
  });

  it('will prefill facade on preset hidden input value', async () => {
    const inputElement = element.querySelector('#facade') as HTMLInputElement;
    expect(inputElement.value).to.be.equal('03.01.2022');
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });
});
