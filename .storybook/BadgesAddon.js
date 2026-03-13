import React from 'react';
import { addons, types, useStorybookApi } from 'storybook/manager-api';

/**
 * Storybook manager addon that displays the toujou themes a component is used
 * in as colored badge pills in the Storybook toolbar.
 *
 * Themes are defined per component via the `toujouThemes` parameter:
 * @example
 * export default {
 *   title: 'Components/Button',
 *   component: Button,
 *   parameters: {
 *     toujouThemes: ['theme-medatsu', 'theme-kojo'],
 *   },
 * };
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
    match: ({ tabId, viewMode }) => !tabId && viewMode === 'story',

    /**
     * Renders the theme badges in the toolbar.
     * Returns null if the current story has no `toujouThemes` parameter defined.
     *
     * @returns {React.Element|null} A row of badge elements, or null if no themes are defined
     */
    render: () => {
      const api = useStorybookApi();
      const storyData = api.getCurrentStoryData();

      /** @type {string[]} List of theme names defined on the current story */
      const toujouThemes = storyData?.parameters?.toujouThemes || [];

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
                background: '#1a73e8',
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
