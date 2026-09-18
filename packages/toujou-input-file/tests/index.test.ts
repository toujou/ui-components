import { elementUpdated, expect, fixture, html } from '@open-wc/testing';

import '../src/index';

describe('Toujou Input File', () => {
  let element: Element;
  beforeEach(async () => {
    element = await fixture(html`
      <toujou-input-file>
        <input
          slot="input"
          data-element-type="FileUpload"
          type="file"
          class="input input--file-upload"
          placeholder="Add a file"
          aria-label="File"
        />
        <button
          slot="clear-chosen-file-button"
          type="button"
          aria-label="Clear file input"
          class="button"
        >
          🗑️ Clear
        </button>
      </toujou-input-file>
    `);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('toujou-input-file'.toUpperCase());
  });

  it('will render input only by default', async () => {
    const inputElement = element.querySelector('input');
    const clearButton = element.shadowRoot?.querySelector('slot[name="clear-chosen-file-button"]');

    expect(inputElement).not.to.be.null;
    expect(clearButton).to.be.null;
  });

  it('will render input and button after selecting a file', async () => {
    const inputElement = element.querySelector('input');

    const testFileContent = ['This is a test.'];
    const testFileName = 'test_file.txt';
    const testFile = new File(testFileContent, testFileName);

    const testDataTransfer = new DataTransfer();
    testDataTransfer.items.add(testFile);
    inputElement.files = testDataTransfer.files;

    inputElement.dispatchEvent(new Event('change', { bubbles: true }));

    await elementUpdated(element);

    const clearButton = element.shadowRoot?.querySelector('slot[name="clear-chosen-file-button"]');

    expect(inputElement).not.to.be.null;
    expect(inputElement.value).not.to.be.empty;
    expect(clearButton).not.to.be.null;
  });

  it('will clear the input and hide the button after clicking the button', async () => {
    const inputElement = element.querySelector('input');

    const testFileContent = ['This is a test.'];
    const testFileName = 'test_file.txt';
    const testFile = new File(testFileContent, testFileName);

    const testDataTransfer = new DataTransfer();
    testDataTransfer.items.add(testFile);
    inputElement.files = testDataTransfer.files;

    inputElement.dispatchEvent(new Event('change', { bubbles: true }));

    await elementUpdated(element);

    (element.shadowRoot?.querySelector('slot[name="clear-chosen-file-button"]') as HTMLElement).click();

    await elementUpdated(element);

    const clearButton = element.shadowRoot?.querySelector('slot[name="clear-chosen-file-button"]');

    expect(inputElement.value).to.be.empty;
    expect(clearButton).to.be.null;
  });

  it('passes the a11y audit', () => {
    expect(element).to.be.accessible();
  });
});
