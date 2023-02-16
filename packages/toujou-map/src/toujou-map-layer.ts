import { UpdatingElement } from 'lit';
import mapboxgl from 'mapbox-gl';

class ToujouMapLayer extends UpdatingElement {
  
  public layerId: string;
  public source: string;
  public type: string;
  public minZoom = 0;
  public maxZoom = 24;
  public beforeLayerId: string;
  public filter: any[];
  public layout: {};
  public paint: {};
  public layer: mapboxgl.AnyLayer;

  protected _map: mapboxgl.Map|any;
  static get is() { return 'toujou-map-layer'; }

  static get properties() {
    return {
      layerId: {
        type: String,
        attribute: 'layer-id',
      },
      source: {
        type: String,
      },
      sourceLayer: {
        type: String,
        attribute: 'source-layer',
      },
      type: {
        type: String,
      },
      minZoom: {
        type: Number,
        attribute: 'min-zoom',
      },
      maxZoom: {
        type: Number,
        attribute: 'max-zoom',
      },
      filter: {
        type: Array,
      },
      layout: {
        type: Object,
      },
      paint: {
        type: Object,
      },

      /**
       * The ID of an existing layer to insert the new layer before. When viewing the map, the id layer will appear beneath the beforeId layer.
       * If beforeId is omitted, the layer will be appended to the end of the layers array and appear above all other layers on the map.
       * TODO check layer addition order in case, beforeLayerId is omitted.
       */
      beforeLayerId: {
        type: String,
      },
    };
  }

  set map(map) {
    if (map !== this._map) {
      this._map && this.removeLayer();
      this._map = map;
      map && this.initLayer();
    }
  }

  get map() {
    return this._map;
  }

  get layerConf(): mapboxgl.Layer {
    const conf = {
      id: this.layerId,
      source: this.source,
      // "source-layer": this.sourceLayer,
      type: this.type,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      metadata: {
        beforeLayerId: this.beforeLayerId,
      },
    } as mapboxgl.Layer;

    this.filter && this.filter.length > 0 && (conf.filter = this.filter);
    this.layout && (conf.layout = this.layout);
    this.paint && (conf.paint = this.paint);

    return conf;
  }

  constructor() {
    super();

    this.initLayer = this.initLayer.bind(this);
    this.initWhenSourceIsAvailable = this.initWhenSourceIsAvailable.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(new CustomEvent('toujou-map-element-attached', { detail: this, bubbles: true, composed: true }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.map && this.removeLayer();
  }

  // eslint-disable-next-line consistent-return
  initLayer() {
    if (!this.map.style) {
      return this.map.once('load', this.initLayer);
    }

    if (!this.map.getSource(this.source)) {
      this.map.on('sourcedata', this.initWhenSourceIsAvailable);
      // eslint-disable-next-line consistent-return
      return;
    }

    this.map.addLayer(this.layerConf);
    this.dispatchEvent(new CustomEvent('toujou-map-layer-added', { detail: this.layerConf, bubbles: true, composed: true }));
    this.layer = this.map.getLayer(this.layerId);
  }

  initWhenSourceIsAvailable(event) {
    if (event.sourceId === this.source) {
      this.map.off('sourcedata', this.initWhenSourceIsAvailable);
      this.initLayer();
    }
  }

  removeLayer() {
    if (this.map.getLayer(this.layerId)) {
      this.dispatchEvent(new CustomEvent('toujou-map-layer-removed', { detail: this.layerConf, bubbles: true, composed: true }));
      this.map.removeLayer(this.layerId);
    }
  }
}

customElements.define(ToujouMapLayer.is, ToujouMapLayer);
