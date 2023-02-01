# ui-components

Mono repo with the web-components used across the toujou themes

## Requirements
npm v16.14.0

## Install dependencies
On the root folder run:
1. `nvm use`
2. `npm ci`
3. `npm run build`

## Create a new release
- `npm release` (need to log in to npm with `npm login`)

> The package will be published to npm at `https://www.npmjs.com/package/@toujou/{packageName}`

## Install package
If you want to install one of the packages on a project, run:
- `npm install @toujou/{packageName}`
- ex: `npm install @toujou/toujou-burger`

## Released Components
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

| Component                                                   | npmjs.com                                                                                                                                                  |
|-------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [toujou-burger](./packages/toujou-burger)                   | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-burger.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-burger)                   |
| [toujou-consent](./packages/toujou-consent)                 | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-consent.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-consent)                 |
| [toujou-location-finder](./packages/toujou-location-finder) | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-location-finder.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-location-finder) |
| [toujou-map](./packages/toujou-map)                         | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-map.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-map)                         |
| [toujou-spinner](./packages/toujou-spinner)                 | [![npm version](https://img.shields.io/npm/v/@toujou/toujou-spinner.svg?style=flat)](https://www.npmjs.com/package/@toujou/toujou-spinner)                 |
