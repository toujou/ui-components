
export const getLegacyTransformOptions = {
  transformStyle: (previousStyle, nextStyle) => ({
    ...nextStyle,
    layers: [
      ...nextStyle.layers.map(layer => {
        try {
          if (!Object.prototype.hasOwnProperty.call(layer, 'filter')) {
            return layer;
          }

          const layerFilter = layer['filter'];
          if (Array.isArray(layerFilter[1]) &&  layerFilter[1][0] === 'pitch' ) {
            delete layer['filter'];
            return layer;
          }

          return {
            ...layer,
            filter: layer['filter'].filter(filter => !Array.isArray(filter[1]) || filter[1][0] !== 'pitch')
          };
        } catch(e) {
          return layer;
        }
      })
    ]
  })
};
