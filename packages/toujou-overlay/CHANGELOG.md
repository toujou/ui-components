# Change Log

All notable changes to the `@toujou/toujou-overlay` package will be documented in this file

## [1.0.0]
- 🌱 Initial release


## [3.8.0]
- Added new `storage-mode` attribute to configure overlay persistence (session or localStorage). Default: session
  - session → stored in a session cookie (cleared when the browser is closed).
  - localStorage → stored in localStorage (persists across sessions).
