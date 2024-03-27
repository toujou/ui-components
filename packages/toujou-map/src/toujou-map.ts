import { LitElement, html } from 'lit';
import maplibregl from 'maplibre-gl';
import styles from './toujou-map.css';
import { isMapboxURL, transformMapboxUrl } from 'maplibregl-mapbox-request-transformer';
import { updateLabelLanguageCoalesce, getLegacyTransformOptions } from './utils/style-helper';

export class ToujouMap extends LitElement {
  public accessToken = null; // Mapbox access token
  public initialMapOptions: maplibregl.MapOptions|any = {
    style: 'mapbox://styles/mapbox/light-v10',
    minZoom: 0,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
    attributionControl: false,

  };
  public initialControls = {
    noNavigation: false,
  };
  public loaded: boolean;
  public targets = [];
  public markers = [];
  public zoomOnScroll = false;
  public mapPadding = {
    top: 16, bottom: 16, left: 16, right: 16,
  };
  public fullscreenControl = false;
  public reducedMotion = false;
  public layers = [];
  public map: maplibregl.Map;

  public initialBounds: any;
  public fitBoundsMaxZoom: any;
  protected _navigationControl: maplibregl.NavigationControl;

  static get is() { return 'toujou-map'; }

  static get styles() { return styles; }

  render() {
    return html`
      <div id="map"></div>
      <slot @toujou-map-element-attached="${this.updateMapElements}"
            @toujou-map-layer-added="${this.onLayerAdded}"
            @toujou-map-layer-removed="${this.onLayerRemoved}"
            @slotchange="${this.updateMapElements}"></slot>
    `;
  }

  static get properties() {
    return {
      mapboxStyles: {
        type: String,
      },

      interactive: {
        type: Boolean,
      },

      fullscreenControl: {
        type: Boolean,
        attribute: 'fullscreen-control',
      },

      reducedMotion: {
        type: Boolean,
        attribute: 'reduced-motion',
      },

      /** Does nothing */
      noNavigation: {
        type: Boolean,
        attribute: 'no-navigation',
      },

      accessToken: {
        type: String,
        attribute: 'access-token',
      },

      center: {
        type: Array,
      },

      zoom: {
        type: Number,
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

      pitch: {
        type: Number,
      },

      bearing: {
        type: Number,
      },

      mapStyle: {
        type: String,
        attribute: 'map-style',
      },

      loaded: {
        type: Boolean,
      },

      zoomOnScroll: {
        type: Boolean,
        attribute: 'zoom-on-scroll',
      },

      initialBounds: {
        type: Array,
        attribute: 'initial-bounds',
      },

      mapPadding: {
        type: Object,
        attribute: 'map-padding',
      },

      layers: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.reorderLayers = this.reorderLayers.bind(this);
  }

  set mapStyle(mapStyle) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setStyle(mapStyle, getLegacyTransformOptions);
    this.initialMapOptions.style = mapStyle;
  }

  get mapStyle() {
    return this.map ? this.map.getStyle() : this.initialMapOptions.style;
  }

  set center(lngLatLike) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setCenter(lngLatLike);
    this.initialMapOptions.center = lngLatLike;
  }

  get center() {
    return this.map ? this.map.getCenter() : this.initialMapOptions.center;
  }

  set zoom(zoom) {
    this.map && this.map.setZoom(zoom);
    this.initialMapOptions.zoom = zoom;
  }

  get zoom() {
    return this.map ? this.map.getZoom() : this.initialMapOptions.zoom;
  }

