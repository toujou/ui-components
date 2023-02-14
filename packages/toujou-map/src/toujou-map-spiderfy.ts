import { UpdatingElement } from 'lit';
import mapboxgl from 'mapbox-gl';

/**
 * Element to spiderfy overlapping markers in the map.
 *
 * @element toujou-map-spiderfy
 */
class ToujouMapSpiderfy extends UpdatingElement {
  static get is() { return 'toujou-map-spiderfy'; }

  static get properties() {
    return {
      sourceId: {
        type: String,
        attribute: 'source-id',
      },

      source: {
        type: String,
      },

      leavesSeparation: {
        type: Number,
      },

      leavesOffset: {
        type: Array,
      },

      minZoom: {
        type: Number,
      },

      zoomIncrement: {
        type: Number,
      },

      selectedCluster: {
        type: Object,
      },

      selectedClusterFeatures: {
        type: Array,
      },
    };
  }

  set map(map) {
    if (map !== this._map) {
      this._map && this.removeSource();
      this._map = map;
      if (map) {
        if (!this.map.isStyleLoaded()) {
          this.map.once('load', () => this.initSource());
        } else {
          this.initSource();
        }
      }
    }
  }

  get map() {
    return this._map;
  }

  constructor(props) {
    super(props);
    this._map = null;
    this.data = null;
    this.source = null;
    this.leavesSeparation = 50;
    this.leavesOffset = [0, 0];
    this.minZoom = 0;
    this.zoomIncrement = 2;
    this.selectedCluster = null;
    this.selectedClusterFeatures = [];
    this.handleClusterSelection = this.handleClusterSelection.bind(this);
    this.renderFeatures = this.renderFeatures.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchEvent(new CustomEvent('toujou-map-element-attached', { detail: this, bubbles: true, composed: true }));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.map && this.removeSource();
    this.selectedCluster = null;
    this.selectedClusterFeatures = [];
  }

  updated(changedProperties) {
    if (changedProperties.has('selectedClusterFeatures') && this.spiderfySource) {
      this.renderFeatures();
    }
  }

  /**
   * Initialize the geojson's source
   * the "this.data" property needs to be geojson data
   */
  // eslint-disable-next-line consistent-return
  initSource() {
    this.map.addSource(
      this.sourceId,
      {
        type: 'geojson',
        data: this.data,
      },
    );
    this.spiderfySource = this.map.getSource(this.sourceId);
    this.map.on('click', this.handleClusterSelection);
    this.map.on('zoomend', this.renderFeatures);
  }

  removeSource() {
    if (this.map.getSource(this.sourceId)) {
      this.map.removeSource(this.sourceId);
    }
  }

  handleClusterSelection(event) {
    const renderedFeatures = this.map.queryRenderedFeatures(event.point);
    const cluster = renderedFeatures.find((f) => f.properties && f.properties.cluster && f.source === this.source);
    const spiderfyFeature = renderedFeatures.find((f) => f.properties && !f.properties.cluster && f.source === this.sourceId);
    if (spiderfyFeature) {
      return;
    }
    if (!cluster) {
      this.selectedCluster = null;
      this.selectedClusterFeatures = [];
      return;
    }
    if (this.map.getZoom() < this.minZoom) {
      this.map.flyTo({
        center: event.lngLat,
        zoom: this.map.getZoom() + this.zoomIncrement,
      });
      return;
    }
    this.selectedCluster = cluster;
    this.map.getSource(this.source).getClusterLeaves(cluster.properties.cluster_id, 99, 0, (error, features) => {
      this.selectedClusterFeatures = (features || []).filter((feature) => feature.geometry.type === 'Point');
    });
  }

  renderFeatures() {
    const points = this.selectedClusterFeatures.length
      ? this.calculatePointsInCircle(this.selectedClusterFeatures.length)
      : [];
    const point = this.selectedCluster
      ? this.map.project(this.selectedCluster.geometry.coordinates)
      : null;
    const lines = [];
    const features = this.selectedClusterFeatures
      .map((feature, index) => {
        const newFeature = feature;
        const coordinates = this.map.unproject(point.add(points[index]));
        newFeature.geometry.coordinates = coordinates.toArray();
        lines.push({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              this.selectedCluster.geometry.coordinates,
              newFeature.geometry.coordinates,
            ],
          },
        });
        return newFeature;
      });
    this.spiderfySource.setData({ type: 'FeatureCollection', features: features.concat(lines) });
  }

  calculatePointsInCircle(totalPoints) {
    const points = [];
    const theta = (Math.PI * 2) / totalPoints;
    let angle = theta;

    for (let i = 0; i < totalPoints; i += 1) {
      angle = theta * i;
      const x = this.leavesSeparation * Math.cos(angle) + this.leavesOffset[0];
      const y = this.leavesSeparation * Math.sin(angle) + this.leavesOffset[1];
      points.push(new mapboxgl.Point(x, y));
    }
    return points;
  }
}

customElements.define(ToujouMapSpiderfy.is, ToujouMapSpiderfy);
