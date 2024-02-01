import { expect, fixture, html } from '@open-wc/testing';

import '../src/index';
import { ToujouEstimatedReadingTime } from '../src/toujou-estimated-reading-time';

const testText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
  'Tellus orci ac auctor augue mauris. In fermentum et sollicitudin ac orci phasellus. Id interdum velit laoreet id donec ultrices tincidunt arcu non.' +
  'Quam nulla porttitor massa id neque aliquam. Amet cursus sit amet dictum sit amet justo donec enim. Vitae nunc sed velit dignissim sodales ut.' +
  'Sagittis nisl rhoncus mattis rhoncus urna neque. Curabitur vitae nunc sed velit dignissim sodales ut eu. Sodales ut etiam sit amet nisl purus in mollis.' +
  'Eget est lorem ipsum dolor sit amet. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin. Scelerisque fermentum dui faucibus in ornare.' +
  'Diam in arcu cursus euismod quis viverra nibh cras pulvinar. Gravida quis blandit turpis cursus in hac. Morbi leo urna molestie at elementum eu facilisis sed odio.' +
  'Faucibus turpis in eu mi bibendum. Pellentesque nec nam aliquam sem et tortor. Sagittis id consectetur purus ut faucibus pulvinar elementum. A pellentesque sit amet porttitor eget dolor.' +
  'Tempor orci dapibus ultrices in iaculis nunc sed augue. Massa ultricies mi quis hendrerit. Integer enim neque volutpat ac tincidunt vitae semper quis lectus.' +
  'Pellentesque nec nam aliquam sem et tortor. Tincidunt dui ut ornare lectus sit amet est placerat in. In est ante in nibh. Urna molestie at elementum eu facilisis sed.' +
  'Suscipit adipiscing bibendum est ultricies integer quis auctor elit sed. Eget felis eget nunc lobortis mattis aliquam faucibus purus in. Sollicitudin tempor id eu nisl.' +
  'Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Nisl suscipit adipiscing bibendum est ultricies integer quis. Consequat id porta nibh venenatis cras.' +
  'Neque vitae tempus quam pellentesque nec nam. Semper quis lectus nulla at volutpat. In iaculis nunc sed augue. Sit amet luctus venenatis lectus magna fringilla urna porttitor.' +
  'Sed enim ut sem viverra aliquet eget sit amet tellus. Urna molestie at elementum eu facilisis sed odio morbi quis. Ultrices gravida dictum fusce ut.' +
  'Eu mi bibendum neque egestas congue quisque egestas. Aliquam nulla facilisi cras fermentum odio. Aliquet eget sit amet tellus. Facilisis volutpat est velit egestas dui id.' +
  'Cras adipiscing enim eu turpis egestas. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas. Dignissim sodales ut eu sem integer vitae.' +
  'Augue interdum velit euismod in pellentesque massa. Mattis nunc sed blandit libero. Proin sed libero enim sed faucibus turpis in eu mi.' +
  'Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Ut aliquam purus sit amet luctus venenatis lectus magna. Tortor condimentum lacinia quis vel.' +
  'Non curabitur gravida arcu ac tortor dignissim convallis aenean.' +
  'Diam in arcu cursus euismod quis viverra nibh cras pulvinar. Gravida quis blandit turpis cursus in hac. Morbi leo urna molestie at elementum eu facilisis sed odio.' +
  'Faucibus turpis in eu mi bibendum. Pellentesque nec nam aliquam sem et tortor. Sagittis id consectetur purus ut faucibus pulvinar elementum. A pellentesque sit amet porttitor eget dolor.' +
  'Tempor orci dapibus ultrices in iaculis nunc sed augue. Massa ultricies mi quis hendrerit. Integer enim neque volutpat ac tincidunt vitae semper quis lectus.' +
  'Pellentesque nec nam aliquam sem et tortor. Tincidunt dui ut ornare lectus sit amet est placerat in. In est ante in nibh. Urna molestie at elementum eu facilisis sed.' +
  'Suscipit adipiscing bibendum est ultricies integer quis auctor elit sed. Eget felis eget nunc lobortis mattis aliquam faucibus purus in. Sollicitudin tempor id eu nisl.' +
  'Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis. Nisl suscipit adipiscing bibendum est ultricies integer quis. Consequat id porta nibh venenatis cras.' +
  'Neque vitae tempus quam pellentesque nec nam. Semper quis lectus nulla at volutpat. In iaculis nunc sed augue. Sit amet luctus venenatis lectus magna fringilla urna porttitor.' +
  'Sed enim ut sem viverra aliquet eget sit amet tellus. Urna molestie at elementum eu facilisis sed odio morbi quis. Ultrices gravida dictum fusce ut.' +
  'Eu mi bibendum neque egestas congue quisque egestas. Aliquam nulla facilisi cras fermentum odio. Aliquet eget sit amet tellus. Facilisis volutpat est velit egestas dui id.' +
  'Cras adipiscing enim eu turpis egestas. Ultricies leo integer malesuada nunc vel risus commodo viverra maecenas. Dignissim sodales ut eu sem integer vitae.' +
  'Augue interdum velit euismod in pellentesque massa. Mattis nunc sed blandit libero. Proin sed libero enim sed faucibus turpis in eu mi.' +
  'Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Ut aliquam purus sit amet luctus venenatis lectus magna. Tortor condimentum lacinia quis vel.' +
  'Non curabitur gravida arcu ac tortor dignissim convallis aenean';

