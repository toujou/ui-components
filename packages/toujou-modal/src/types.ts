export interface ParsedSrc {
  protocol: string;
  href: string;
  path: string;
  search: string;
  hash: string;
}

export interface IdHash {
  src?: string;
  method?: string;
  body?: string | null;
}

export type Body = [string, string][];

export enum ToujouModalEvents {
  OPENED = 'toujou-modal-opened',
  CLOSED = 'toujou-modal-closed',
  LOADED = 'toujou-modal-loaded',
}
