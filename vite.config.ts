import hostedGitInfo from 'hosted-git-info'
import monkey from 'vite-plugin-monkey'
import { defineConfig } from 'vite-plus'

import { config as metasearch } from '#/metasearch/config.ts'

import root from './package.json' with { type: 'json' }

const gitURL = hostedGitInfo.fromUrl(root.repository.url)

if (!gitURL) throw new Error('Invalid repository URL in package.json')

const userscripts = [
  {
    slug: 'bing-direct-links',
    name: 'Bing Direct Links',
    version: '1.0.0',
    description: 'Replace Bing tracking result links with their real destination URLs.',
    entry: 'src/bing-direct-links.ts',
    match: ['https://www.bing.com/search*', 'https://*.bing.com/search*'],
    icon: 'https://www.google.com/s2/favicons?sz=64&domain=bing.com',
    runAt: 'document-idle',
    grant: 'none',
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
    grant: 'none',
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
    grant: 'none',
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
    grant: 'none',
  },
] as const

function metasearchMatches(): string[] {
  const matches = metasearch.engines
    .filter(({ disabled }) => !disabled)
    .flatMap(({ url }) => {
      const { hostname, pathname } = new URL(url)
      const domain = hostname.split('.').slice(-2).join('.')
      return [`*://${domain}${pathname}*`, `*://*.${domain}${pathname}*`]
    })

  return [...new Set(matches)]
}

const modeIndex = process.argv.indexOf('--mode')
const mode = modeIndex === -1 ? undefined : process.argv[modeIndex + 1]
const script = userscripts.find(({ slug }) => slug === mode) ?? userscripts[0]

if (!script) throw new Error('No userscripts configured')

const fileName = `${script.slug}.user.js`
const icon = script.icon?.startsWith('http')
  ? script.icon
  : script.icon
    ? gitURL.file(script.icon)
    : undefined
const match = script.slug === 'metasearch' ? metasearchMatches() : [...script.match]
const grant = script.grant === 'none' ? 'none' : [...script.grant]
const buildCommand = userscripts.map(({ slug }) => `vp build --mode ${slug}`).join(' && ')
const artifactCheckCommand = userscripts
  .map(({ slug }) => `test -s dist/${slug}.user.js`)
  .join(' && ')

export default defineConfig({
  plugins: [
    monkey({
      entry: script.entry,
      build: { fileName, metaFileName: false },
      userscript: {
        name: script.name,
        namespace: root.repository.url,
        version: script.version,
        description: script.description,
        author: root.author,
        match,
        icon,
        grant,
        'run-at': script.runAt,
        noframes: true,
        updateURL: gitURL.file(`dist/${fileName}`),
        downloadURL: gitURL.file(`dist/${fileName}`),
        supportURL: gitURL.bugs(),
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    minify: true,
  },
  staged: {
    '*': 'vp check --no-error-on-unmatched-pattern',
  },
  test: {},
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
      reportUnusedDisableDirectives: 'warn',
    },
    env: {
      builtin: true,
      browser: true,
      es2026: true,
    },
  },
  fmt: {
    ignorePatterns: ['dist/**'],
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
    sortImports: {
      internalPattern: ['#/*'],
    },
  },
  run: {
    cache: true,
    tasks: {
      build: {
        command: buildCommand,
        cache: false,
      },
      ready: {
        command: `vp run build && ${artifactCheckCommand}`,
        cache: false,
      },
    },
  },
})
