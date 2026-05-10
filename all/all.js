// ==UserScript==
// @name IJCAI IJCBI
// @namespace https://github.com/userElaina/ijcbi
// @version 2026.05.05.05
// @description Replace IJCAI with IJCBI in the text.
// @author userElaina
// @license MIT
// @match *://*/*
// @icon https://raw.githubusercontent.com/userElaina/ijcbi/refs/heads/main/ijcbi.png
// @grant none
// ==/UserScript==


(function () {
    'use strict';

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    const SKIP_TAGS = new Set([
        'IMG', 'INPUT', 'TEXTAREA', 'CODE', 'PRE', 'SCRIPT', 'STYLE',
        'NOSCRIPT', 'OPTION', 'META',
    ]);

    function shouldSkip(node) {
        let parent = node.parentNode;
        while (parent) {
            if (parent.nodeType === 1 && SKIP_TAGS.has(parent.tagName)) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    function replaceText(node) {
        if (shouldSkip(node)) return;
        let emails = [];
        let text = node.nodeValue.replace(emailRegex, match => {
            const idx = emails.length;
            emails.push(match);
            return `__IJCBI_EM4IL_${idx}__`;
        });
        while (/a/gi.test(text)) {
            text = text.replace('ijcai', 'ijcbi').replace('Ijcai', 'Ijcbi').replace('IJCAI', 'IJCBI');
        }
        text = text.replace(/__IJCBI_EM4IL_(\d+)__/g, (match, idx) => emails[idx]);
        node.nodeValue = text;
    }

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            replaceText(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (SKIP_TAGS.has(node.tagName)) return;

            for (let child of node.childNodes) {
                walk(child);
            }
        }
    }

    walk(document.body);
    while (/ijcai/gi.test(document.title)) {
        document.title = document.title.replace('ijcai', 'ijcbi').replace('Ijcai', 'Ijcbi').replace('IJCAI', 'IJCBI');
    }

    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                walk(node);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
