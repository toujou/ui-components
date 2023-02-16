import { areArraysEqual } from '../../utils/_utils.js';
import { setHasNoPagination, setHasPagination } from './_pagination.js';

export const SET_DATA_GEOJSON = 'SET_DATA_GEOJSON';
export const SET_DATA_TEASERS = 'SET_DATA_TEASERS';
export const SET_DATA_LOAD_START = 'SET_DATA_LOAD_START';
export const SET_DATA_LOAD_END = 'SET_DATA_LOAD_END';
export const SET_CURRENT_VISIBLE_FEATURES = 'SET_CURRENT_VISIBLE_FEATURES';

export const setDataGeojson = (geojson) => ({
  type: SET_DATA_GEOJSON,
  payload: geojson,
});

export const setDataTeasers = (teasers) => ({
  type: SET_DATA_TEASERS,
  payload: teasers,
});

export const setDataLoadStart = () => ({
  type: SET_DATA_LOAD_START,
});

export const setDataLoadEnd = () => ({
  type: SET_DATA_LOAD_END,
});

export const setCurrentVisibleFeatures = (featuresUids) => ({
  type: SET_CURRENT_VISIBLE_FEATURES,
  payload: featuresUids,
});

/**
 * Request geojson data from API
 *   - Request must be in format: /placesgeo.json?north=49.455684&south=48.123992&east=12.193966&west=10.084591
 *   - Optional filters can be used in format: /placesgeo.json?north=49.455684&south=48.123992&east=12.193966&west=10.084591&pages=5,10&&hmac=aaabbbcccdddxxx
 *   - Return the features contained in the bounds and allowed by filter
 *
 * @param endpoint
 * @returns {Promise<any>}
 */
const requestGeojsonData = async (endpoint) => fetch(endpoint).then((response) => response.json());

/**
 * @param {{properties: {name: string, search_boost: number}}} a
 * @param {{properties: {name: string, search_boost: number}}} b
 *
 * @return number
 */
const sortFeaturesBySearchBoostAndName = (a, b) => b.properties.search_boost - a.properties.search_boost || a.properties.name.localeCompare(b.properties.name);

/**
 * Request the teaser data for some (feature) uids
 *    - Request must be in format: placesteaser.html?ids=1,2,3,4
 *    - Returns a string with the ready html for the teasers
 *
 * @param newGeojson
 * @param teasersEndpoint
 * @returns {Promise<string|null>}
 */
const requestTeasersData = async (visibleFeatures, teasersEndpoint, offsets) => {
  if (!visibleFeatures.length) return null;

  const ids = visibleFeatures
    .filter((feature) => feature.properties.search_boost || feature.properties.name)
    .sort(sortFeaturesBySearchBoostAndName)
    .splice(offsets.offset, offsets.limit)
    .map((feature) => feature.properties.uid);

  const urlSearchParams = new URLSearchParams({
    ids: ids.join(','),
  });

  const url = teasersEndpoint + (teasersEndpoint.match(/[?]/g) ? '&' : '?') + urlSearchParams.toString();

  return fetch(url).then((response) => response.text());
};

/**
 * Get visible features on the map.
 * It can happen that we have some geojson features that are not visible, so we need to check
 *
 * @param newGeojson
 * @param map
 * @returns {[]}
 */
const getVisibleFeatures = (newGeojson, map, layerIds) => {
  const layersToCheck = [];
  let newVisibleFeatures = [];

  layerIds.forEach((layerName) => {
    if (map && map.getLayer(layerName)) {
      layersToCheck.push(layerName);
    }
  });

  if (layersToCheck.length) {
    newVisibleFeatures = map.queryRenderedFeatures({
      layers: layersToCheck,
    });
  }

  return newVisibleFeatures;
};

/**
 * Create offset object for the request, depending on the current page and the defined number of teasers per page
 *
 * @param currentPage
 * @param maxTeasersPerPage
 * @returns {{offset: number, limit}}
 */
const createOffsets = (currentPage, maxTeasersPerPage) => ({
  offset: (currentPage - 1) * maxTeasersPerPage,
  limit: maxTeasersPerPage,
});

const getClusterLeaves = (clusterSource, clusterId, limit, offset) => new Promise((resolve, reject) => {
  clusterSource.getClusterLeaves(clusterId, limit, offset, (err, features) => {
    if (err) reject(err);
    else resolve(features);
  });
});

/**
 * Get data for the map:
 *   - Get geojson data for the features
 *   - Wait for the map to finish loading
 *   - Check is new visible feature
 *       - Load teasers for new visible teasers
 *
 * @param featuresEndpoint
 * @param teasersEndpoint
 * @returns {function(*): Promise<void>}
 */
export const getMapData = (featuresEndpoint, teasersEndpoint, map, layerIds, currentVisibleFeaturesUids, maxTeasersPerPage) => async (dispatch, getState) => {
  const { currentPage } = getState().pagination;

  dispatch(setDataLoadStart());
  try {
    const newGeojson = await requestGeojsonData(featuresEndpoint);
    dispatch(setDataGeojson(newGeojson));

    map.once('idle', async () => {
      dispatch(setDataLoadStart());
      const visibleFeatures = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const feature of getVisibleFeatures(newGeojson, map, layerIds)) {
        if (Object.prototype.hasOwnProperty.call(feature.properties, 'cluster_id')) {
          const clusterSource = map.getSource(feature.source);
          // eslint-disable-next-line no-await-in-loop
          const subFeatures = await getClusterLeaves(clusterSource, feature.properties.cluster_id, feature.properties.point_count, 0) as any[];
          visibleFeatures.push(...subFeatures);
        } else {
          visibleFeatures.push(feature);
        }
      }
      const visibleFeaturesUids = visibleFeatures.map((feature) => feature.properties.uid);

      dispatch(visibleFeaturesUids.length > maxTeasersPerPage ? setHasPagination() : setHasNoPagination());
      dispatch(setCurrentVisibleFeatures(visibleFeaturesUids));

      if (!areArraysEqual(currentVisibleFeaturesUids, visibleFeaturesUids)) {
        const offsets = createOffsets(currentPage, maxTeasersPerPage);
        const newTeasersData = await requestTeasersData(visibleFeatures, teasersEndpoint, offsets);
        dispatch(setDataTeasers(newTeasersData));
        dispatch(setCurrentVisibleFeatures(visibleFeaturesUids.sort()));
      }
      dispatch(setDataLoadEnd());
    });
  } catch (error) {
    console.error('Could not load the location finder geoJSON', error);
  }
  dispatch(setDataLoadEnd());
};
