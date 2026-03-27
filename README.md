# ui-components

Monorepo containing the reusable **Toujou Web Components** used across Toujou themes and projects.
Each component is published as an individual npm package under the `@toujou` scope.
The repository also contains a **Storybook environment** used for development and documentation of the components.

## Requirements
npm v20.20.1

## Project Structure
```text
    .
    ├── .storybook/          # Storybook configuration (preview, manager, webpack/vite config)
    ├── etc/                 # Shared configuration and helper scripts (e.g. common.rollup.js)
    ├── packages/            # All Toujou web component packages
    │   ├── toujou-accordion/
    │   │   ├── src/         # Component source code
    │   │   └── tests/       # Unit tests for the component
    │   └── ...
    ├── patches/             # Patch files applied to dependencies (via patch-package)
    ├── scripts/             # Custom repository scripts (e.g. package scaffolding)
    ├── stories/             # Storybook stories and development helpers
    │   ├── globals/         # Shared Storybook css, js and utilities
    │   ├── toujou-accordion/
    │   │   └── toujou-accordion.stories.ts
    │   └── ...
    └── package.json
    └── README.md
    └── ...
```

## Install dependencies
On the root folder run:
1. `nvm use`
2. `npm ci`
3. `npm run build`

## Create a new release
- `npm run release` (need to log in to npm with `npm login`)

> The package will be published to npm at `https://www.npmjs.com/package/@toujou/{packageName}`

## Install package
If you want to install one of the packages on a project, run:
- `npm install @toujou/{packageName}`
- ex: `npm install @toujou/toujou-burger`

## Test packages
To run the tests, run:
- `npm run test`

We can also test a single package:
- `PACKAGE_NAME=toujou-accordion npm run test:single-package`

## Lint packages
To run the linter, run:
- `npm run lint`

We can also lint a single package:
- `PACKAGE_NAME=toujou-accordion npm run lint:single-package`

## Storybook
We use Storybook as a development environment to preview and prototype components in isolation.

> **Note:** The styles used in Storybook are based on the Kojo theme but intentionally differ from it. They are designed to make it easier to understand how the components work.

### Run Storybook
- `npm run storybook`

Storybook will be available at `http://localhost:6006` (see message in console)

### Build Storybook
- `npm run build-storybook`

The built output will be in the `storybook-static` folder.

## Released Components
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

| Component                                                                                       | npmjs.com                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [toujou-accordion](./packages/toujou-accordion)                                                 | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-accordion.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-accordion)                                                 |
| [toujou-breadcrumb](./packages/toujou-breadrumb)                                                | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-breadcrumb.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-breadcrumb)                                               |
| [toujou-burger](./packages/toujou-burger)                                                       | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-burger.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-burger)                                                       |
| [toujou-burger-button](./packages/toujou-burger-button)                                         | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-burger-button.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-burger-button)                                         |
| [toujou-button](./packages/toujou-button)                                                       | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-button.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-button)                                                       |
| [toujou-clamped-content](./packages/toujou-clamped-content)                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-clamped-content.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-clamped-content)                                     |
| [toujou-collection-load-more](./packages/toujou-collection-load-more)                           | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-collection-load-more.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-collection-load-more)                           |
| [toujou-consent](./packages/toujou-consent)                                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-consent.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-consent)                                                     |
| [toujou-contact-box](./packages/toujou-contact-box)                                             | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-contact-box.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-contact-box)                                             |
| [toujou-cookie-script-third-party-content](./packages/toujou-cookie-script-third-party-content) | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-cookie-script-third-party-content.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-cookie-script-third-party-content) |
| [toujou-counter](./packages/toujou-counter)                                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-counter.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-counter)                                                     |
| [toujou-datepicker](./packages/toujou-datepicker)                                               | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-datepicker.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-datepicker)                                               |
| [toujou-details](./packages/toujou-details)                                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-details.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-details)                                                     |
| [toujou-exit-warning](./packages/toujou-exit-warning)                                           | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-exit-warning.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-exit-warning)                                           |
| [toujou-estimated-reading-time](./packages/toujou-estimated-reading-time)                       | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-estimated-reading-time.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-estimated-reading-time)                       |
| [toujou-iframe-resizer](./packages/toujou-iframe-resizer)                                       | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-iframe-resizer.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-iframe-resizer)                                       |
| [toujou-inpage-nav](./packages/toujou-inpage-nav)                                               | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-inpage-nav.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-inpage-nav)                                               |
| [toujou-input-date-mask](./packages/toujou-input-date-mask)                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-input-date-mask.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-input-date-mask)                                     |
| [toujou-input-password-toggle](./packages/toujou-input-password-toggle)                         | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-input-password-toggle.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-input-password-toggle)                         |
| [toujou-lazy-render](./packages/toujou-lazy-render)                                             | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-lazy-render.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-lazy-render)                                             |
| [toujou-location-finder](./packages/toujou-location-finder)                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-location-finder.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-location-finder)                                     |
| [toujou-map](./packages/toujou-map)                                                             | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-map.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-map)                                                             |
| [toujou-media-info](./packages/toujou-media-info)                                               | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-media-info.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-media-info)                                               |
| [toujou-overlay](./packages/toujou-overlay)                                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-overlay.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-overlay)                                                     |
| [toujou-rating-stars](./packages/toujou-rating-stars)                                           | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-rating-stars.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-rating-stars)                                           |
| [toujou-read-more](./packages/toujou-read-more)                                                 | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-rating-stars.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-read-more)                                              |
| [toujou-snackbar](./packages/toujou-snackbar)                                                   | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-snackbar.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-snackbar)                                                   |
| [toujou-spinner](./packages/toujou-spinner)                                                     | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-spinner.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-spinner)                                                     |
| [toujou-timeline](./packages/toujou-timeline)                                                   | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-timeline.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-timeline)                                                   |
| [toujou-topbar](./packages/toujou-topbar)                                                       | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-topbar.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-topbar)                                                       |
| [toujou-topbutton](./packages/toujou-topbutton)                                                 | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-topbutton.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-topbutton)                                                 |

## Create new package/component (via cli)

    npm run generate