describe('Toujou Estimated Reading Time - no attributes', () => {
  let element: ToujouEstimatedReadingTime;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-estimated-reading-time></toujou-estimated-reading-time>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-estimated-reading-time'.toUpperCase());
  });

  it('is accessible', async () => {
    expect(element).to.be.accessible();
  });

  it('has correct default properties', async () => {
    expect(element.wordCount).to.equal(0);
    expect(element.duration).to.equal(0);
    expect(element.targetSelector).to.equal('body');
    expect(element.minutesSingularText).to.equal('minute');
    expect(element.minutesPluralText).to.equal('minutes');
    expect(element.lessThanText).to.equal('under');
    expect(element.readingSpeed).to.equal(250);
    expect(element.targetEl).to.be.undefined;
  });

  it('renders correct content', async () => {
    expect(element.innerHTML).to.equal('');
  });
});

describe('Toujou Estimated Reading Time - with label and attributes', () => {
  let element: ToujouEstimatedReadingTime;

  beforeEach(async () => {
    element = await fixture(html`
      <toujou-estimated-reading-time
        class='estimated-reading-time'
        target-selector='main'
        minutes-singular-text='minuto'
        minutes-plural-text='minutos'
        less-than-text='Menos de'
        reading-speed='125'
      >
        <span slot='label'>Estimated reading time:</span>
      </toujou-estimated-reading-time>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-estimated-reading-time'.toUpperCase());
  });

  it('is accessible', async () => {
    expect(element).to.be.accessible();
  });

  it('has correct property values', async () => {
    expect(element.wordCount).to.equal(0);
    expect(element.duration).to.equal(0);
    expect(element.targetSelector).to.equal('main');
    expect(element.minutesSingularText).to.equal('minuto');
    expect(element.minutesPluralText).to.equal('minutos');
    expect(element.lessThanText).to.equal('Menos de');
    expect(element.readingSpeed).to.equal(125);
  });

  it('renders correct content', async () => {
    expect(element.textContent.trim()).to.equal('Estimated reading time:');
    expect(element.innerHTML.trim()).to.equal('<span slot="label">Estimated reading time:</span>');
  });
});

describe('Toujou Estimated Reading Time - with target', () => {
  let container: HTMLElement;

  beforeEach(async () => {
    container = await fixture(html`
      <div class='container'>
        <p class='some-text'>${testText}</p>
        <toujou-estimated-reading-time
          class='estimated-reading-time'
          target-selector='.container .some-text'
        >
          <span slot='label'>Estimated reading time:</span>
        </toujou-estimated-reading-time>
      </div>
    `);
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('can get target element', async () => {
    const element: ToujouEstimatedReadingTime = container.querySelector('.estimated-reading-time');
    expect(element.targetSelector).to.equal('.container .some-text');
    expect(element.targetEl).to.not.be.undefined;
  });

  it('can get correct word count', async () => {
    const element: ToujouEstimatedReadingTime = container.querySelector('.estimated-reading-time');
    expect(element.wordCount).to.equal(708);
  });

  it('can calculate reading time', async () => {
    const element: ToujouEstimatedReadingTime = container.querySelector('.estimated-reading-time');
    expect(element.duration).to.equal(3);
  });

  it('gets correct result', async () => {
    const element: ToujouEstimatedReadingTime = container.querySelector('.estimated-reading-time');
    expect(element.result).to.equal('3 minutes');
  });

  it('gets correct result with custom reading time', async () => {
    const element: ToujouEstimatedReadingTime = container.querySelector('.estimated-reading-time');
    element.readingSpeed = 100;
    expect(element.result).to.equal('3 minutes');
  });
});
