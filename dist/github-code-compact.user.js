// ==UserScript==
// @name         GitHub Code Compact
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.0.0
// @author       jkker
// @description  Toggle a compact GitHub code view that hides line numbers and keeps selection aligned with JetBrains Mono.
// @license      MIT
// @icon         https://github.githubassets.com/favicons/favicon.png
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/github-code-compact.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/github-code-compact.user.js
// @match        https://github.com/*
// @grant        GM_addElement
// @grant        GM_addStyle
// @run-at       document-start
// @noframes
// ==/UserScript==

(function(){'use strict';var e=`jkker.github-code-compact.enabled`,t=`jkker-github-code-compact`,n=`jkker-code-toggle`,r=`JetBrains Mono`,i=`https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap`,a=localStorage.getItem(e)===`true`,o,s=document.createElement(`button`);function c(){document.querySelector(`link[data-jkker-github-code-font]`)||(GM_addElement(document.documentElement,`link`,{rel:`preconnect`,href:`https://fonts.gstatic.com`,crossorigin:`anonymous`,"data-jkker-github-code-font":`preconnect`}),GM_addElement(document.documentElement,`link`,{rel:`stylesheet`,href:i,"data-jkker-github-code-font":`stylesheet`}))}function l(){GM_addStyle(`
    body.${t} {
      --jkker-code-font: "${r}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    }

    body.${t} .react-line-numbers,
    body.${t} [class^="react-line-numbers"] {
      display: none !important;
      width: 0 !important;
      min-width: 0 !important;
      flex-basis: 0 !important;
    }

    body.${t} .react-code-text,
    body.${t} .react-code-line-contents,
    body.${t} .react-code-file-contents,
    body.${t} .react-code-lines,
    body.${t} .blob-code,
    body.${t} .blob-code-inner,
    body.${t} pre,
    body.${t} code,
    body.${t} #read-only-cursor-text-area,
    body.${t} textarea.react-blob-textarea,
    body.${t} .react-blob-print-hide {
      font-family: var(--jkker-code-font) !important;
      font-size: 12px !important;
      font-weight: 400 !important;
      line-height: 20px !important;
      font-variant-ligatures: none !important;
      font-feature-settings: normal !important;
      letter-spacing: 0 !important;
      tab-size: 4 !important;
    }

    body.${t} .react-code-line-contents {
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      text-indent: 0 !important;
    }

    body.${t} #read-only-cursor-text-area,
    body.${t} textarea.react-blob-textarea,
    body.${t} .react-blob-print-hide {
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

    .${n} {
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

    .${n}:hover {
      background-color: var(--button-default-bgColor-hover, #f6f8fa);
    }

    .${n}[aria-pressed="true"] {
      border-color: var(--fgColor-accent, #0969da);
      color: var(--fgColor-accent, #0969da);
    }
  `)}function u(){document.body&&(document.body.classList.toggle(t,a),s.setAttribute(`aria-pressed`,String(a)),s.textContent=a?`📖`:`👓`)}function d(){a=!a,localStorage.setItem(e,String(a)),u()}function f(){let e=document.querySelector(`[data-testid="symbols-button"]`),t=e?.parentElement;t&&(s.parentElement!==t||s.nextElementSibling!==e)&&t.insertBefore(s,e)}function p(){c(),l(),s.type=`button`,s.className=n,s.title=`Toggle compact GitHub code view`,s.setAttribute(`aria-label`,`Toggle compact GitHub code view`),s.addEventListener(`click`,d),u(),f(),o?.disconnect(),o=new MutationObserver(()=>{u(),f()}),o.observe(document.body,{childList:!0,subtree:!0}),document.fonts?.ready.then(u).catch(()=>{})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,p,{once:!0}):p()})();
