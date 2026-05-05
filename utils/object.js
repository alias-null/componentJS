import {
   gb_window as window,
   gb_document as document,
} from "./param.js";

// Object
const objectPrototypeTostring = Object.prototype.toString;

export const getType = (a) => slice(objectPrototypeTostring.call(a), 8, -1);
export const href = (a) => a.href;
export const size = (a) => a.size;
export const length = (a) => a.length;
export const trim = (a) => a.trim();
export const pop = (a) => a.pop();
export const push = (a, b) => a.push(b);
export const remove = (a) => a.remove();
export const toLowerCase = (a) => a.toLowerCase();
export const toUpperCase = (a) => a.toUpperCase();
export const indexOf = (a, b) => a.indexOf(b);
export const keys = (a) => Object.keys(a);
export const assign = (a, b) => Object.assign(a, b);
export const slice = (a, b, c) => a.slice(b, c);

// Node 
export const content = (a) => a.content;
export const nodeName = (a) => a.nodeName;
export const nodeType = (a) => a.nodeType;
export const lastChild = (a) => a.lastChild;
export const firstChild = (a) => a.firstChild;
export const childNodes = (a) => a.childNodes;
export const parentNode = (a) => a.parentNode;
export const textContent = (a) => a.textContent;
export const nextSibling = (a) => a.nextSibling;
export const previousSibling = (a) => a.previousSibling;
export const textContentSet = (a, b) => a.textContent = b;
export const cloneNode = (a, b) => a.cloneNode(b);
export const appendChild = (a, b) => a.appendChild(b);
export const insertBefore = (a, b, c) => a.insertBefore(b, c);
export const createElement = (a) => document.createElement(a);
export const createTextNode = (a) => document.createTextNode(a);
export const getAttribute = (a, b) => a.getAttribute(b);
export const hasAttribute = (a, b) => a.hasAttribute(b);
export const removeAttribute = (a, b) => a.removeAttribute(b);
export const setAttribute = (a, b, c) => a.setAttribute(b, c);