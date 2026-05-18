import { spawnSync } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { basename, join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const distDir = join(root, 'dist')
const filenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.user\.js$/u
const requiredTags = ['name', 'namespace', 'version', 'description', 'run-at']

/** @param {string} source */
function parseMetadata(source) {
  const match = source.match(/^\/\/ ==UserScript==\n(?<body>[\s\S]*?)^\/\/ ==\/UserScript==/mu)
  if (!match?.groups?.body) return undefined

  const tags = new Map()
  for (const line of match.groups.body.split('\n')) {
    const tag = line.match(/^\/\/ @(?<key>[\w-]+)\s+(?<value>.*)$/u)
    if (!tag?.groups) continue

    const values = tags.get(tag.groups.key) ?? []
    values.push(tag.groups.value.trim())
    tags.set(tag.groups.key, values)
  }
  return tags
}

/**
 * @param {string[]} errors
 * @param {string} file
 * @param {string} message
 */
function fail(errors, file, message) {
  errors.push(`${file}: ${message}`)
}

const entries = await readdir(distDir)
const files = entries.filter((entry) => entry.endsWith('.user.js')).toSorted()
const errors = []

if (files.length === 0) errors.push('dist: expected at least one .user.js file')

for (const file of files) {
  if (!filenamePattern.test(file))
    fail(errors, file, 'filename must be lowercase URL-safe kebab-case ending in .user.js')

  const path = join(distDir, file)
  const source = await readFile(path, 'utf8')
  const metadata = parseMetadata(source)
  if (!metadata) {
    fail(errors, file, 'missing valid userscript metadata block')
    continue
  }

  for (const tag of requiredTags) if (!metadata.has(tag)) fail(errors, file, `missing @${tag}`)

  if (!metadata.has('match') && !metadata.has('include'))
    fail(errors, file, 'missing @match or @include')
  if (!metadata.has('grant')) fail(errors, file, 'missing explicit @grant')

  const version = metadata.get('version')?.[0]
  if (version && !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u.test(version))
    fail(errors, file, '@version must be semver-like')

  const syntax = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' })
  if (syntax.status !== 0) fail(errors, file, `syntax check failed: ${syntax.stderr.trim()}`)
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${files.length} userscripts in ${basename(distDir)}/`)
