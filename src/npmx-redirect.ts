const BYPASS_KEY = 'utm_source'
const BYPASS_VALUE = 'npmx'

function shouldRedirectFromNpm(url: URL): boolean {
  return (
    url.hostname === 'www.npmjs.com' &&
    url.pathname.startsWith('/package/') &&
    url.searchParams.get(BYPASS_KEY) !== BYPASS_VALUE
  )
}

function redirectToNpmx(url: URL): void {
  const destination = new URL(url.pathname + url.hash, 'https://npmx.dev')
  location.replace(destination.href)
}

function patchNpmLinks(root: ParentNode = document): void {
  const selector = `a[href*="npmjs.com/package/"]:not([data-jkker-npmx-patched])`

  for (const link of root.querySelectorAll<HTMLAnchorElement>(selector))
    try {
      const url = new URL(link.href)
      if (url.hostname !== 'www.npmjs.com' || !url.pathname.startsWith('/package/')) continue

      url.searchParams.set(BYPASS_KEY, BYPASS_VALUE)
      link.href = url.href
      link.dataset.jkkerNpmxPatched = 'true'
    } catch {
      // Ignore malformed or browser-expanded hrefs.
    }
}

function observeNpmxLinks(): void {
  const start = () => {
    patchNpmLinks()
    new MutationObserver((mutations) => {
      for (const mutation of mutations)
        for (const node of mutation.addedNodes) if (node instanceof Element) patchNpmLinks(node)
    }).observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', start, { once: true })
  else start()
}

const currentUrl = new URL(location.href)
if (shouldRedirectFromNpm(currentUrl)) redirectToNpmx(currentUrl)
else if (currentUrl.hostname === 'npmx.dev') observeNpmxLinks()

export {}
