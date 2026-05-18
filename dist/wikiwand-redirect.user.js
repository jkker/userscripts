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

(function() {
  'use strict';
	var SKIPPED_PREFIXES = [
		"Special:",
		"Talk:",
		"User:",
		"User_talk:",
		"Wikipedia:",
		"File:",
		"MediaWiki:",
		"Template:",
		"Help:",
		"Category:",
		"Portal:",
		"Draft:",
		"TimedText:",
		"Module:"
	];
	function languageFromHost(hostname) {
		const parts = hostname.split(".");
		if (parts[0] === "www") parts.shift();
		return parts.length > 2 ? parts[0] ?? "en" : "en";
	}
	var article = decodeURIComponent(location.pathname.replace(/^\/wiki\//u, ""));
	if (!(!article || SKIPPED_PREFIXES.some((prefix) => article.startsWith(prefix)))) {
		const language = languageFromHost(location.hostname);
		const destination = new URL(`/${language}/${encodeURIComponent(article).replaceAll("%2F", "/")}`, "https://www.wikiwand.com");
		destination.hash = location.hash;
		location.replace(destination.href);
	}
})();
