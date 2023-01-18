import { createSelector } from 'reselect';

const selectGeoJson = (state) => state.data.geojson;
const selectHighlightedFeature = (state) => state.features.highlightedFeature;
/**
 * @type {OutputSelector<unknown, unknown, (res: unknown) => unknown>}
 */
export const getGeoJsonWithHighlights = createSelector(
  selectGeoJson,
  selectHighlightedFeature,
  (geoJson, highlightedFeature) => {
    if (geoJson && Object.prototype.hasOwnProperty.call(geoJson, 'features')) {
      return {
        ...geoJson,
        features: geoJson.features.map((feature) => ({
          type: feature.type,
          geometry: feature.geometry,
          properties: {
            ...feature.properties,
            isHighlighted: highlightedFeature === feature.properties.uid,
          },
        })),
      };
    }
    return geoJson;
  },
);
