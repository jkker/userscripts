const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap'

GM_addElement(document.documentElement, 'link', {
  rel: 'stylesheet',
  href: FONT_URL,
  'data-jkker-reader-font': 'lexend',
})

GM_addStyle(`
  :root {
    --jkker-reader-font: "Lexend", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  body,
  button,
  input,
  select,
  textarea,
  [slot="comment"],
  shreddit-comment,
  .md,
  .usertext-body,
  .wikiwand-body,
  .article-content {
    font-family: var(--jkker-reader-font) !important;
  }

  [slot="comment"],
  shreddit-comment [id^="comment-content"],
  .usertext-body,
  .md {
    font-size: 1rem !important;
    line-height: 1.65 !important;
  }
`)

export {}
