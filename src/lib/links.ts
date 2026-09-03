const EXTERNAL_SCHEME = /^(https?:|mailto:|tel:)/;
const NEW_TAB_SCHEME = /^https?:/;

/** True when the href needs a plain `<a>` rather than a Next `Link`. */
export function isExternalHref(href: string): boolean {
  return EXTERNAL_SCHEME.test(href) || href.startsWith("//");
}

/**
 * Only http(s) opens in a new tab. `mailto:` and `tel:` hand off to another
 * app, so a new tab would be left behind empty.
 */
export function newTabProps(href: string) {
  return NEW_TAB_SCHEME.test(href) || href.startsWith("//")
    ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
    : {};
}
