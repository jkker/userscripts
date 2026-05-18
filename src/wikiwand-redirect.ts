const SKIPPED_PREFIXES = [
  'Special:',
  'Talk:',
  'User:',
  'User_talk:',
  'Wikipedia:',
  'File:',
  'MediaWiki:',
  'Template:',
  'Help:',
  'Category:',
  'Portal:',
  'Draft:',
  'TimedText:',
  'Module:',
] as const

function languageFromHost(hostname: string): string {
  const parts = hostname.split('.')
  if (parts[0] === 'www') parts.shift()
  return parts.length > 2 ? (parts[0] ?? 'en') : 'en'
}

export {}

const article = decodeURIComponent(location.pathname.replace(/^\/wiki\//u, ''))
const skipped = !article || SKIPPED_PREFIXES.some((prefix) => article.startsWith(prefix))

if (!skipped) {
  const language = languageFromHost(location.hostname)
  const destination = new URL(
    `/${language}/${encodeURIComponent(article).replaceAll('%2F', '/')}`,
    'https://www.wikiwand.com',
  )
  destination.hash = location.hash
  location.replace(destination.href)
}
