import { TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT } from './toujou-poster-reveal';

export {};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Cached YouTube API loading promise.
 */
let youtubeApiPromise: Promise<void> | null = null;

/**
 * Counter for generated YouTube iframe IDs.
 */
let youtubeIframeIdCounter = 0;

/**
 * Cached YouTube players by iframe.
 */
const youtubePlayers = new WeakMap<HTMLIFrameElement, Promise<YT.Player>>();

/**
 * Permissions required by YouTube for autoplay and media playback.
 */
const REQUIRED_YOUTUBE_ALLOW_FEATURES = [
  'autoplay',
  'encrypted-media',
  'picture-in-picture',
] as const;

/**
 * URL of the official YouTube IFrame Player API script.
 */
const YOUTUBE_IFRAME_API_URL = 'https://www.youtube.com/iframe_api';

/* Custom Events */
export const TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT = 'toujou-poster-reveal-video-play-requested';
export const TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT = 'toujou-poster-reveal-video-playing';
export const TOUJOU_POSTER_REVEAL_VIDEO_ERROR_EVENT = 'toujou-poster-reveal-video-error';

const YOUTUBE_HOSTS = [
  'youtube.com',
  'youtube-nocookie.com',
  'youtu.be',
];

const VIMEO_HOSTS = [
  'vimeo.com',
];

type PosterRevealVideoProvider = 'youtube' | 'vimeo';

interface PosterRevealEventDetail {
  provider: PosterRevealVideoProvider;
  error?: unknown;
}

/**
 * Maximum time to wait for an iframe reload.
 */
const IFRAME_RELOAD_TIMEOUT_MS = 5000;

/**
 * Maximum time to wait for embedded video iframes to appear in the DOM
 * after activation, before giving up.
 */
const IFRAME_WAIT_TIMEOUT_MS = 2000;

/**
 * Tracks whether the poster reveal listener has already been registered, to avoid attaching it more than once
 */
let posterRevealListenerInitialized = false;

/**
 * Resolves with any iframes found inside the target, waiting briefly
 * for them to be inserted if they aren't present yet (handles races
 * with other code that populates the content slot on activation).
 *
 * @param target - The toujou-poster-reveal element.
 */
function waitForIframes(target: HTMLElement): Promise<HTMLIFrameElement[]> {
  const existing = Array.from(target.querySelectorAll<HTMLIFrameElement>('iframe'));
  if (existing.length > 0) return Promise.resolve(existing);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve(Array.from(target.querySelectorAll<HTMLIFrameElement>('iframe')));
    }, IFRAME_WAIT_TIMEOUT_MS);

    const observer = new MutationObserver(() => {
      const found = Array.from(target.querySelectorAll<HTMLIFrameElement>('iframe'));
      if (found.length > 0) {
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  });
}

/**
 * Loads the YouTube IFrame API only once.
 */
function loadYouTubeIframeApi(): Promise<void> {
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    if (typeof YT !== 'undefined' && YT.Player) {
      resolve();
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    if (!document.querySelector(`script[src="${YOUTUBE_IFRAME_API_URL}"]`)) {
      const script = document.createElement('script');

      script.src = YOUTUBE_IFRAME_API_URL;
      script.onerror = () => {
        reject(new Error('Failed to load YouTube IFrame API.'));
      };

      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}


/**
 * Gets or creates a YouTube player instance for an iframe.
 *
 * @param iframe - The YouTube iframe element.
 */
function getYouTubePlayer(iframe: HTMLIFrameElement): Promise<YT.Player> {
  const existing = youtubePlayers.get(iframe);
  if (existing) return existing;

  const playerPromise = loadYouTubeIframeApi().then(
    () =>
      new Promise<YT.Player>((resolve) => {
        if (!iframe.id) {
          iframe.id = `youtube-player-${++youtubeIframeIdCounter}`;
        }

        // Use the existing iframe instead of creating a new one.
        new YT.Player(iframe.id, {
          events: {
            onReady: (event) => resolve(event.target),
          },
        });
      }),
  );

  youtubePlayers.set(iframe, playerPromise);
  return playerPromise;
}

/**
 * Ensures required autoplay permissions are set.
 *
 * @param iframe - The YouTube iframe element.
 * @returns true if the attribute was missing and had to be added.
 */
function ensureYouTubeAutoplayAllowed(iframe: HTMLIFrameElement): boolean {
  const current = new Set(
    iframe.allow
      .split(';')
      .map((feature) => feature.trim())
      .filter(Boolean),
  );

  let changed = false;
  for (const feature of REQUIRED_YOUTUBE_ALLOW_FEATURES) {
    if (!current.has(feature)) {
      current.add(feature);
      changed = true;
    }
  }

  if (changed) {
    iframe.allow = Array.from(current).join('; ');
  }

  return changed;
}

/**
 * Reloads an iframe after changing permissions. Needed after changing the `allow` attribute,
 * since Permissions Policy is only (re-)evaluated when the frame actually navigates
 *
 * @param iframe - The iframe element to reload.
 */
function reloadIframe(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      iframe.removeEventListener('load', onLoad);
      reject(new Error('Timed out while reloading iframe.'));
    }, IFRAME_RELOAD_TIMEOUT_MS);

    const onLoad = () => {
      window.clearTimeout(timeout);
      iframe.removeEventListener('load', onLoad);
      resolve();
    };

    iframe.addEventListener('load', onLoad);

    try {
      const url = new URL(iframe.src, window.location.href);

      // Force a real navigation even if the URL did not change.
      url.searchParams.set('_r', Date.now().toString());

      iframe.src = url.toString();
    } catch (error) {
      window.clearTimeout(timeout);
      iframe.removeEventListener('load', onLoad);
      reject(error);
    }
  });
}

