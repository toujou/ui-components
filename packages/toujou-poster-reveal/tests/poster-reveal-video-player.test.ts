import {
  expect,
  fixture,
  html,
  oneEvent,
} from '@open-wc/testing';

import '../src/toujou-poster-reveal';
import '../src/poster-reveal-video-player';
import { ToujouPosterReveal } from '../src/toujou-poster-reveal';
import {
  TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT,
  TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT,
  TOUJOU_POSTER_REVEAL_VIDEO_ERROR_EVENT,
} from '../src/poster-reveal-video-player';

/**
 * Minimal fake of the YouTube IFrame Player API.
 * Resolves `onReady` asynchronously (via microtask) to mirror the real API's behavior,
 * and records method calls in order instead of relying on a spy library.
 */
class FakeYouTubePlayer {
  calls: string[] = [];

  constructor(
    _id: string,
    config: { events: { onReady: (event: { target: FakeYouTubePlayer }) => void } },
  ) {
    Promise.resolve().then(() => config.events.onReady({ target: this }));
  }

  mute() { this.calls.push('mute'); }
  setVolume(volume: number) { this.calls.push(`setVolume:${volume}`); }
  playVideo() { this.calls.push('playVideo'); }
  unMute() { this.calls.push('unMute'); }
}

/**
 * A fake player whose playback call throws, to exercise the error path.
 */
class FailingYouTubePlayer {
  constructor(
    _id: string,
    config: { events: { onReady: (event: { target: FailingYouTubePlayer }) => void } },
  ) {
    Promise.resolve().then(() => config.events.onReady({ target: this }));
  }

  mute() { throw new Error('Playback failed.'); }
  setVolume() { /* no-op for this test fake */ }
  playVideo() { /* no-op for this test fake */ }
  unMute() { /* no-op for this test fake */ }
}

describe('poster-reveal-video-player', () => {
  before(() => {
    // `loadYouTubeIframeApi()` caches its promise for the lifetime of the module
    // and resolves it immediately only if `window.YT.Player` already exists the *first* time it runs.
    // Setting a default stub here — before any test can trigger it —
    // guarantees no test in this file ever hits the real youtube.com script
    (window as unknown as { YT?: unknown }).YT = { Player: FakeYouTubePlayer };
  });

  afterEach(() => {
    // Individual tests may swap in FailingYouTubePlayer; restore the default afterwards.
    // `YT.Player` is read fresh on every call, so this is safe even though the "API loaded" promise itself is cached
    // and never re-evaluated after the `before()` hook above.
    (window as unknown as { YT: unknown }).YT = { Player: FakeYouTubePlayer };
  });

  describe('YouTube', () => {
    it('starts playback muted, then unmutes, and dispatches play-requested then playing', async () => {
      const el = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
          <div slot="content">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="autoplay; encrypted-media; picture-in-picture"
            ></iframe>
          </div>
        </toujou-poster-reveal>
      `);

      const requestedPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT);
      const playingPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT);

      el.activate();

      const requested = (await requestedPromise) as CustomEvent;
      expect(requested.detail.provider).to.equal('youtube');

      const playing = (await playingPromise) as CustomEvent;
      expect(playing.detail.provider).to.equal('youtube');
    });

    it('dispatches an error event when playback fails', async () => {
      (window as unknown as { YT: unknown }).YT = { Player: FailingYouTubePlayer };

      const el = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
          <div slot="content">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              allow="autoplay; encrypted-media; picture-in-picture"
            ></iframe>
          </div>
        </toujou-poster-reveal>
      `);

      const errorPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_ERROR_EVENT);

      el.activate();

      const errorEvent = (await errorPromise) as CustomEvent;
      expect(errorEvent.detail.provider).to.equal('youtube');
      expect(errorEvent.detail.error).to.be.instanceOf(Error);
    });
  });

  describe('Vimeo', () => {
    it('sends a play postMessage and dispatches play-requested then playing', async () => {
      const el = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
          <div slot="content">
            <iframe src="https://player.vimeo.com/video/12345"></iframe>
          </div>
        </toujou-poster-reveal>
      `);

      const iframe = el.querySelector('iframe')!;
      const messages: unknown[] = [];
      iframe.contentWindow!.postMessage = (message: unknown) => {
        messages.push(message);
      };

      const requestedPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT);
      const playingPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT);

      el.activate();

      await requestedPromise;
      await playingPromise;

      expect(messages).to.deep.equal([{ method: 'play' }]);
    });
  });

  describe('unsupported providers', () => {
    it('does not dispatch any video events', async () => {
      const el = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
          <div slot="content">
            <iframe src="https://example.com/embed"></iframe>
          </div>
        </toujou-poster-reveal>
      `);

      let dispatched = false;
      el.addEventListener(TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT, () => {
        dispatched = true;
      });

      el.activate();

      // No network/timers to await here; give pending microtasks a chance to flush.
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(dispatched).to.be.false;
    });
  });

  describe('asynchronously inserted content', () => {
    it('still detects an iframe added to the content slot after activation', async () => {
      const el = await fixture<ToujouPosterReveal>(html`
        <toujou-poster-reveal>
          <button slot="trigger">Play</button>
          <div slot="content"></div>
        </toujou-poster-reveal>
      `);

      const contentContainer = el.querySelector('[slot="content"]')!;
      const messages: unknown[] = [];

      const requestedPromise = oneEvent(el, TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT);

      el.activate();

      // Simulate other code populating the slot asynchronously, after activation.
      await new Promise((resolve) => setTimeout(resolve, 20));

      const iframe = document.createElement('iframe');
      iframe.src = 'https://player.vimeo.com/video/12345';
      contentContainer.appendChild(iframe);
      iframe.contentWindow!.postMessage = (message: unknown) => {
        messages.push(message);
      };

      await requestedPromise;

      expect(messages).to.deep.equal([{ method: 'play' }]);
    });
  });
});
