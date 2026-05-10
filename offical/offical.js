// ==UserScript==
// @name IJCAI IJCBI dot org
// @namespace https://github.com/userElaina/ijcbi
// @version 2026.05.10.01
// @description Replace A with B in the text on the IJCAI official website.
// @author userElaina
// @license MIT
// @match *://*.ijcai.org/*
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
            text = text.replace('a', 'b').replace('A', 'B');
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
    while (/a/gi.test(document.title)) {
        document.title = document.title.replace('a', 'b').replace('A', 'B');
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

    if (window.location.href.indexOf("2026.ijcai.org") > -1) {
        let pth_str = 'https://raw.githubusercontent.com/userElaina/ijcbi/refs/heads/main/offical/ijcbi-2026.png';
        let logo = document.querySelector("img[class='custom-logo']");
        if (logo) {
            logo.src = pth_str;
            logo.srcset = pth_str;
        }
        let logo2 = document.querySelector("img[class='alignnone wp-image-1952']");
        if (logo2) {
            logo2.src = pth_str;
            logo2.srcset = pth_str;
        }
    }

    if (window.location.href.startsWith('https://www.ijcai.org/')) {
        let logo = document.getElementById("logo");
        if (logo) {
            if (logo.childElementCount > 0) {
                if (logo.children[0].childElementCount > 0) {
                    logo.childNodes[0].childNodes[0].src = 'https://raw.githubusercontent.com/userElaina/ijcbi/refs/heads/main/offical/ijcbi-logo.png';
                }
            }
        }
        document.querySelectorAll("img").forEach(img => {
            if (img.src.includes("sponsors")) {
                if (img.src.includes("huawei")) {
                    img.src = 'https://raw.githubusercontent.com/userElaina/ijcbi/refs/heads/main/offical/hubwei.png';
                } else if (img.src.includes("baidu")) {
                    img.src = 'https://raw.githubusercontent.com/userElaina/ijcbi/refs/heads/main/offical/bbidu.png';
                }
            }
        });
    }

})();
