// ==UserScript==
// @name         Bing Direct Links
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.0.0
// @author       jkker
// @description  Replace Bing tracking result links with their real destination URLs.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/bing-direct-links.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/bing-direct-links.user.js
// @match        https://www.bing.com/search*
// @match        https://*.bing.com/search*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function(){'use strict';var e=`https://www.bing.com/ck/a?`,t=5e3,n=new Map,r=new Map;function i(t){return t.href.startsWith(e)||t.hostname.endsWith(`.bing.com`)&&t.pathname===`/ck/a`}function a(e){let t=e.match(/\b(?:var\s+)?u\s*=\s*"([^"]+)"/u)?.[1];return t?t.replaceAll(`\\/`,`/`):(e.match(/http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)/iu)?.[1])?.replaceAll(`&amp;`,`&`)}async function o(e){let i=n.get(e);if(i)return i;let o=r.get(e);if(o)return o;let s=new AbortController,c=window.setTimeout(()=>s.abort(),t),l=fetch(e,{credentials:`same-origin`,signal:s.signal}).then(e=>e.text()).then(a).then(t=>(t&&n.set(e,t),t)).catch(()=>void 0).finally(()=>{window.clearTimeout(c),r.delete(e)});return r.set(e,l),l}async function s(e){if(e.dataset.jkkerBingDirect===`done`)return;let t;try{t=new URL(e.href)}catch{return}if(!i(t))return;e.dataset.jkkerBingDirect=`pending`;let n=await o(t.href);if(!n){delete e.dataset.jkkerBingDirect;return}e.dataset.jkkerBingOriginalHref=t.href,e.href=n,e.rel=[e.rel,`noreferrer`].filter(Boolean).join(` `),e.dataset.jkkerBingDirect=`done`}function c(e=document){for(let t of e.querySelectorAll(`a[href*="/ck/a?"]`))s(t)}function l(){c(),new MutationObserver(e=>{for(let t of e)for(let e of t.addedNodes)e instanceof HTMLAnchorElement?s(e):e instanceof Element&&c(e)}).observe(document.body,{childList:!0,subtree:!0})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,l,{once:!0}):l()})();
