# Toujou Facade

A lightweight facade component that displays placeholder content (poster + trigger) until user interaction, then reveals the real content.

Typical use case: show a poster image for youtube iframes.

## Installation

      npm install @toujou/toujou-facade

## Features
- Lightweight placeholder pattern for heavy content
- Slot-based architecture (no Shadow DOM restrictions)
- Accessible activation via native button trigger
- Emits activation event for external integrations
- CSS controllable via CSS variables
- Framework-agnostic (works with Lit, plain HTML, CMS templates)

## Usage

```html
<toujou-facade>
    <img slot="poster" src="poster.jpg" alt="Video preview" />

    <button slot="trigger">Play video</button>

    <div slot="content">
        <iframe
            src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
            allow="autoplay; fullscreen"
            allowfullscreen
        ></iframe>
    </div>
</toujou-facade>
```

## Behavior

Initially, only poster + trigger are visible
On click:
- Poster is hidden
- Trigger is hidden
- Content is revealed
- Activated attribute is set

## Events

| Event name             | Description                             |
| ---------------------- | --------------------------------------- |
| toujou-facade-activate | Fired once when the facade is activated |

## Customization

The component exposes CSS variables for styling overrides:
```css
toujou-facade {
  --toujou-facade-display: block;
  --toujou-facade-position: relative;

  --toujou-facade-content-display: none;
  --toujou-facade-active-content-display: block;

  --toujou-facade-trigger-position: absolute;
  --toujou-facade-trigger-inset: 0;
  --toujou-facade-trigger-cursor: pointer;

  --toujou-facade-poster-display: block;
  --toujou-facade-trigger-display: none;
}
```

## Notes
- The trigger should be a <button> for accessibility.
- The component does not control or initialize embedded content (e.g. YouTube/Vimeo autoplay).
