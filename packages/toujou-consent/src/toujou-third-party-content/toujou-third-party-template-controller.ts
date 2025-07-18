import {TemplateRenderer} from '../utils/TemplateRenderer';
import {ReactiveController, ReactiveControllerHost} from 'lit';
import {ConsentSetting} from '../utils/ConsentSetting';

export class ToujouThirdPartyTemplateController implements ReactiveController {
  host: ReactiveControllerHost;

  private selector: string;

  private templateRenderer: { new(templateElement: HTMLTemplateElement): TemplateRenderer };

  constructor(host: ReactiveControllerHost, templateRenderer:{ new(templateElement: HTMLTemplateElement): TemplateRenderer } = TemplateRenderer, selector = 'template[data-toujou-third-party-content]') {
    (this.host = host).addController(this);
    this.selector = selector;
    this.templateRenderer = templateRenderer;
  }

  hostConnected() {
    return;
  }

  hostDisconnected() {
    return;
  }

  // TODO: refactor this to use the updated() callbacks to listen on consents change in toujou-consent-widget once this one is refactored to use the updated() callback
  onConsentsChanged(consents: { [key: string]: boolean | ConsentSetting }) {
    for (const [contentType, setting] of Object.entries(consents)) {
      if (typeof setting === 'object' && setting.consentGiven) {
        document.querySelectorAll(this.selector + '[data-content-type="' + contentType + '"]').forEach((templateElement: HTMLTemplateElement) => {
          const range = document.createRange();
          range.setStartAfter(templateElement);
          range.collapse(true);
          (new this.templateRenderer(templateElement)).renderInto(range);
          templateElement.remove();
        });
      }
    }
  }
}
