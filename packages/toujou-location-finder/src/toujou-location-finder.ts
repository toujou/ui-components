import { LitElement, html } from 'lit';
import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import './toujou-location-finder-teaser';

import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './css/toujou-location-finder.css';
import teaserStyles from './css/toujou-location-finder-teaser.css';
import popupStyles from './css/_location-finder-popup.css';
import geocoderStyles from './css/_location-finder-geocoder.css';
import { locationFinderStore } from './store/locationFinderStore';
import { isLoading } from './store/selectors/global';

import {
  mouseEnterFeature,
  mouseLeaveFeature,
} from './store/actions/_features';
import { setLocatorLoadingStart, setLocatorLoadingEnd } from './store/actions/_locator';
import { getMapData } from './store/actions/_data';
import { setPrevPaginationPage, setNextPaginationPage, resetPagination } from './store/actions/_pagination';
import { setSearchLoadingStart, setSearchLoadingEnd } from './store/actions/_search';
import {
  getPopupFeature,
  resetPopupCoordinates,
  resetPopupFeature,
  setPopupCoordinates,
} from './store/actions/_popup';
import { getGeoJsonWithHighlights } from './store/selectors/data';
import { convertToLegacyColorString } from './utils/_utils';

export class ToujouLocationFinder extends LitElement {

  public geoJsonUrl = '';
  public filterParams = '';
  public teaserUrl = '';

  public hasPagination = false;
  public bounds = [];
  public accessToken = null;

  public reducedMotion = false;

  public store: any;

  public isLoading: any;
  public minZoom: any;
  public mapStyle: any;
  public maxZoom: any;
  public fitBoundsMaxZoom: any;

  protected _geoJsonData = null;
  protected _teasersData = null;
  protected _bounds: any = {};
  protected _popupFeature = null;
  protected _popupCoordinates = null;
  protected _maxTeasersPerPage = 20;
  protected _currentPage = 1;

  protected _locatorIsLoading = false;
  protected _mql = null;
  protected _mapPaddingMobile = {
    top: 16,
    bottom: 16,
    left: 16,
    right: 16,
  };
  protected _mapPaddingDesktop = {
    top: 16,
    bottom: 16,
    left: 352,
    right: 16,
  };
  protected _deviceCanHover: boolean;
  protected _layers = [];
  protected _state: any;
  protected _map: maplibregl.Map;

  private _clusterRadius: number;
  private _clusterMaxZoom: any;
  private _mapPolygonColor: any;
  private _mapPolygonColorHover: any;
  private _mapPointColor: any;
  private _mapPointColorHover: any;
  private _mapLineColor: any;
  private _mapLineColorHover: any;
  private _clusterBgColor: any;
  private _clusterBorderWidth: any;
  private _clusterBorderColor: any;
  private _clusterTextSize: any;
  private _clusterTextColor: any;

  private _currentlyVisibleFeaturesUids: any;
  private isMobile: any;
  private _geocoder: MaplibreGeocoder;
  private _breakpoint: any;
  private _hideMap: boolean;

  static get is() {
    return 'toujou-location-finder';
  }

  static get styles() {
    return [styles, teaserStyles, popupStyles, geocoderStyles];
  }

  static get properties() {
    return {
      isLoading: {
        type: Boolean,
        reflect: true,
      },
      reducedMotion: {
        type: Boolean,
        attribute: 'reduced-motion',
      },
      _geoJsonData: {
        type: Object,
      },
      _geoJsonPoints: {
        type: Object,
      },
      _geoJsonPolygons: {
        type: Object,
      },
      _geoJsonLines: {
        type: Object,
      },
      _map: {
        type: Object,
      },
      _teasersData: {
        type: String,
      },
      hasPagination: {
        type: Boolean,
        reflect: true,
      },
      _currentPage: {
        type: Number,
      },
      bounds: {
        type: Array,
      },
      geoJsonUrl: {
        type: String,
      },
      filterParams: {
        type: String,
      },
      teaserUrl: {
        type: String,
      },
      _popupFeature: {
        type: Object,
      },
      _popupCoordinates: {
        type: Array,
      },
      isMobile: {
        type: Boolean,
        reflect: true,
      },
      accessToken: {
        type: String,
        attribute: 'access-token',
      },
      mapStyle: {
        type: String,
        attribute: 'map-style',
      },
      maxZoom: {
        type: Number,
      },
      fitBoundsMaxZoom: {
        type: Number,
        attribute: 'fit-bounds-max-zoom',
      },
      minZoom: {
        type: Number,
      },
      _hideMap: {
        type: Boolean,
        attribute: 'map-is-hidden',
        reflect: true
      },
    };
  }

