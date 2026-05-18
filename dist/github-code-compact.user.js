// ==UserScript==
// @name         GitHub Code Compact
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.1.0
// @author       jkker
// @description  Toggle a compact GitHub code view that hides line numbers and keeps selection aligned with JetBrains Mono.
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.png
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/github-code-compact.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/github-code-compact.user.js
// @match        https://github.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

(function() {
  'use strict';
	var STORAGE_KEY = "jkker.github-code-compact.enabled";
	var ENABLED_CLASS = "jkker-github-code-compact";
	var BUTTON_CLASS = "jkker-github-code-compact-toggle";
	var enabled = localStorage.getItem(STORAGE_KEY) === "true";
	var button;
	var mountQueued = false;
	var toolbarObserver;
	var toolbarObserverTimeout;
	GM_addStyle(`
  @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap");

  body.${ENABLED_CLASS} {
    --jkker-github-code-font: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
  }

  body.${ENABLED_CLASS} .react-line-numbers {
    display: none !important;
  }

  body.${ENABLED_CLASS} .react-code-text,
  body.${ENABLED_CLASS} .react-code-line-contents,
  body.${ENABLED_CLASS} .react-code-file-contents,
  body.${ENABLED_CLASS} .react-code-lines,
  body.${ENABLED_CLASS} #read-only-cursor-text-area,
  body.${ENABLED_CLASS} textarea.react-blob-textarea,
  body.${ENABLED_CLASS} .react-blob-print-hide {
    font-family: var(--jkker-github-code-font) !important;
    font-size: 12px !important;
    line-height: 20px !important;
    font-variant-ligatures: none !important;
    font-feature-settings: normal !important;
    letter-spacing: 0 !important;
    tab-size: 4 !important;
  }

  body.${ENABLED_CLASS} .react-code-line-contents,
  body.${ENABLED_CLASS} #read-only-cursor-text-area,
  body.${ENABLED_CLASS} textarea.react-blob-textarea,
  body.${ENABLED_CLASS} .react-blob-print-hide {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    text-indent: 0 !important;
    box-sizing: border-box !important;
  }

  body.${ENABLED_CLASS} #read-only-cursor-text-area,
  body.${ENABLED_CLASS} textarea.react-blob-textarea,
  body.${ENABLED_CLASS} .react-blob-print-hide {
    margin-top: 0 !important;
    left: 0 !important;
    white-space: pre !important;
    overflow-wrap: normal !important;
  }

  .${BUTTON_CLASS} {
    width: 28px;
    height: 28px;
    margin-right: 4px;
    border: 1px solid var(--borderColor-default, #d0d7de);
    border-radius: 6px;
    background: var(--bgColor-default, #ffffff);
    color: var(--fgColor-default, #24292f);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    line-height: 1;
  }

  .${BUTTON_CLASS}:hover {
    background: var(--button-default-bgColor-hover, #f6f8fa);
  }

  .${BUTTON_CLASS}[aria-pressed="true"] {
    border-color: var(--fgColor-accent, #0969da);
    color: var(--fgColor-accent, #0969da);
  }
`);
	function syncState() {
		document.body?.classList.toggle(ENABLED_CLASS, enabled);
		if (!button) return;
		button.setAttribute("aria-pressed", String(enabled));
		button.textContent = enabled ? "📖" : "👓";
	}
	function setEnabled(next) {
		enabled = next;
		localStorage.setItem(STORAGE_KEY, String(enabled));
		syncState();
	}
	function getButton() {
		if (button) return button;
		button = document.createElement("button");
		button.type = "button";
		button.className = BUTTON_CLASS;
		button.title = "Toggle compact GitHub code view";
		button.setAttribute("aria-label", "Toggle compact GitHub code view");
		button.addEventListener("click", () => setEnabled(!enabled));
		syncState();
		return button;
	}
	function mountButton() {
		const symbolsButton = document.querySelector("[data-testid=\"symbols-button\"]");
		const parent = symbolsButton?.parentElement;
		if (!symbolsButton || !parent || getButton().isConnected) return;
		parent.insertBefore(getButton(), symbolsButton);
		stopWatchingToolbar();
	}
	function queueMount() {
		if (mountQueued) return;
		mountQueued = true;
		requestAnimationFrame(() => {
			mountQueued = false;
			mountButton();
		});
	}
	function stopWatchingToolbar() {
		toolbarObserver?.disconnect();
		toolbarObserver = void 0;
		if (toolbarObserverTimeout) window.clearTimeout(toolbarObserverTimeout);
		toolbarObserverTimeout = void 0;
	}
	function watchForToolbar() {
		queueMount();
		if (getButton().isConnected || toolbarObserver || !document.body) return;
		toolbarObserver = new MutationObserver(() => {
			if (getButton().isConnected) stopWatchingToolbar();
			else queueMount();
		});
		toolbarObserver.observe(document.body, {
			childList: true,
			subtree: true
		});
		toolbarObserverTimeout = window.setTimeout(stopWatchingToolbar, 5e3);
	}
	function start() {
		syncState();
		watchForToolbar();
		document.addEventListener("turbo:load", watchForToolbar);
		document.addEventListener("turbo:render", watchForToolbar);
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
	else start();
})();
