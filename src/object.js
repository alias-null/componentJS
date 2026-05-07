import {
   gb_window as window,
   gb_document as document,
} from "./param.js";

// Object
const objectPrototypeTostring = Object.prototype.toString;

export const promiseResolve = (a) => Promise.resolve(a);
export const func = (a) => Function(a);
export const getType = (a) => slice(objectPrototypeTostring.call(a), 8, -1);
export const href = (a) => a.href;
export const size = (a) => a.size;
export const length = (a) => a.length;
export const trim = (a) => a.trim();
export const terkeys = (a) => a.keys();
export const terValues = (a) => a.values();
export const toLowerCase = (a) => a.toLowerCase();
export const toUpperCase = (a) => a.toUpperCase();
export const keys = (a) => Object.keys(a);
export const pop = (a) => a.pop();
export const push = (a, b) => a.push(b);
export const join = (a, b) => a.join(b);
export const indexOf = (a, b) => a.indexOf(b);
export const lastIndexOf = (a, b) => a.lastIndexOf(b);
export const assign = (a, b) => Object.assign(a, b);
export const get = (a, b) => a.get(b);
export const set = (a, b, c) => a.set(b, c);
export const apply = (a, b, c) => a.apply(b, c);
export const slice = (a, b, c) => a.slice(b, c);
export const split = (a, b, c) => a.split(b, c);
export const filter = (a, b, c) => a.filter(b, c);
export const substring = (a, b, c) => a.substring(b, c);
export const replace = (a, b, c) => a.replace(b, c);
export const replaceAll = (a, b, c) => a.replaceAll(b, c);
export const newMap = () => new Map();
export const newSet = () => new Set();
export const newWeakMap = () => new WeakMap();
export const newWeakSet = () => new WeakSet();


// 验证
export const isArr = (a) => Array.isArray(a);
export const isMap = (a) => getType(a) === 'Map';
export const isSet = (a) => getType(a) === 'Set';
export const isStr = (a) => typeof a === 'string';
export const isObj = (a) => getType(a) === 'Object';
export const isFun = (a) => getType(a) === 'Function';
export const isPxy = (a) => indexOf(getType(a), 'Proxy') === 0;
export const isWmap = (a) => getType(a) === 'WeakMap';
export const isWset = (a) => getType(a) === 'WeakSet';

// string 
export const arg = (a) => `arguments[${a}]`;

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
export const remove = (a) => a.remove();
export const cloneNode = (a, b) => a.cloneNode(b);
export const appendChild = (a, b) => a.appendChild(b);
export const insertBefore = (a, b, c) => a.insertBefore(b, c);
export const createElement = (a) => document.createElement(a);
export const createTextNode = (a) => document.createTextNode(a);
export const getAttribute = (a, b) => a.getAttribute(b);
export const hasAttribute = (a, b) => a.hasAttribute(b);
export const removeAttribute = (a, b) => a.removeAttribute(b);
export const setAttribute = (a, b, c) => a.setAttribute(b, c);
export const querySelector = (a, b) => a.querySelector(b);
export const querySelectorAll = (a, b) => a.querySelectorAll(b);
export const addEventListener = (a, b, c, d) => a.addEventListener(b, c, d);
export const getAttributeRemove = (a, b) => {
   let s = getAttribute(a, b);
   removeAttribute(a, b);
   return s;
};

// regex
export const test = (a, b) => a.test(b);
export const match = (a, b) => b.match(a);
export const matchAll = (a, b) => b.matchAll(a);