  set pitch(pitch) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setPitch(pitch);
    this.initialMapOptions.pitch = pitch;
  }

  get pitch() {
    return this.map ? this.map.getPitch() : this.initialMapOptions.pitch;
  }

  set bearing(bearing) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setBearing(bearing);
    this.initialMapOptions.bearing = bearing;
  }

  get bearing() {
    return this.map ? this.map.getBearing() : this.initialMapOptions.bearing;
  }

  // eslint-disable-next-line consistent-return
  set noNavigation(noNavigation) {
    if (!this.map) {
      this.initialControls = { ...this.initialControls, noNavigation: !!noNavigation };
    }
    if (!noNavigation) {
      // eslint-disable-next-line no-unused-expressions
      !this._navigationControl && (this._navigationControl = new maplibregl.NavigationControl());
      this.map.addControl(this._navigationControl);
    } else if (noNavigation && this._navigationControl) {
      this.map.removeControl(this._navigationControl);
    }
  }

  get noNavigation() {
    if (!this.map) {
      return this.initialControls.noNavigation;
    }
    return !!this._navigationControl;
  }

  set interactive(interactive) {
    this.initialMapOptions.interactive = !!interactive;
  }

  get interactive() {
    return this.initialMapOptions.interactive;
  }

  set maxZoom(maxZoom) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setMaxZoom(maxZoom);
    this.initialMapOptions.maxZoom = maxZoom;
  }

  get maxZoom() {
    return this.map ? this.map.getMaxZoom() : this.initialMapOptions.maxZoom;
  }

  set minZoom(minZoom) {
    // eslint-disable-next-line no-unused-expressions
    this.map && this.map.setMinZoom(minZoom);
    this.initialMapOptions.minZoom = minZoom;
  }

  get minZoom() {
    return this.map ? this.map.getMinZoom() : this.initialMapOptions.minZoom;
  }

  get stylesCompatibleWithMapboxLanguage() {
    return this.initialMapOptions
        && this.initialMapOptions.style
        && this.initialMapOptions.style.startsWith('mapbox://');
  }

  connectedCallback() {
    super.connectedCallback();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.maplibregl = maplibregl;
    this.loaded = true;
  }

  updated(changedProperties) {
    if (changedProperties.has('loaded') && this.loaded && !this.map) {
      this.createMap();
    }
    if (changedProperties.has('layers')) {
      this.reorderLayers();
    }
  }

  createMap() {
    const transformRequest = (url: string, resourceType: string) => {
      if (isMapboxURL(url)) {
        return transformMapboxUrl(url, resourceType, this.accessToken);
      }
      return { url };
    };


    this.map = new maplibregl.Map({
      container: this.shadowRoot.querySelector('#map'),
      ...this.initialMapOptions,
      style: null,
      transformRequest,
    });
    this.map.setStyle(this.initialMapOptions.style, getLegacyTransformOptions);

    if (this.fullscreenControl) {
      this.map.addControl(new maplibregl.FullscreenControl());
    }

    this.map.addControl(new maplibregl.AttributionControl({
      compact: true,
    }));

    Object.keys(this.initialControls).forEach((controlName) => {
      this[controlName] = this.initialControls[controlName];
    });

    this.zoomOnScroll ? this.map.scrollZoom.enable() : this.map.scrollZoom.disable();
    this.map.setPadding(this.mapPadding);
    this.initialBounds && this.map.fitBounds(this.initialBounds, {
      maxZoom: this.fitBoundsMaxZoom || 22,
      animate: !this.reducedMotion,
    });

    this.map.on('load', (e) => {
      if (this.stylesCompatibleWithMapboxLanguage) {
        const language = document.documentElement.lang.slice(0, 2) || 'de';
        this.map.getStyle().layers
          .map(layer => layer.id)
          .filter(layerId => /label$/.test(layerId))
          .forEach((layerId) => {
            try {
              const currentLayoutProperty = this.map.getLayoutProperty(layerId, 'text-field');
              this.map.setLayoutProperty(
                layerId,
                'text-field',
                updateLabelLanguageCoalesce(currentLayoutProperty, language)
              );

            } catch (e) {
              console.warn(e);
            }
          });
      }

      this.dispatchEvent(new CustomEvent('toujou-map-loaded', { detail: e }));
    });
    this.map.on('error', (e) => {
      this.dispatchEvent(new CustomEvent('toujou-map-error', { detail: e }));
      console.error(e);
    });
    // todo: find better way to resize the map when page loads
    this.map.once('load', () => this.map.resize());

    this.map.on('sourcedata', () => {
      this.dispatchEvent(new CustomEvent('toujou-map-source-data-loaded', { bubbles: true, composed: true }));
    });

    this.updateMapElements();
    this.dispatchEvent(new CustomEvent('toujou-map-ready', { bubbles: true, composed: true, detail: this.map }));
  }

  updateMapElements() {
    const nodes = this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true });
    const mapElements = nodes.filter((n) => n.nodeName.slice(0, 10) === 'TOUJOU-MAP');
    this.markers = mapElements.filter((n) => n.nodeName === 'TOUJOU-MAP-MARKER');

    if (this.map) {
      // eslint-disable-next-line no-param-reassign
      mapElements.forEach((n) => { (n as any).map = this.map; });
    }
  }

  onLayerAdded(event) {
    this.layers = this.layers.concat([event.detail]);
  }

  onLayerRemoved(event) {
    this.layers = this.layers.filter((layerConf) => layerConf.id !== event.detail.id);
  }

  reorderLayers() {
    this.layers.forEach((layerConf) => {
      if (layerConf.id
          && layerConf.metadata
          && layerConf.metadata.beforeLayerId
          && this.map.getLayer(layerConf.metadata.beforeLayerId)
      ) {
        this.map.moveLayer(layerConf.id, layerConf.metadata.beforeLayerId);
      }
    });
  }
}

customElements.define(ToujouMap.is, ToujouMap);
