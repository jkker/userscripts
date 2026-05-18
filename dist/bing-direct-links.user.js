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

(function() {
  'use strict';
	var BING_REDIRECT_PREFIX = "https://www.bing.com/ck/a?";
	var REQUEST_TIMEOUT_MS = 5e3;
	var resolvedUrls = new Map();
	var pendingUrls = new Map();
	function isBingRedirect(url) {
		return url.href.startsWith(BING_REDIRECT_PREFIX) || url.hostname.endsWith(".bing.com") && url.pathname === "/ck/a";
	}
	function readDestinationFromHtml(html) {
		const quoted = html.match(/\b(?:var\s+)?u\s*=\s*"([^"]+)"/u)?.[1];
		if (quoted) return quoted.replaceAll("\\/", "/");
		return (html.match(/http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)/iu)?.[1])?.replaceAll("&amp;", "&");
	}
	async function resolveRedirect(href) {
		const resolved = resolvedUrls.get(href);
		if (resolved) return resolved;
		const pending = pendingUrls.get(href);
		if (pending) return pending;
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
		const request = fetch(href, {
			credentials: "same-origin",
			signal: controller.signal
		}).then((response) => response.text()).then(readDestinationFromHtml).then((destination) => {
			if (destination) resolvedUrls.set(href, destination);
			return destination;
		}).catch(() => void 0).finally(() => {
			window.clearTimeout(timeout);
			pendingUrls.delete(href);
		});
		pendingUrls.set(href, request);
		return request;
	}
	async function rewriteLink(link) {
		if (link.dataset.jkkerBingDirect === "done") return;
		let url;
		try {
			url = new URL(link.href);
		} catch {
			return;
		}
		if (!isBingRedirect(url)) return;
		link.dataset.jkkerBingDirect = "pending";
		const destination = await resolveRedirect(url.href);
		if (!destination) {
			delete link.dataset.jkkerBingDirect;
			return;
		}
		link.dataset.jkkerBingOriginalHref = url.href;
		link.href = destination;
		link.rel = [link.rel, "noreferrer"].filter(Boolean).join(" ");
		link.dataset.jkkerBingDirect = "done";
	}
	function scan(root = document) {
		for (const link of root.querySelectorAll("a[href*=\"/ck/a?\"]")) rewriteLink(link);
	}
	function init() {
		scan();
		new MutationObserver((mutations) => {
			for (const mutation of mutations) for (const node of mutation.addedNodes) if (node instanceof HTMLAnchorElement) rewriteLink(node);
			else if (node instanceof Element) scan(node);
		}).observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
	else init();
})();
