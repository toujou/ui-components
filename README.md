# ui-components

Mono repo with toujou's webcomponents

## Requirements
npm v16.14.0

## Install dependencies
On the root folder run:
1. `nvm use`
2. `npm run install`

## Build
On the root folder run:
- `npm run build`

## Publish component
On the component folder (ex: `/ui-components/packages/toujou-burger`) run:
- `npm publish` (need to login to npm with `npm login`)

> The package will be published to npm at `https://www.npmjs.com/package/@toujou/{packageName}`

## Install package
If you want to install one of the package on a project, run:
- `npm install @toujou/{packageName}`
- ex: `npm install @toujou/toujou-burger`