/**
 * Starts YouTube playback with autoplay-safe settings.
 *
 * @param posterReveal - The toujou-poster-reveal element.
 * @param iframe - The YouTube iframe element.
 */
async function playYouTube(
  posterReveal: HTMLElement,
  iframe: HTMLIFrameElement,
): Promise<void> {
  try {
    dispatchPosterRevealEvent(posterReveal, TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT, { provider: 'youtube' });

    if (ensureYouTubeAutoplayAllowed(iframe)) {
      await reloadIframe(iframe);

      // The iframe re-navigated, so any previously created player instance is now stale
      youtubePlayers.delete(iframe);
    }

    const player = await getYouTubePlayer(iframe);
    startYouTubePlayback(player);

    dispatchPosterRevealEvent(posterReveal, TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT, { provider: 'youtube' });
  } catch (error) {
    dispatchPosterRevealEvent(posterReveal, TOUJOU_POSTER_REVEAL_VIDEO_ERROR_EVENT, { provider: 'youtube', error });

    console.warn(
      'Could not start YouTube video playback.',
      {
        src: iframe.src,
        error,
      },
    );
  }
}

/**
 * Starts playback while respecting autoplay restrictions.
 *
 * @param player - The YouTube player instance.
 */
function startYouTubePlayback(player: YT.Player): void {
  player.mute();
  player.setVolume(30);
  player.playVideo();
  player.unMute();
}

/**
 * Plays a Vimeo video inside an iframe using the Vimeo Player API.
 *
 * @param posterReveal - The toujou-poster-reveal element.
 * @param iframe - The Vimeo iframe element.
 */
function playVimeo(
  posterReveal: HTMLElement,
  iframe: HTMLIFrameElement,
): void {
  dispatchPosterRevealEvent(posterReveal, TOUJOU_POSTER_REVEAL_VIDEO_PLAY_REQUESTED_EVENT, { provider: 'vimeo' });

  iframe.contentWindow?.postMessage({ method: 'play' }, '*');

  dispatchPosterRevealEvent(posterReveal, TOUJOU_POSTER_REVEAL_VIDEO_PLAYING_EVENT, { provider: 'vimeo' });
}

/**
 * Gets the video provider from an iframe URL.
 *
 * @param iframe - The iframe element.
 * @returns 'youtube' | 'vimeo' | null
 */
function getVideoProvider(iframe: HTMLIFrameElement): 'youtube' | 'vimeo' | null {
  try {
    const { hostname } = new URL(iframe.src, window.location.href);

    if (YOUTUBE_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    )) {
      return 'youtube';
    }

    if (VIMEO_HOSTS.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    )) {
      return 'vimeo';
    }
  } catch {
    // Empty or unparsable src - not a recognized provider.
  }

  return null;
}

/**
 * Plays all supported embedded videos found in an iterable of iframes.
 *
 * @param posterReveal - The toujou-poster-reveal element.
 * @param iframes - Iframe elements containing embedded videos.
 */
function playEmbeddedVideos(
  posterReveal: HTMLElement,
  iframes: Iterable<HTMLIFrameElement>,
): void {
  for (const iframe of iframes) {
    const provider = getVideoProvider(iframe);

    switch (provider) {
      case 'youtube':
        void playYouTube(posterReveal, iframe);
        break;

      case 'vimeo':
        playVimeo(posterReveal, iframe);
        break;
    }
  }
}

/**
 * Dispatches a poster reveal event from the toujou-poster-reveal element.
 */
function dispatchPosterRevealEvent(
  posterReveal: HTMLElement,
  eventName: string,
  detail?: PosterRevealEventDetail,
): void {
  posterReveal.dispatchEvent(
    new CustomEvent(eventName, { bubbles: true, detail }),
  );
}

/**
 * Starts videos when a poster reveal is activated.
 */
function initPosterRevealListener(): void {
  if (posterRevealListenerInitialized) return;
  posterRevealListenerInitialized = true;

  window.addEventListener(TOUJOU_POSTER_REVEAL_ACTIVATE_EVENT, (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    void waitForIframes(target).then((iframes) => {
      if (iframes.length === 0) return;
      playEmbeddedVideos(target, iframes);
    });
  });
}

initPosterRevealListener();
