// ==UserScript==
// @name         Wikiwand Redirect
// @namespace    https://github.com/jkker/userscripts.git
// @version      1.0.0
// @author       jkker
// @description  Redirect Wikipedia article pages to the matching Wikiwand article.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @source       https://github.com/jkker/userscripts.git
// @supportURL   https://github.com/jkker/userscripts/issues
// @downloadURL  https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/wikiwand-redirect.user.js
// @updateURL    https://raw.githubusercontent.com/jkker/userscripts/HEAD/dist/wikiwand-redirect.user.js
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function(){'use strict';var e=[`Special:`,`Talk:`,`User:`,`User_talk:`,`Wikipedia:`,`File:`,`MediaWiki:`,`Template:`,`Help:`,`Category:`,`Portal:`,`Draft:`,`TimedText:`,`Module:`];function t(e){let t=e.split(`.`);return t[0]===`www`&&t.shift(),t.length>2?t[0]??`en`:`en`}var n=decodeURIComponent(location.pathname.replace(/^\/wiki\//u,``));if(!(!n||e.some(e=>n.startsWith(e)))){let e=t(location.hostname),r=new URL(`/${e}/${encodeURIComponent(n).replaceAll(`%2F`,`/`)}`,`https://www.wikiwand.com`);r.hash=location.hash,location.replace(r.href)}})();
