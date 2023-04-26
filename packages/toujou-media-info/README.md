# Toujou Media Info

Web Component for toggling media infos (copyright & description)

## Installation

      npm install @toujou/toujou-media-info

## Usage

```html
<toujou-media-info class="media-info">
    <button slot="open-button" class="media-info__toggle" aria-description="Toggle the image caption and / or copyright"></button>
    <button slot="close-button" class="media-info__toggle" aria-description="Toggle the image caption and / or copyright"></button>
    <figpaction slot="figcaption" class="media-info__figcaption">This is the image description in fileadmin</figpaction>
    <small slot="copyright" class="media-info__copyright">© Cool photographer</small>
</toujou-media-info>

```
