// ==UserScript==
// @name         Reader Font Lexend
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.0.0
// @author       jkker
// @description  Apply Lexend to Reddit and Wikiwand for calmer long-form reading.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lexend.com
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/reader-font-lexend.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/reader-font-lexend.user.js
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://new.reddit.com/*
// @match        https://www.wikiwand.com/*
// @grant        GM_addElement
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

(function(){'use strict';GM_addElement(document.documentElement,`link`,{rel:`stylesheet`,href:`https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap`,"data-jkker-reader-font":`lexend`}),GM_addStyle(`
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
`)})();
