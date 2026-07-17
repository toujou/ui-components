# Toujou Poster Reveal

A lightweight "poster image" component that displays placeholder content (poster + trigger) until user interaction, then reveals the real content.

Typical use case: show a poster image for youtube iframes.

## Installation

      npm install @toujou/toujou-poster-reveal

## Features
- Lightweight placeholder pattern for heavy content
- Slot-based architecture (no Shadow DOM restrictions)
- Accessible activation via native button trigger
- Emits activation event for external integrations
- CSS controllable via CSS variables
- Framework-agnostic (works with Lit, plain HTML, CMS templates)

## Usage

```html
<toujou-poster-reveal>
    <img slot="poster" src="poster.jpg" alt="Video preview" />

    <button slot="trigger">Play video</button>

    <div slot="content">
        <iframe
            src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
            allow="autoplay; fullscreen"
            allowfullscreen
        ></iframe>
    </div>
</toujou-poster-reveal>
```

## Behavior

Initially, only poster + trigger are visible
On click:
- Poster is hidden
- Trigger is hidden
- Content is revealed
- Activated attribute is set

## Events

| Event name                    | Description                              |
|-------------------------------|------------------------------------------|
| toujou-poster-reveal-activate | Fired once when the element is activated |

## Events from the poster-reveal-video-player component
| Event name                                | Description                                                     |
|-------------------------------------------|-----------------------------------------------------------------|
| toujou-poster-reveal-video-play-requested | Fired once when the user clicks the play button                 |
| toujou-poster-reveal-video-playing        | Fired once when video stars playing                             |
| toujou-poster-reveal-video-error          | Fired once when there is an error white tying to play the video |

## Customization

The component exposes CSS variables for styling overrides:
```css
toujou-poster-reveal {
  --toujou-poster-reveal-display: block;
  --toujou-poster-reveal-position: relative;
}
```

## Notes
- The trigger should be a <button> for accessibility.
- The component does not control or initialize embedded content (e.g. YouTube/Vimeo autoplay).
