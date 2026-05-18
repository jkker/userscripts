const STORAGE_KEY = 'jkker.github-code-compact.enabled'
const CLASS_NAME = 'jkker-github-code-compact'
const TOGGLE_CLASS = 'jkker-code-toggle'
const FONT_FAMILY = 'JetBrains Mono'
const FONT_URL =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap'

let enabled = localStorage.getItem(STORAGE_KEY) === 'true'
let observer: MutationObserver | undefined
const toggleButton = document.createElement('button')

function loadFont(): void {
  if (document.querySelector('link[data-jkker-github-code-font]')) return

  GM_addElement(document.documentElement, 'link', {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossorigin: 'anonymous',
    'data-jkker-github-code-font': 'preconnect',
  })

  GM_addElement(document.documentElement, 'link', {
    rel: 'stylesheet',
    href: FONT_URL,
    'data-jkker-github-code-font': 'stylesheet',
  })
}

function installStyles(): void {
  GM_addStyle(`
    body.${CLASS_NAME} {
      --jkker-code-font: "${FONT_FAMILY}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }

    body.${CLASS_NAME} .react-line-numbers,
    body.${CLASS_NAME} [class^="react-line-numbers"] {
      display: none !important;
      width: 0 !important;
      min-width: 0 !important;
      flex-basis: 0 !important;
    }

    body.${CLASS_NAME} .react-code-text,
    body.${CLASS_NAME} .react-code-line-contents,
    body.${CLASS_NAME} .react-code-file-contents,
    body.${CLASS_NAME} .react-code-lines,
    body.${CLASS_NAME} .blob-code,
    body.${CLASS_NAME} .blob-code-inner,
    body.${CLASS_NAME} pre,
    body.${CLASS_NAME} code,
    body.${CLASS_NAME} #read-only-cursor-text-area,
    body.${CLASS_NAME} textarea.react-blob-textarea,
    body.${CLASS_NAME} .react-blob-print-hide {
      font-family: var(--jkker-code-font) !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      line-height: 20px !important;
      font-variant-ligatures: none !important;
      font-feature-settings: normal !important;
      letter-spacing: 0 !important;
      tab-size: 4 !important;
    }

    body.${CLASS_NAME} .react-code-line-contents {
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      text-indent: 0 !important;
    }

    body.${CLASS_NAME} #read-only-cursor-text-area,
    body.${CLASS_NAME} textarea.react-blob-textarea,
    body.${CLASS_NAME} .react-blob-print-hide {
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
      left: 0 !important;
      text-indent: 0 !important;
      box-sizing: border-box !important;
      white-space: pre !important;
      overflow-wrap: normal !important;
    }

    .${TOGGLE_CLASS} {
      width: 28px;
      height: 28px;
      border: 1px solid var(--borderColor-default, #d0d7de);
      background: var(--bgColor-default, #ffffff);
      border-radius: 6px;
      cursor: pointer;
      margin-right: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      line-height: 1;
    }

    .${TOGGLE_CLASS}:hover {
      background-color: var(--button-default-bgColor-hover, #f6f8fa);
    }

    .${TOGGLE_CLASS}[aria-pressed="true"] {
      border-color: var(--fgColor-accent, #0969da);
      color: var(--fgColor-accent, #0969da);
    }
  `)
}

function applyState(): void {
  if (!document.body) return
  document.body.classList.toggle(CLASS_NAME, enabled)
  toggleButton.setAttribute('aria-pressed', String(enabled))
  toggleButton.textContent = enabled ? '📖' : '👓'
}

function toggle(): void {
  enabled = !enabled
  localStorage.setItem(STORAGE_KEY, String(enabled))
  applyState()
}

function insertToggle(): void {
  const symbolsButton = document.querySelector('[data-testid="symbols-button"]')
  const parent = symbolsButton?.parentElement
  if (!parent) return

  if (toggleButton.parentElement !== parent || toggleButton.nextElementSibling !== symbolsButton)
    parent.insertBefore(toggleButton, symbolsButton)
}

function init(): void {
  loadFont()
  installStyles()

  toggleButton.type = 'button'
  toggleButton.className = TOGGLE_CLASS
  toggleButton.title = 'Toggle compact GitHub code view'
  toggleButton.setAttribute('aria-label', 'Toggle compact GitHub code view')
  toggleButton.addEventListener('click', toggle)

  applyState()
  insertToggle()

  observer?.disconnect()
  observer = new MutationObserver(() => {
    applyState()
    insertToggle()
  })
  observer.observe(document.body, { childList: true, subtree: true })

  document.fonts?.ready.then(applyState).catch(() => {})
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', init, { once: true })
else init()

export {}
