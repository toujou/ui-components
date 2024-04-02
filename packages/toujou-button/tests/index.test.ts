import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { ToujouButton } from '../src/toujou-button';

describe('Toujou Button', () => {
  let element: ToujouButton;

  beforeEach(async () => {
    element = await fixture(html`
      <button is="toujou-button"></button>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('button'.toUpperCase());
  });

  it('is accessible', async () => {
    expect(element).to.be.accessible();
  });

  it('has default attributes', async () => {
    const buttonVariant = element.getAttribute('button-variant');
    expect(buttonVariant).to.equal('primary');

    const buttonSize = element.getAttribute('button-size');
    expect(buttonSize).to.equal('normal');

    const buttonType = element.getAttribute('button-type');
    expect(buttonType).to.equal('default');
  });
});

describe('Toujou Button with valid custom properties', () => {
  let element: ToujouButton;

  beforeEach(async () => {
    element = await fixture(html`
      <button is="toujou-button" button-variant="secondary" button-size="large" button-type="border"></button>
    `);
  });

  it('has correct properties', async () => {
    const buttonVariant = element.getAttribute('button-variant');
    expect(buttonVariant).to.equal('secondary');

    const buttonSize = element.getAttribute('button-size');
    expect(buttonSize).to.equal('large');

    const buttonType = element.getAttribute('button-type');
    expect(buttonType).to.equal('border');
  });
});

describe('Toujou Button with invalid custom properties', () => {
  let element: ToujouButton;

  beforeEach(async () => {
    element = await fixture(html`
      <button is="toujou-button" button-variant="test" button-size="test" button-type="test"></button>
    `);
  });

  it('can set default properties if given attributes are invalid', async () => {
    const buttonVariant = element.getAttribute('button-variant');
    expect(buttonVariant).to.equal('primary');

    const buttonSize = element.getAttribute('button-size');
    expect(buttonSize).to.equal('normal');

    const buttonType = element.getAttribute('button-type');
    expect(buttonType).to.equal('default');
  });
});
