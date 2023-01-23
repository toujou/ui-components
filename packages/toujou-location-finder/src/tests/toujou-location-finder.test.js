import { expect, fixture, html } from '@open-wc/testing';

import '../toujou-location-finder.js';

describe('toujou-location-finder basics', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`
        <toujou-location-finder access-token="xo""></toujou-location-finder>`);
  });

  it('can create component', async () => {
    expect(element).to.not.be.null;
    expect(element).to.not.be.undefined;
    expect(element.nodeName).to.equal('TOUJOU-LOCATION-FINDER');
  });

  it('has mapbox access token', async () => {
    const accessToken = element.accessToken;
    expect(accessToken).to.be.eq('xo');
  });

  it('has mobile map padding definition', async () => {
    const mobileMapPadding = element._mapPaddingMobile;
    expect(mobileMapPadding).to.not.be.null;
    expect(mobileMapPadding).to.not.be.undefined;
    expect(typeof mobileMapPadding).to.equal('object');
    expect(mobileMapPadding.top).to.not.be.undefined;
    expect(typeof mobileMapPadding.top).to.equal('number');
    expect(mobileMapPadding.bottom).to.not.be.undefined;
    expect(typeof mobileMapPadding.bottom).to.equal('number');
    expect(mobileMapPadding.left).to.not.be.undefined;
    expect(typeof mobileMapPadding.left).to.equal('number');
    expect(mobileMapPadding.right).to.not.be.undefined;
    expect(typeof mobileMapPadding.right).to.equal('number');
  });

  it('has desktop map padding definition', async () => {
    const desktopMapPadding = element._mapPaddingDesktop;
    expect(desktopMapPadding).to.not.be.null;
    expect(desktopMapPadding).to.not.be.undefined;
    expect(typeof desktopMapPadding).to.equal('object');
    expect(desktopMapPadding.top).to.not.be.undefined;
    expect(typeof desktopMapPadding.top).to.equal('number');
    expect(desktopMapPadding.bottom).to.not.be.undefined;
    expect(typeof desktopMapPadding.bottom).to.equal('number');
    expect(desktopMapPadding.left).to.not.be.undefined;
    expect(typeof desktopMapPadding.left).to.equal('number');
    expect(desktopMapPadding.right).to.not.be.undefined;
    expect(typeof desktopMapPadding.right).to.equal('number');
  });

  it('checks if device can hover', async () => {
    const canHoverBool = element._deviceCanHover;
    expect(canHoverBool).to.not.be.null;
    expect(canHoverBool).to.not.be.undefined;
    expect(typeof canHoverBool).to.equal('boolean');
  });

  it('checks for css variables', async () => {
    const customProperties = [
      '_mapPointColor',
      '_mapPointColorHover',
      '_mapPolygonColor',
      '_mapPolygonColorHover',
      '_mapLineColor',
      '_mapLineColorHover',
      '_breakpoint'
    ];
    customProperties.forEach((property) => {
      expect(property).to.not.be.null;
      expect(property).to.not.be.undefined;
      expect(typeof property).to.equal("string");
    });
  });
});

describe('toujou-location-finder has all needed components', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`<toujou-location-finder></toujou-location-finder>`);
  });

  it('has loading-bar element', () => {
    const loadingBar = element.shadowRoot.querySelector('.loading-bar');
    expect(loadingBar).to.be.not.null;
    expect(loadingBar).to.not.be.undefined;
  });

  it('has geocoder search element', () => {
    const searchElement = element.shadowRoot.querySelector('.search');
    expect(searchElement).to.be.not.null;
    expect(searchElement).to.not.be.undefined;
  });

  it('has toujou-map component', () => {
    const mapElement = element.shadowRoot.querySelector('.location-finder__map');
    expect(mapElement).to.be.not.null;
    expect(mapElement).to.not.be.undefined;
    expect(mapElement.nodeName).to.equal('TOUJOU-MAP');
  });

  it('has locator button', () => {
    const locatorButton = element.shadowRoot.querySelector('.sidebar__ui-button--locator');
    expect(locatorButton).to.be.not.null;
    expect(locatorButton).to.not.be.undefined;
    expect(locatorButton.nodeName).to.equal('BUTTON');
  });

  it('has sidebar panel', () => {
    const sidebarPanel = element.shadowRoot.querySelector('.sidebar__panel');
    expect(sidebarPanel).to.be.not.null;
    expect(sidebarPanel).to.not.be.undefined;
  });
});

describe('toujou-location-finder store', () => {
  let element = null;
  beforeEach(async () => {
    element = await fixture(html`
        <toujou-location-finder></toujou-location-finder>`);
  });

  it('has store', () => {
    const store = element.store;
    expect(store).to.be.not.null;
    expect(store).to.not.be.undefined;
    expect(typeof store).to.equal('object');
    expect(store.subscribe).to.be.not.null;
    expect(store.subscribe).to.be.not.undefined;
  });

  it('has state', () => {
    const state = element._state;
    expect(state).to.be.not.null;
    expect(state).to.not.be.undefined;
    expect(typeof state).to.equal('object');
    expect(state.data).to.be.not.null;
    expect(state.data).to.be.not.undefined;
    expect(state.features).to.be.not.null;
    expect(state.features).to.be.not.undefined;
    expect(state.locator).to.be.not.null;
    expect(state.locator).to.be.not.undefined;
    expect(state.pagination).to.be.not.null;
    expect(state.pagination).to.be.not.undefined;
    expect(state.popup).to.be.not.null;
    expect(state.popup).to.be.not.undefined;
    expect(state.search).to.be.not.null;
    expect(state.search).to.be.not.undefined;
  });
})

describe('toujou-location-finder attributes', () => {
  it('accepts bounds attribute', async () => {
    const testBounds = "[[5.148824, 46.437102], [14.91567, 52.065327]]";
    const elementWithBounds = await fixture(html`<toujou-location-finder bounds="${testBounds}"></toujou-location-finder>`);
    expect(elementWithBounds.bounds).to.not.be.null;
    expect(elementWithBounds.bounds).to.not.be.undefined;
    expect(typeof elementWithBounds.bounds).to.equal('object');
    expect(Array.isArray(elementWithBounds.bounds)).to.be.true;
  });

  it('accepts teaserURL attribute', async () => {
    const teaserURL = "/placesteaser.html?details=name%2Cdescription";
    const elementWithTeaserURL = await fixture(html`<toujou-location-finder teaserUrl="${teaserURL}"></toujou-location-finder>`);
    expect(elementWithTeaserURL.teaserUrl).to.not.be.null;
    expect(elementWithTeaserURL.teaserUrl).to.not.be.undefined;
    expect(elementWithTeaserURL.teaserUrl).to.equal(teaserURL);
  });

  it('accepts geoJsonUrl attribute', async () => {
    const geoJsonURL = "/placesgeo.json";
    const elementWithGeojsonURL = await fixture(html`<toujou-location-finder geoJsonUrl="${geoJsonURL}"></toujou-location-finder>`);
    expect(elementWithGeojsonURL.geoJsonUrl).to.not.be.null;
    expect(elementWithGeojsonURL.geoJsonUrl).to.not.be.undefined;
    expect(elementWithGeojsonURL.geoJsonUrl).to.equal(geoJsonURL);
  });

  //  todo: Add test to check if the "_geoJsonEndpointFull" is correct
})

describe('toujou-location-finder events', () => {
  // todo: Add test for the location finder events
});
