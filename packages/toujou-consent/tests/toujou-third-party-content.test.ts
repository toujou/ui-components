import {html, fixture, expect, oneEvent, waitUntil} from '@open-wc/testing';
import type { ToujouThirdPartyContent } from '../src/toujou-third-party-content/toujou-third-party-content';
import '../src/toujou-consent/toujou-consent';
import '../src/toujou-third-party-content/toujou-third-party-content';
import {configureStore} from '../src/toujou-consent-widget/store';
import {AnyAction, applyMiddleware, Store} from 'redux';

describe('ToujouThirdPartyContent - Initial Rendering', () => {

  it('should render placeholder content by default when consent is not given', async () => {
    const testStore = configureStore({ consents: { video: { consentGiven: false } } });
    const el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="video" isIntersecting .store="${testStore}">
        <div class="toujou-third-party-content__templated-content"></div>
        <div slot="placeholder"><p>Placeholder</p></div>
        <template><iframe src="..."></iframe></template>
      </toujou-third-party-content>
    `);

    const placeholder = el.querySelector<HTMLDivElement>('[slot="placeholder"]');
    const contentContainer = el.querySelector<HTMLDivElement>('.toujou-third-party-content__templated-content');

    expect(placeholder).to.exist;
    expect(contentContainer?.innerHTML).to.be.empty;
  });

  it('should render the actual content if consent is already given', async () => {
    const testStore = configureStore({ consents: { video: { consentGiven: true } } });
    const el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="video" isIntersecting .store="${testStore}">
        <template><iframe src="https://example.com"></iframe></template>
        <div class="toujou-third-party-content__templated-content"></div>
      </toujou-third-party-content>
    `);

    const iframe = el.querySelector<HTMLIFrameElement>('.toujou-third-party-content__templated-content iframe');

    expect(iframe).to.exist;
    expect(iframe?.src).to.equal('https://example.com/');
    expect(el.hasAttribute('showingcontent')).to.be.true;
  });

  it('should render the actual content if it is commented and if consent is already given', async () => {
    const testStore = configureStore({ consents: { video: { consentGiven: true } } });
    const el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="video" isIntersecting .store="${testStore}">
        <template>
          <!-- <iframe src="https://example.com"></iframe> -->
        </template>
        <div class="toujou-third-party-content__templated-content"></div>
      </toujou-third-party-content>
    `);
    await el.updateComplete;

    const iframe = el.querySelector<HTMLIFrameElement>('.toujou-third-party-content__templated-content iframe');

    expect(iframe).to.exist;
    expect(iframe?.src).to.equal('https://example.com/');
    expect(el.hasAttribute('showingcontent')).to.be.true;
  });
});

describe('ToujouThirdPartyContent - User Interactions', () => {
  let testStore: Store;
  let el: ToujouThirdPartyContent;
  let actions: AnyAction[];
  function logAction() {
    return next => action => {
      actions.push(action);
      return next(action);
    };
  }

  beforeEach(async () => {
    actions = [];
    testStore = configureStore({consents: {video: {consentGiven: false}}}, [applyMiddleware(logAction)]);
    el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="video" isIntersecting .store="${testStore}">
        <div class="toujou-third-party-content__templated-content"></div>
        <div slot="placeholder">
          <button class="button button--primary third-party-content__button" ttpc-showcontentonce>Show Once</button>
          <toujou-consent class="consent"
                          consentType="video"
                          consentLifetime="0"
                          listenTo="click"
                          listenOn=".consent__button"
                          snackbarMessage="video enabled!">
            <button class="button button--primary third-party-content__button consent__button" allowcontenttype>Always Allow</button>
          </toujou-consent>
        </div>
        <template><iframe src="..."></iframe></template>
      </toujou-third-party-content>
    `);
  });

  it('should show content temporarily when "show once" button is clicked', async () => {
    const showOnceButton = el.querySelector<HTMLButtonElement>('[ttpc-showcontentonce]');
    showOnceButton?.click();
    await el.updateComplete;

    const iframe = el.querySelector<HTMLIFrameElement>('.toujou-third-party-content__templated-content iframe');
    expect(iframe).to.exist;

    expect(actions.length).to.equal(1);
  });

  it('should dispatch a "saveSingleConsent" action when "always allow" button is clicked', async () => {
    const consentButton = el.querySelector<HTMLButtonElement>('.consent__button');
    consentButton?.click();
    await el.updateComplete;

    const iframe = el.querySelector<HTMLIFrameElement>('.toujou-third-party-content__templated-content iframe');
    expect(iframe).to.exist;

    expect(actions[1].payload.consentType).to.equal('video');
    expect(actions[1].payload.consentData.consentGiven).to.be.true;
  });

  it('should dispatch a "toujou-add-snackbar" event on consent click', async () => {
    const consentButton = el.querySelector<HTMLButtonElement>('.consent__button');
    setTimeout(() => consentButton?.click());

    const { detail } = await oneEvent(el, 'toujou-add-snackbar');

    expect(detail.message).to.equal('video enabled!');
    expect(detail.variant).to.equal('success');
  });

});

describe('ToujouThirdPartyContent - Script Rendering', () => {

  interface TestEl extends ToujouThirdPartyContent {
    scriptHasLoaded: boolean;
  }
  interface TestScript extends HTMLScriptElement {
    scriptHasRun: boolean;
  }

  it('a script should be executed if its rendered', async () => {
    const testStore = configureStore({ consents: { tracking: { consentGiven: true } } });
    const el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="tracking" isIntersecting .store="${testStore}">
        <template><!--
          <script>
            document.currentScript.scriptHasRun = true;
          </script>
        --></template>
        <div class="toujou-third-party-content__templated-content"></div>
      </toujou-third-party-content>
    `);
    await el.updateComplete;

    const script = el.querySelector<TestScript>('.toujou-third-party-content__templated-content script');

    expect(script).to.exist;
    expect(script.scriptHasRun).to.be.true;
    expect(el.hasAttribute('showingcontent')).to.be.true;
  });

  it('a script should be loaded if its rendered', async () => {
    const testStore = configureStore({ consents: { tracking: { consentGiven: true } } });
    const el = await fixture<ToujouThirdPartyContent>(html`
      <toujou-third-party-content contentType="tracking" isIntersecting .store="${testStore}">
        <template><!--
          <script
            src="data:text/javascript;base64,ZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndG91am91LXRoaXJkLXBhcnR5LWNvbnRlbnQnKS5zY3JpcHRIYXNMb2FkZWQgPSB0cnVlOw=="
            onload="this.scriptHasRun = true"></script>
        --></template>
        <div class="toujou-third-party-content__templated-content"></div>
      </toujou-third-party-content>
    `) as TestEl;
    await el.updateComplete;

    await waitUntil(() => el.scriptHasLoaded, 'Script has not loaded');

    const script = el.querySelector<TestScript>('.toujou-third-party-content__templated-content script');

    expect(script).to.exist;
    expect(script.scriptHasRun).to.be.true;
    expect(el.hasAttribute('showingcontent')).to.be.true;
    expect(el.scriptHasLoaded).to.be.true;
  });
});
