
export const getLegacyTransformOptions = {
  transformStyle: (previousStyle, nextStyle) => ({
    ...nextStyle,
    glyphs: nextStyle?.glyphs.includes('mapbox') ? nextStyle?.glyphs : 'https://www.toujou.com/_map/fonts/{fontstack}/{range}.pbf',
    projection: (nextStyle.projection?.type ? {type: nextStyle.projection.type} : {}),
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

export const updateLabelLanguageCoalesce = (currentProperty: any[], language: string): any[] => {
  if ('coalesce' === currentProperty[0]) {
    currentProperty.splice(1, 0, ['get', `name_${language}`]);
    return currentProperty;
  }

  return currentProperty;
};
