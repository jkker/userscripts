export type UserscriptGrant = 'none' | 'GM_addElement' | 'GM_addStyle'

export type UserscriptDefinition = {
  readonly slug: string
  readonly name: string
  readonly version: string
  readonly description: string
  readonly entry: string
  readonly match: readonly string[]
  readonly icon?: string
  readonly runAt:
    | 'document-start'
    | 'document-body'
    | 'document-end'
    | 'document-idle'
    | 'context-menu'
  readonly grant: readonly UserscriptGrant[]
}

export const scripts = [
  {
    slug: 'bing-direct-links',
    name: 'Bing Direct Links',
    version: '1.0.0',
    description: 'Replace Bing tracking result links with their real destination URLs.',
    entry: 'src/bing-direct-links.ts',
    match: ['https://www.bing.com/search*', 'https://*.bing.com/search*'],
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=bing.com',
    runAt: 'document-idle',
    grant: ['none'],
  },
  {
    slug: 'github-code-compact',
    name: 'GitHub Code Compact',
    version: '1.0.0',
    description:
      'Toggle a compact GitHub code view that hides line numbers and keeps selection aligned with JetBrains Mono.',
    entry: 'src/github-code-compact.ts',
    match: ['https://github.com/*'],
    icon: 'https://github.githubassets.com/favicons/favicon.png',
    runAt: 'document-start',
    grant: ['GM_addElement', 'GM_addStyle'],
  },
  {
    slug: 'metasearch',
    name: 'metasearch',
    version: '2.1.0',
    description:
      'Add a fast bottom search switcher to jump between Google, YouTube, GitHub, Reddit, shopping, and more.',
    entry: 'src/metasearch/index.ts',
    match: [],
    icon: 'src/metasearch/favicon.ico',
    runAt: 'document-idle',
    grant: ['none'],
  },
  {
    slug: 'npmx-redirect',
    name: 'npmx Redirect',
    version: '1.0.0',
    description:
      'Open npm package pages on npmx.dev while keeping npmx back-links from bouncing forever.',
    entry: 'src/npmx-redirect.ts',
    match: ['https://www.npmjs.com/package/*', 'https://npmx.dev/*'],
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=npmjs.com',
    runAt: 'document-start',
    grant: ['none'],
  },
  {
    slug: 'reader-font-lexend',
    name: 'Reader Font Lexend',
    version: '1.0.0',
    description: 'Apply Lexend to Reddit and Wikiwand for calmer long-form reading.',
    entry: 'src/reader-font-lexend.ts',
    match: [
      'https://www.reddit.com/*',
      'https://old.reddit.com/*',
      'https://new.reddit.com/*',
      'https://www.wikiwand.com/*',
    ],
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=lexend.com',
    runAt: 'document-start',
    grant: ['GM_addElement', 'GM_addStyle'],
  },
  {
    slug: 'wikiwand-redirect',
    name: 'Wikiwand Redirect',
    version: '1.0.0',
    description: 'Redirect Wikipedia article pages to the matching Wikiwand article.',
    entry: 'src/wikiwand-redirect.ts',
    match: ['https://*.wikipedia.org/wiki/*'],
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org',
    runAt: 'document-start',
    grant: ['none'],
  },
] satisfies readonly UserscriptDefinition[]
