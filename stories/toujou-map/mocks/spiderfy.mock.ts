export const spiderfyGeoMock = {
  type: 'FeatureCollection',
  features: [
    // Group of overlapping points in Nuremberg
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.0762, 49.4579] },
      properties: { uid: 1, name: 'Location A' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.0763, 49.4580] },
      properties: { uid: 2, name: 'Location B' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.0761, 49.4578] },
      properties: { uid: 3, name: 'Location C' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.0764, 49.4581] },
      properties: { uid: 4, name: 'Location D' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.0760, 49.4577] },
      properties: { uid: 5, name: 'Location E' },
    },
    // A second separate cluster
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.1200, 49.4800] },
      properties: { uid: 6, name: 'Location F' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.1201, 49.4801] },
      properties: { uid: 7, name: 'Location G' },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [11.1202, 49.4802] },
      properties: { uid: 8, name: 'Location H' },
    },
  ],
};
