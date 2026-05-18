// ==UserScript==
// @name         npmx Redirect
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.0.0
// @author       jkker
// @description  Open npm package pages on npmx.dev while keeping npmx back-links from bouncing forever.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=npmjs.com
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/npmx-redirect.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/npmx-redirect.user.js
// @match        https://www.npmjs.com/package/*
// @match        https://npmx.dev/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function(){'use strict';var e=`utm_source`,t=`npmx`;function n(n){return n.hostname===`www.npmjs.com`&&n.pathname.startsWith(`/package/`)&&n.searchParams.get(e)!==t}function r(e){let t=new URL(e.pathname+e.hash,`https://npmx.dev`);location.replace(t.href)}function i(n=document){for(let r of n.querySelectorAll(`a[href*="npmjs.com/package/"]:not([data-jkker-npmx-patched])`))try{let n=new URL(r.href);if(n.hostname!==`www.npmjs.com`||!n.pathname.startsWith(`/package/`))continue;n.searchParams.set(e,t),r.href=n.href,r.dataset.jkkerNpmxPatched=`true`}catch{}}function a(){let e=()=>{i(),new MutationObserver(e=>{for(let t of e)for(let e of t.addedNodes)e instanceof Element&&i(e)}).observe(document.body,{childList:!0,subtree:!0})};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,e,{once:!0}):e()}var o=new URL(location.href);n(o)?r(o):o.hostname===`npmx.dev`&&a()})();
