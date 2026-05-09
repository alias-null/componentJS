
const $null = () => null;
const $s_Map = () => 'Map';
const $s_Set = () => 'Set';
const $s_Array = () => 'Array';
const $s_String = () => 'String';
const $s_Number = () => 'Number';
const $s_Object = () => 'Object';
const $s_Proxy = () => 'Proxy';
const $s_Function = () => 'Function';
const $s_Attribute = () => 'Attribute';
const $s_attrname = () => 'html';
const $s_onload = () => 'onload';
const $s_onunload = () => 'onunload';
const $s_onadopt = () => 'onadopt';
const $s_template = () => 'template';
const $s_continue = () => 'continue';
const $s_break = () => 'break';

export const o_window = window;
export const o_document = document;
export const o_comment = o_document.createComment('');
export const o_customElements = customElements;
export const o_undf = o_document[o_window];
export const o_null = $null();

export const o_eventconf = { once: true, capture: true };
export const o_obsconf = { childList: true, subtree: true };

export const o_mods = new Map(); // 全局级别

export const o_custempname = {
   'if': 1,
   'else': 1,
   'for': 1,
   'switch': 1,
   'case': 1,
   'default': 1,
};

export const o_pxymth = {
   // Array
   'copyWithin': 1,
   'fill': 1,
   'pop': 1,
   'push': 1,
   'reverse': 1,
   'shift': 1,
   'sort': 1,
   'splice': 1,
   'unshift': 1,


   // Set | Map
   'add': 1,
   'set': 1,
   'clear': 1,
   'delete': 1,
};

export const s_Map = $s_Map();
export const s_Set = $s_Set();
export const s_Array = $s_Array();
export const s_String = $s_String();
export const s_Number = $s_Number();
export const s_Object = $s_Object();
export const s_Proxy = $s_Proxy();
export const s_Function = $s_Function();
export const s_Attribute = $s_Attribute();
export const s_attrname = $s_attrname();
export const s_onload = $s_onload();
export const s_onunload = $s_onunload();
export const s_onadopt = $s_onadopt();
export const s_template = $s_template();
export const s_continue = $s_continue();
export const s_break = $s_break();
export const s_usestrict = "'use strict';";

const o_pxytype = {};
o_pxytype[s_Array] = 1;
o_pxytype[s_Object] = 1;
o_pxytype[s_Set] = 1;
o_pxytype[s_Map] = 1;
export { o_pxytype };
