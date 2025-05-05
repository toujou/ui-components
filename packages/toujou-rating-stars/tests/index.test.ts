import { expect, fixture, html } from '@open-wc/testing';
import '../src/toujou-rating-stars';

describe('Toujou Rating Stars', () => {
  let element: HTMLElement;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-rating-stars
        rating-value="3.8"
        rating-total="5"
        rating-suffix="D"
      ></toujou-rating-stars>
    `);
  });

  it('creates the component', () => {
    expect(element).to.exist;
    expect(element.nodeName).to.equal('TOUJOU-RATING-STARS');
  });

  it('renders the correct number of stars', () => {
    const stars = element.querySelectorAll('.rating-stars__star');
    expect(stars.length).to.equal(5);
  });

  it('renders correct star-value attributes based on rating', () => {
    const stars = element.querySelectorAll('.rating-stars__star');
    const values = Array.from(stars).map(star => star.getAttribute('star-value'));
    expect(values).to.deep.equal(['100', '100', '100', '80', '0']);
  });

  it('renders suffix if provided', () => {
    const suffix = element.querySelector('.rating-stars__suffix');
    expect(suffix).to.exist;
    expect(suffix?.textContent).to.equal('D');
  });

  it('is accessible', async () => {
    await expect(element).to.be.accessible();
  });
});