  /**
   * Create full address for the geojson request
   *
   * @returns {string}
   * @private
   */
  get _geoJsonEndpointFull() {
    this._bounds = this._map.getBounds();
    return `${this.geoJsonUrl}?north=${this._bounds._ne.lat}&south=${this._bounds._sw.lat}&east=${this._bounds._ne.lng}&west=${this._bounds._sw.lng}${this.filterParams}`;
  }

  render() {
    const hasLayersSlot = this.querySelectorAll('[slot="layers"]').length > 0;
    return html`
      <div class="loading-bar"></div>
      <toujou-map class="location-finder__map" @toujou-map-ready="${this._onToujouMapReady}"
                  .accessToken="${this.accessToken}" .mapStyle="${this.mapStyle}"
                  .minZoom="${this.minZoom}" .maxZoom="${this.maxZoom}" .fitBoundsMaxZoom="${this.fitBoundsMaxZoom}"
                  @toujou-map-layer-added="${this.onMapLayerAdded}"
                  @toujou-map-layer-removed="${this.onMapLayerRemoved}">
          ${hasLayersSlot ? html`<slot name="layers"></slot>` : this.renderLayers()}

          <toujou-map-geojson
            id="geoJsonSourcePolygons"
            ?cluster="${this._clusterRadius > 0}"
            .clusterRadius="${this._clusterRadius}"
            .clusterMaxZoom="${this._clusterMaxZoom}"
            .sourceData='${this._geoJsonData}'
            source-id="geoJsonData">
          </toujou-map-geojson>

          ${this._popupFeature && this._popupCoordinates ? html`
            <toujou-map-popup .coordinates="${this._popupCoordinates}">
                ${this._renderPopupContent()}
            </toujou-map-popup>
          ` : ''}
      </toujou-map>

      <div class="geocoder-container search"></div>
      <button class="sidebar__ui-button sidebar__ui-button--locator" @click="${this._onLocatorClick}" ?locatorIsLoading="${this._locatorIsLoading}"></button>

      <slot name="location-finder-map-toggle" @click="${this._handleMapToggleClick}"></slot>

      <div class="sidebar__panel">
        ${this._teasersData ? this._renderTeasers() : ''}
        ${this.hasPagination ? this._renderPagination() : ''}
      </div>
    `;
  }

  renderLayers() {
    const polygonPaintObject = {
      'fill-color': [
        'case', [
          '!=', ['get', 'isHighlighted'], true],
        this._mapPolygonColor,
        this._mapPolygonColorHover,
      ],
      'fill-opacity': 0.5,
    };

    const pointPaintObject = {
      'circle-color': [
        'case', [
          '!=', ['get', 'isHighlighted'], true],
        this._mapPointColor,
        this._mapPointColorHover,
      ],
      'circle-radius': 6,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
    };

    const linesPaintObject = {
      'line-color': [
        'case', [
          '!=', ['get', 'isHighlighted'], true],
        this._mapLineColor,
        this._mapLineColorHover,
      ],
      'line-opacity': 1,
      'line-width': 3,
    };

    return html`
        <!-- POLYGONS LAYER -->
        <toujou-map-layer
          layer-id="geoJson_polygons"
          source="geoJsonData"
          type="fill"
          .paint='${polygonPaintObject}'
          filter='["==", "$type", "Polygon"]'
        ></toujou-map-layer>

        <!-- POINTS LAYER -->
        <toujou-map-layer
          layer-id="geoJson_points"
          source="geoJsonData"
          type="circle"
          .paint='${pointPaintObject}'
          filter='["==", "$type", "Point"]'
        ></toujou-map-layer>

      <!-- LINES LAYER -->
      <toujou-map-layer
        layer-id="geoJson_lines"
        source="geoJsonData"
        type="line"
        layout='{
          "line-join": "round",
          "line-cap": "round"
        }'
        .paint='${linesPaintObject}'
        filter='["==", "$type", "LineString"]'
      ></toujou-map-layer>

      <toujou-map-layer
        layer-id="clusters"
        source="geoJsonData"
        type="circle"
        filter='["has", "point_count"]'
        paint='{
          "circle-radius": [ "step", ["get", "point_count"], 12, 3, 16, 5, 20, 10, 25, 25, 30 ],
          "circle-color": "${this._clusterBgColor}",
          "circle-stroke-width": ${this._clusterBorderWidth},
          "circle-stroke-color": "${this._clusterBorderColor}"
        }'
      ></toujou-map-layer>
      <toujou-map-layer
        layer-id="cluster-count"
        source="geoJsonData"
        type="symbol"
        filter='["has", "point_count"]'
        layout='{ "text-field": "{point_count_abbreviated}", "text-size": ${this._clusterTextSize} }'
        paint='{ "text-color": "${this._clusterTextColor}" }'
      ></toujou-map-layer>`;
  }

