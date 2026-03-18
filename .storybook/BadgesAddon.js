import React from 'react';
import { addons, types, useParameter } from 'storybook/manager-api';

/**
 * Returns the background color for a given theme badge.
 *
 * @param {string} themeName - The name of the theme to get the color for
 * @returns {string} A CSS color string
 */
const getBadgeColor = (themeName) => {
  /** @type {string} Default color for themes not listed in the color map */
  const defaultColor = '#007ce8';

  /** @type {Record<string, string>} Map of custom colors for some theme options */
  const colorMap = {
    'deprecated': '#e80058',
  };

  return colorMap[themeName] ?? defaultColor;
};

/**
 * Storybook manager addon that displays the toujou themes a component is used
 * in as colored badge pills in the Storybook toolbar.
 *
 * Themes are defined per component via the `toujouThemes` parameter
 */
addons.register('theme-badges', () => {
  /**
   * Registers a custom toolbar item that reads the current story's
   * `toujouThemes` parameter and renders a badge for each theme.
   * Only visible in story view mode, not in docs or custom tabs.
   */
  addons.add('theme-badges/toolbar', {
    type: types.TOOL,
    title: 'Theme Badges',
    match: ({ tabId, viewMode }) => !tabId && (viewMode === 'story' || viewMode === 'docs'),


    /**
     * Renders the theme badges in the toolbar.
     * Returns null if the current story has no `toujouThemes` parameter defined.
     *
     * @returns {React.Element|null} A row of badge elements, or null if no themes are defined
     */
    render: () => {
      const toujouThemes = useParameter('toujouThemes', []);

      if (!toujouThemes.length) return null;

      return React.createElement(
        'div',
        { style: { display: 'flex', gap: '6px', alignItems: 'center', padding: '0 8px' } },
        toujouThemes.map(themeName =>
          /**
           * Individual theme badge element
           * @param {string} themeName - The name of the theme to display
           */
          React.createElement(
            'span',
            {
              key: themeName,
              style: {
                background: getBadgeColor(themeName),
                color: '#e8f0fe',
                borderRadius: '4px',
                padding: '3px 4px',
                fontSize: '11px',
                fontWeight: 600,
                lineHeight: '1',
              }
            },
            themeName
          )
        )
      );
    },
  });
});
