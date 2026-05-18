import hostedGitInfo from 'hosted-git-info'
import monkey from 'vite-plugin-monkey'
import { defineConfig } from 'vite-plus'

import { config as metasearch } from '#/metasearch/config.ts'
import { scripts } from '#/scripts.ts'

import root from './package.json' with { type: 'json' }

const gitURL = hostedGitInfo.fromUrl(root.repository.url)

if (!gitURL) throw new Error('Invalid repository URL in package.json')

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
const script = scripts.find(({ slug }) => slug === mode) ?? scripts[0]

if (!script) throw new Error('No userscripts configured')

const fileName = `${script.slug}.user.js`
const icon = script.icon?.startsWith('http')
  ? script.icon
  : script.icon
    ? gitURL.file(script.icon)
    : undefined
const match = script.slug === 'metasearch' ? metasearchMatches() : [...script.match]
const grant = script.grant[0] === 'none' ? 'none' : script.grant.filter((value) => value !== 'none')

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
  },
})