  constructor() {
    super();

    this.onStateChange = this.onStateChange.bind(this);
    this._onLocatorSuccess = this._onLocatorSuccess.bind(this);
    this._onLocatorError = this._onLocatorError.bind(this);
    this._onMapFeatureHoverEnter = this._onMapFeatureHoverEnter.bind(this);
    this._onMapFeatureHoverLeave = this._onMapFeatureHoverLeave.bind(this);
    this._onMapMoveEnd = this._onMapMoveEnd.bind(this);

    this.geoJsonUrl = '';
    this.filterParams = '';
    this.teaserUrl = '';
    this._geoJsonData = null;
    this._teasersData = null;
    this._bounds = {};
    this._popupFeature = null;
    this._popupCoordinates = null;
    this._maxTeasersPerPage = 20;
    this._currentPage = 1;
    this.hasPagination = false;
    this.bounds = [];
    this._locatorIsLoading = false;
    this.accessToken = null;
    this._mql = null;
    this._mapPaddingMobile = {
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
    };
    this._mapPaddingDesktop = {
      top: 16,
      bottom: 16,
      left: 352,
      right: 16,
    };
    this._deviceCanHover = window.matchMedia('(hover: hover)').matches;
    this._layers = [];

    this.store = locationFinderStore;
    this.store.subscribe(this.onStateChange);
    this._state = this.store.getState();
    this.reducedMotion = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('toujou-location-finder-teaser-mouse-enter', this._onMouseEnterTeaser);
    this.addEventListener('toujou-location-finder-teaser-mouse-leave', this._onMouseLeaveTeaser);

    this._getCustomProperties();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('toujou-location-finder-teaser-mouse-enter', this._onMouseEnterTeaser);
    this.removeEventListener('toujou-location-finder-teaser-mouse-leave', this._onMouseLeaveTeaser);
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (_changedProperties.has('_map')) {
      this._init();
    }

    if (_changedProperties.has('_currentPage') && this._map) {
      this._fetchData();
    }

    if (_changedProperties.has('filterParams') && this._map) {
      this._fetchData();
    }
  }

  /**
   * Update local store and element's data when store updates
   */
  onStateChange() {
    this._state = this.store.getState();
    this.isLoading = isLoading(this._state);
    this._geoJsonData = getGeoJsonWithHighlights(this._state);
    this._teasersData = this._state.data.teasers;
    this._currentlyVisibleFeaturesUids = this._state.data.currentlyVisibleFeatures;
    this.hasPagination = this._state.pagination.hasPagination;
    this._currentPage = this._state.pagination.currentPage;
    this._popupFeature = this._state.popup.feature;
    this._popupCoordinates = this._state.popup.coordinates;
    this._locatorIsLoading = this._state.locator.isLoading;
  }

  /**
   * Initialize the location finder element
   *     - Get current bounds
   *     - Get geoJson Data for current view
   *
   * @returns {Promise<void>}
   * @private
   */
  async _init() {
    if (!this._map) return;
    this._fetchData();
  }

  _setHighlightedFeatureID(featureID) {
    this.store.dispatch(mouseEnterFeature(featureID));
  }

  _resetHighlightedFeatureID() {
    this.store.dispatch(mouseLeaveFeature());
  }

  _setLocatorLoadingStatus(status) {
    this.store.dispatch(status ? setLocatorLoadingStart() : setLocatorLoadingEnd());
  }

  /**
   * We listen for a custom 'toujou-map-ready' event and then set the _map property and hover listeners
   *
   * @param event
   * @private
   */
  _onToujouMapReady(event) {
    this._map = event.detail;
    this._map.setPadding(this.isMobile ? this._mapPaddingMobile : this._mapPaddingDesktop);

    if (this.bounds) {
      this._map.fitBounds((this.bounds as maplibregl.LngLatBoundsLike), { animate: !this.reducedMotion });
    }

    this._initGeocoder();

    this._map.on('moveend', this._onMapMoveEnd);

    this.dispatchEvent(new CustomEvent('toujou-location-finder-ready', { bubbles: true, composed: true, detail: this }));
  }

  onMapLayerAdded(event) {
    const layerId = event.detail.id;
    this._layers.push(layerId);
    this._map.on('mouseover', layerId, this._onMapFeatureHoverEnter);
    this._map.on('mouseleave', layerId, this._onMapFeatureHoverLeave);
  }

