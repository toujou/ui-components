import { fixture, html, expect } from '@open-wc/testing';
import sinon from 'sinon';
import type { ReactiveControllerHost } from 'lit';
import { ToujouThirdPartyTemplateController } from '../src/toujou-third-party-content/toujou-third-party-template-controller';
// We import the module to stub the class within it
import { TemplateRenderer } from '../src/utils/TemplateRenderer';

describe('ToujouThirdPartyTemplateController', () => {
  let host: ReactiveControllerHost;
  let renderIntoSpy: sinon.SinonSpy;
  let templateRendererConstructorSpy: { new(templateElement: HTMLTemplateElement): TemplateRenderer } & sinon.SinonSpy ;

  beforeEach(() => {
    // Mock the host component that the controller attaches to
    host = {
      addController: sinon.spy(),
      removeController: sinon.spy(),
      requestUpdate: sinon.spy(),
      updateComplete: sinon.promise()
    };

    renderIntoSpy = sinon.spy((range: Range) => {
      // Simulate rendering by inserting a simple node
      range.insertNode(document.createTextNode('Mock Rendered Content'));
    });

    // TODO figure out how to type this propery so ts-ignore is not necessary
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    templateRendererConstructorSpy = sinon.spy((...args: [HTMLTemplateElement]) =>
      new (class extends TemplateRenderer {
        renderInto(range: Range) {
          renderIntoSpy(range);
        }
      })(...args)
    );
  });

  afterEach(() => {
    // Restore all stubs and spies after each test
    sinon.restore();
  });

  // Test Suite for the constructor and initialization
  describe('Initialization', () => {
    it('should add itself to the host on construction', () => {
      new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);
      expect((host.addController as sinon.SinonSpy).calledOnce).to.be.true;
    });
  });

  // Test Suite for the core rendering logic
  describe('onConsentsChanged', () => {
    it('should do nothing if consent is not an object', async () => {
      await fixture(html`
        <template data-toujou-third-party-content data-content-type="video"></template>
      `);
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);
      controller.onConsentsChanged({ video: false });
      expect(templateRendererConstructorSpy.called).to.be.false;
    });

    it('should do nothing if consentGiven is false', async () => {
      await fixture(html`
        <template data-toujou-third-party-content data-content-type="video"></template>
      `);
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);
      controller.onConsentsChanged({
        video: {
          consentGiven: false,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        }
      });
      expect(templateRendererConstructorSpy.called).to.be.false;
    });

    it('should render a matching template when consent is given', async () => {
      const container = await fixture(html`
        <div>
          <template data-toujou-third-party-content data-content-type="video">
            <span>Video</span>
          </template>
        </div>
      `);
      const originalTemplate = container.querySelector('template')!;
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);

      controller.onConsentsChanged({
        video: {
          consentGiven: true,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        }
      });

      // Verify TemplateRenderer was constructed with the correct template
      expect(templateRendererConstructorSpy.calledWith(originalTemplate)).to.be.true;
      // Verify the content was rendered
      expect(renderIntoSpy.calledOnce).to.be.true;
      // Verify the original template was removed
      expect(container.querySelector('template')).to.be.null;
      // Verify the mock content was inserted
      expect(container.textContent).to.include('Mock Rendered Content');
    });

    it('should render multiple templates for the same content type', async () => {
      await fixture(html`
        <template data-toujou-third-party-content data-content-type="tracking"></template>
        <p>Some text</p>
        <template data-toujou-third-party-content data-content-type="tracking"></template>
      `);
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);
      controller.onConsentsChanged({
        tracking: {
          consentGiven: true,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        }
      });

      expect(templateRendererConstructorSpy.callCount).to.equal(2);
      expect(renderIntoSpy.callCount).to.equal(2);
    });

    it('should only render templates for consented types', async () => {
      const container = await fixture(html`
        <div>
          <template data-toujou-third-party-content data-content-type="video"></template>
          <template data-toujou-third-party-content data-content-type="tracking"></template>
        </div>
      `);
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy);
      controller.onConsentsChanged({
        video: {
          consentGiven: true,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        },
        tracking: {
          consentGiven: false,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        }, // Consent not given for tracking
      });

      // Should only be called once for the 'video' template
      expect(templateRendererConstructorSpy.calledOnce).to.be.true;
      // The tracking template should remain untouched
      expect(container.querySelector('[data-content-type="tracking"]')).to.not.be.null;
    });

    it('should use a custom selector if one is provided', async () => {
      const container = await fixture(html`
        <div>
          <template data-custom-selector data-content-type="maps"></template>
          <template data-toujou-third-party-content data-content-type="maps"></template>
        </div>
      `);
      // Initialize with a custom selector
      const customSelector = 'template[data-custom-selector]';
      const controller = new ToujouThirdPartyTemplateController(host, templateRendererConstructorSpy, customSelector);

      controller.onConsentsChanged({
        maps: {
          consentGiven: true,
          consentCreationDate: 0,
          consentExpirationDate: 0,
          consentLifetime: 0,
          consentBoxDismissed: true
        }
      });

      // Should only render the template with the custom selector
      expect(templateRendererConstructorSpy.calledOnce).to.be.true;
      expect(container.querySelector('[data-custom-selector]')).to.be.null;
      // The default template should remain untouched
      expect(container.querySelector('[data-toujou-third-party-content]')).to.not.be.null;
    });
  });
});
