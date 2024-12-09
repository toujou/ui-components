import { ParsedSrc, IdHash, Body, ToujouModalEvents } from './types';
import { ToujouModal } from './toujou-modal';

function parseSrc(src: string): ParsedSrc {
  const link = document.createElement('a');
  link.href = src;

  return {
    protocol: link.protocol,
    href: link.href,
    path: link.pathname,
    search: link.search,
    hash: link.hash,
  };
}

function isSrcOnpageContent(src: string): boolean {
  const uri: ParsedSrc = parseSrc(src);
  const uriWithoutHash = uri.href.substr(0, uri.href.length - uri.hash.length);
  const currentUri = window.location.href.replace(/#.*$/, '');
  return uri.hash && uriWithoutHash === currentUri;
}

function generateId(prefix: string, hashArguments: any) {
  const string = JSON.stringify(hashArguments);
  let hash = 0;

  if (string.length === 0) {
    return hash;
  }

  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash; // Convert to 32bit integer
  }

  return `${prefix}-${hash}`;
}

function createPostForm(action: string, body: Body, target: string): HTMLFormElement {
  const form: HTMLFormElement = document.createElement('form');
  const input: HTMLInputElement = document.createElement('input');

  form.action = action;
  form.method = 'POST';
  form.target = target;

  body.forEach(([name, value]) => {
    input.name = name;
    input.value = value.toString();
    form.appendChild(input.cloneNode());
  });

  form.style.visibility = 'hidden';
  return form;
}

function getOpenerFromEvent(event: Event): HTMLElement | SVGElement | null {
  const path = event.composedPath() as EventTarget[];
  for (let i = 0; i < path.indexOf(document.body); i++) {
    const target = path[i] as HTMLElement | SVGElement;
    if (target.hasAttribute && target.hasAttribute('target') && target !== document.body) {
      return target;
    }
  }
}

function getBodyFromOpener(opener: HTMLElement | SVGElement, idHash: IdHash): [Body | null, IdHash] {
  if (opener.hasAttribute('data-modal-post')) {
    const modalPostArguments = opener.getAttribute('data-modal-post');
    idHash.method = 'POST';
    idHash.body = modalPostArguments;

    const body: Body = [];
    (new URL(`http://localhost/?${modalPostArguments}`)).searchParams.forEach((value, name) => {
      body.push([name, value]);
    });

    return [body, idHash];
  }
  return [null, idHash];
}

function createModal(
  modalId: string,
  idHash: IdHash,
  src: string,
  method: string | undefined,
  body: Body | null
): ToujouModal {
  const ToujouModal = document.createElement('toujou-modal') as ToujouModal;
  const iframe = document.createElement('iframe');
  const iframeId = String(generateId('iframe', idHash));

  ToujouModal.id = modalId;
  iframe.name = iframeId;

  document.body.appendChild(ToujouModal);

  if (isSrcOnpageContent(src)) {
    const content = document.querySelector(src) as HTMLElement | HTMLTemplateElement | null;
    if (!content) return ToujouModal;

    const contentNodes = content instanceof HTMLTemplateElement
      ? document.importNode(content.content, true).children
      : content.childNodes;

    if (content instanceof HTMLElement && content.title) {
      ToujouModal.title = content.title;
    }

    for (let i = 0; i < contentNodes.length; i++) {
      ToujouModal.appendChild(contentNodes[i]);
    }
  } else if (body && method === 'POST') {
    const form = createPostForm(src, body, iframeId);
    ToujouModal.appendChild(form);
    ToujouModal.appendChild(iframe);
    form.submit();
    form.remove();
  } else if (method === 'GET') {
    iframe.src = src;
    ToujouModal.appendChild(iframe);
  }
  return ToujouModal;
}

function openModal(
  idHash: IdHash,
  src: string,
  method: string | undefined,
  body: Body | null
): void {
  const modalId = String(generateId('toujou-modal', idHash));
  const modal = (document.getElementById(modalId) as ToujouModal) || createModal(modalId, idHash, src, method, body);
  setTimeout(() => { modal.open(); });
}

export const handleToujouModalTargetClick = (event: Event): void => {
  if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey)) {
    return;
  }

  const opener = getOpenerFromEvent(event);
  if (!(opener instanceof HTMLElement || opener instanceof SVGElement) || opener instanceof HTMLFormElement) {
    return;
  }

  if (opener.getAttribute('target') === 'toujou-modal') {
    const href = opener.getAttribute('href');
    const src = (href.indexOf('?') !== -1
      ? href.split('?')[0] + '?' + 'toujou-ajax-modal=1' + '&' + href.split('?')[1]
      : (href.indexOf('#') !== -1
        ? href.split('#')[0] + '?' + 'toujou-ajax-modal=1' + '#' + href.split('#')[1]
        : href + '?' + 'toujou-ajax-modal=1'));

    const [body, idHash] = getBodyFromOpener(opener, { src });
    openModal(idHash, src, body ? 'POST' : 'GET', body);

    event.preventDefault();
    event.stopPropagation();
  }

  if (opener.getAttribute('target') === ToujouModalEvents.CLOSED) {
    const isInIFrame = (window.location !== window.parent.location);
    if (isInIFrame) {
      const message = ToujouModalEvents.CLOSED;
      window.parent.postMessage(message, '*');
      event.preventDefault();
      event.stopPropagation();
    }
  }
};
