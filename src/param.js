

export const gb_window = window;
export const gb_document = document;
export const gb_undf = gb_document[gb_window];
export const gb_null = null;

export const gb_event_once_conf = { once: true, capture: true };
export const gb_dom_obs_conf = { childList: true, subtree: true };

export const gb_parseto_template = new Set([
   'if', 'else', 'for',
   'switch', 'case', 'default',
]);

export const gb_mutating_mth = new Set([
   // Array
   'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift',

   // Set
   'add', 'clear', 'delete',

   // Map
   'clear', 'delete', 'set'
]);

export const gb_attrname = 'html';
export const gb_onload = 'onload';
export const gb_onunload = 'onunload';
export const gb_onadopt = 'onadopt';
export const gb_template = 'template';
export const gb_continue = 'continue';
export const gb_break = 'break';
export const gb_use_strict = "'use strict';";
export const gb_domcom = gb_document.createComment('');
export const gb_modules = new Map(); // 全局级别