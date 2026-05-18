const BING_REDIRECT_PREFIX = 'https://www.bing.com/ck/a?'
const REQUEST_TIMEOUT_MS = 5000

const resolvedUrls = new Map<string, string>()
const pendingUrls = new Map<string, Promise<string | undefined>>()

function isBingRedirect(url: URL): boolean {
  return (
    url.href.startsWith(BING_REDIRECT_PREFIX) ||
    (url.hostname.endsWith('.bing.com') && url.pathname === '/ck/a')
  )
}

function readDestinationFromHtml(html: string): string | undefined {
  const quoted = html.match(/\b(?:var\s+)?u\s*=\s*"([^"]+)"/u)?.[1]
  if (quoted) return quoted.replaceAll('\\/', '/')

  const metaRefresh = html.match(
    /http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)/iu,
  )?.[1]
  return metaRefresh?.replaceAll('&amp;', '&')
}

async function resolveRedirect(href: string): Promise<string | undefined> {
  const resolved = resolvedUrls.get(href)
  if (resolved) return resolved

  const pending = pendingUrls.get(href)
  if (pending) return pending

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const request = fetch(href, { credentials: 'same-origin', signal: controller.signal })
    .then((response) => response.text())
    .then(readDestinationFromHtml)
    .then((destination) => {
      if (destination) resolvedUrls.set(href, destination)
      return destination
    })
    .catch(() => undefined)
    .finally(() => {
      window.clearTimeout(timeout)
      pendingUrls.delete(href)
    })

  pendingUrls.set(href, request)
  return request
}

async function rewriteLink(link: HTMLAnchorElement): Promise<void> {
  if (link.dataset.jkkerBingDirect === 'done') return

  let url: URL
  try {
    url = new URL(link.href)
  } catch {
    return
  }

  if (!isBingRedirect(url)) return

  link.dataset.jkkerBingDirect = 'pending'
  const destination = await resolveRedirect(url.href)
  if (!destination) {
    delete link.dataset.jkkerBingDirect
    return
  }

  link.dataset.jkkerBingOriginalHref = url.href
  link.href = destination
  link.rel = [link.rel, 'noreferrer'].filter(Boolean).join(' ')
  link.dataset.jkkerBingDirect = 'done'
}

function scan(root: ParentNode = document): void {
  for (const link of root.querySelectorAll<HTMLAnchorElement>('a[href*="/ck/a?"]'))
    void rewriteLink(link)
}

function init(): void {
  scan()
  new MutationObserver((mutations) => {
    for (const mutation of mutations)
      for (const node of mutation.addedNodes)
        if (node instanceof HTMLAnchorElement) void rewriteLink(node)
        else if (node instanceof Element) scan(node)
  }).observe(document.body, { childList: true, subtree: true })
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', init, { once: true })
else init()

export {}
