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

(function() {
  'use strict';
	var BYPASS_KEY = "utm_source";
	var BYPASS_VALUE = "npmx";
	function shouldRedirectFromNpm(url) {
		return url.hostname === "www.npmjs.com" && url.pathname.startsWith("/package/") && url.searchParams.get(BYPASS_KEY) !== BYPASS_VALUE;
	}
	function redirectToNpmx(url) {
		const destination = new URL(url.pathname + url.hash, "https://npmx.dev");
		location.replace(destination.href);
	}
	function patchNpmLinks(root = document) {
		for (const link of root.querySelectorAll(`a[href*="npmjs.com/package/"]:not([data-jkker-npmx-patched])`)) try {
			const url = new URL(link.href);
			if (url.hostname !== "www.npmjs.com" || !url.pathname.startsWith("/package/")) continue;
			url.searchParams.set(BYPASS_KEY, BYPASS_VALUE);
			link.href = url.href;
			link.dataset.jkkerNpmxPatched = "true";
		} catch {}
	}
	function observeNpmxLinks() {
		const start = () => {
			patchNpmLinks();
			new MutationObserver((mutations) => {
				for (const mutation of mutations) for (const node of mutation.addedNodes) if (node instanceof Element) patchNpmLinks(node);
			}).observe(document.body, {
				childList: true,
				subtree: true
			});
		};
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
		else start();
	}
	var currentUrl = new URL(location.href);
	if (shouldRedirectFromNpm(currentUrl)) redirectToNpmx(currentUrl);
	else if (currentUrl.hostname === "npmx.dev") observeNpmxLinks();
})();