  onMapLayerRemoved(event) {
    const layerId = event.detail.id;
    this._layers = this._layers.filter((existingLayerId) => existingLayerId !== layerId);
    this._map.off('mouseover', layerId, this._onMapFeatureHoverEnter);
    this._map.off('mouseleave', layerId, this._onMapFeatureHoverLeave);
  }

  /**
   * Dispatch action to set the correct highlighted feature id
   *
   * @param event
   * @private
   */
  _onMouseEnterTeaser(event) {
    this._setHighlightedFeatureID(+event.detail.featureUid);
  }

  /**
   * Dispatch action to reset the highlighted feature to null
   *
   * @private
   */
  _onMouseLeaveTeaser() {
    this._resetHighlightedFeatureID();
  }

  /**
   * Center the map on the user's location when the locator button is clicked
   * Clear search input and remove focus
   *
   * @private
   */
  _onLocatorClick() {
    this._setLocatorLoadingStatus(true);
    this._geocoder.clear();
    this._geocoder._inputEl.blur();
    if (!navigator.geolocation) {
      console.error('Cannot get your location because Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(this._onLocatorSuccess, this._onLocatorError);
    }
  }

  /**
   * Center the map on the user's position
   *
   * @param position
   * @private
   */
  _onLocatorSuccess(position) {
    const { latitude, longitude } = position.coords;
    this._map.flyTo({
      center: [longitude, latitude],
    });
    this._setLocatorLoadingStatus(false);
  }

  /**
   * Log error if the was a problem getting the user's location
   *
   * @param error
   * @private
   */
  _onLocatorError(error) {
    console.error('Could not get your location', error);
    this._setLocatorLoadingStatus(false);
  }

  /**
   * When we hover a map feature:
   *     - change cursor to pointer
   *     - set highlighted featured uid
   *
   * @param event
   * @private
   */
  _onMapFeatureHoverEnter(event) {
    if (this._deviceCanHover) {
      this._map.getCanvas().style.cursor = 'pointer';
      this._setHighlightedFeatureID(event.features[0].properties.uid);
      this._showPopup(event);
    }
  }

  /**
   * When we stop hovering a map feature:
   *     - change cursor to grab (default map cursor)
   *     - reset highlighted featured uid to null
   *
   * @param event
   * @private
   */
  _onMapFeatureHoverLeave() {
    if (this._deviceCanHover) {
      this._map.getCanvas().style.cursor = 'grab';
      this._resetHighlightedFeatureID();
      this.store.dispatch(resetPopupFeature());
      this.store.dispatch(resetPopupCoordinates());
    }
  }

  /**
   * When the map move stops we reset the pagination and get the new data for the visible area
   *
   * @private
   */
  _onMapMoveEnd() {
    this.store.dispatch(resetPagination());
    this._fetchData();
  }

  /**
   * Listen to click on the pagination prev and next buttons and set new current page accordingly
   *
   * @param event
   * @private
   */
  _onPaginationButtonClick(event) {
    const paginationAction = event.currentTarget.getAttribute('paginationAction');
    if (paginationAction === 'prev') {
      this.store.dispatch(setPrevPaginationPage());
    }
    if (paginationAction === 'next') {
      this.store.dispatch(setNextPaginationPage());
    }
  }

  /**
   * Show popup for a feature
   *    - If feature is of type point: anchor on middle of point
   *    - If feature of type polygon or line, anchor or current mouse position
   *
   * @param event
   * @private
   */
  _showPopup(event) {
    const featureType = event.features[0].geometry.type;
    const popupCoordinates = (featureType === 'Point')
      ? event.features[0].geometry.coordinates
      : event.lngLat;

    this.store.dispatch(getPopupFeature(event.features[0].properties.uid, this.teaserUrl));
    popupCoordinates && this.store.dispatch(setPopupCoordinates(popupCoordinates));
  }

  /**
   * Get values for css variables used on the map layer styles and highlighted states
   *
   * @private
   */
  _getCustomProperties() {
    const bodyStyles = window.getComputedStyle(document.body);
    this._mapPointColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-point-color'));
    this._mapPointColorHover = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-point-color-hover'));
    this._mapPolygonColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-polygon-color'));
    this._mapPolygonColorHover = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-polygon-color-hover'));
    this._mapLineColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-line-color'));
    this._mapLineColorHover = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-map-line-color-hover'));
    this._breakpoint = bodyStyles.getPropertyValue('--toujou-location-finder-breakpoint');

    this._clusterBgColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-cluster-background-color'));
    this._clusterBorderWidth = bodyStyles.getPropertyValue('--toujou-location-finder-cluster-border-width');
    this._clusterBorderColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-cluster-border-color'));
    this._clusterTextColor = convertToLegacyColorString(bodyStyles.getPropertyValue('--toujou-location-finder-cluster-text-color'));
    this._clusterTextSize = bodyStyles.getPropertyValue('--toujou-location-finder-cluster-text-size');
    this._clusterRadius = parseInt(bodyStyles.getPropertyValue('--toujou-location-finder-cluster-radius'), 10);
    this._clusterMaxZoom = bodyStyles.getPropertyValue('--toujou-location-finder-cluster-max-zoom');

    this._initMatchMedia();
  }

  /**
   * Fetch current data for the current visible area
   *
   * @private
   */
  _fetchData() {
    this.store.dispatch(getMapData(
      this._geoJsonEndpointFull,
      this.teaserUrl,
      this._map,
      this._layers,
      this._currentlyVisibleFeaturesUids,
      this._maxTeasersPerPage,
    ));
  }

  /**
   * Render the teasers data as html
   *
   * @returns {import("../directive.js").DirectiveResult<typeof UnsafeHTMLDirective>}
   * @private
   */
  _renderTeasers() {
    return html`
        <div class="teasers">
          ${unsafeHTML(this._teasersData)}
        </div>
    `;
  }

  /**
   * Render the pagination element
   *
   * @returns {TemplateResult<1>}
   * @private
   */
  _renderPagination() {
    return html`
      <div class="pagination">
        <button class="pagination__button pagination__button--prev"
                paginationAction="prev"
                @click="${this._onPaginationButtonClick}"
                ?disabled="${this._currentPage === 1}">

        </button>
        <div class="pagination__text">${(this._currentPage - 1) * this._maxTeasersPerPage + 1} - ${this._currentPage * this._maxTeasersPerPage}</div>
        <button class="pagination__button pagination__button--next"
                paginationAction="next"
                @click="${this._onPaginationButtonClick}"
                ?disabled="${this._currentlyVisibleFeaturesUids.length / this._currentPage <= this._maxTeasersPerPage}"></button>
      </div>
    `;
  }

  /**
   * Render content of the popup element
   *
   * @returns {TemplateResult<1>}
   * @private
   */
  _renderPopupContent() {
    return html`
        <div class="location-finder-popup">
          ${unsafeHTML(this._popupFeature)}
        </div>
    `;
  }

  /**
   * Initialize the mapbox geocoder element
   *
   * @private
   */
  _initGeocoder() {
    const geocoderApi = {
      forwardGeocode: async (config) => {
        let features = [];
        try {
          const request = `https://nominatim.openstreetmap.org/search?q=${
            config.query
          }&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();

          features = geojson.features.map((feature) => {
            const center = [
              feature.bbox[0]
              + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1]
              + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];

            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center,
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ['place'],
              center,
            };
          });
        } catch (e) {
          console.error(`Failed to forwardGeocode with error: ${e}`);
        }
        return {
          features,
        };
      },
    };

    this._geocoder = new MaplibreGeocoder(geocoderApi, {
      maplibregl,
      showResultsWhileTyping: true,
      showResultMarkers: false,
      marker: false,
    });

    this.shadowRoot.querySelector('.geocoder-container').appendChild(this._geocoder.onAdd(this._map));
    this._geocoder.on('loading', () => {
      this.store.dispatch(setSearchLoadingStart());
    });
    this._geocoder.on('results', () => {
      this.store.dispatch(setSearchLoadingEnd());
    });
  }

  /**
   * Create a custom icon element for the geocoder
   *
   * @returns {HTMLDivElement}
   * @private
   */
  _createCustomGeocoderIcon() {
    const icon = document.createElement('div');
    icon.className = 'geocoder__custom-icon';
    return icon;
  }

  /**
   * Watch the window size and set _isMobile property accordingly
   *
   * @private
   */
  _initMatchMedia() {
    this._mql = window.matchMedia(`(max-width: ${this._breakpoint})`);
    this.isMobile = this._mql.matches;
    // eslint-disable-next-line no-return-assign
    this._mql.addListener((mql) => {
      this.isMobile = mql.matches;
      this._updateMapPadding();
    });
  }

  _updateMapPadding() {
    this._map && this._map.setPadding(this.isMobile ? this._mapPaddingMobile : this._mapPaddingDesktop);
  }

  _handleMapToggleClick() {
    this._hideMap = !this._hideMap;
  }
}

customElements.define(ToujouLocationFinder.is, ToujouLocationFinder);
