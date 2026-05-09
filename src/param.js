
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

const o_pxytype = new Set();
o_pxytype.add(s_Array);
o_pxytype.add(s_Object);
o_pxytype.add(s_Set);
o_pxytype.add(s_Map);
export { o_pxytype };

export const o_custempname = new Set([
   'if',
   'else',
   'for',
   'switch',
   'case',
   'default',
]);

export const o_pxymth = new Set([
   // Array
   'copyWithin',
   'fill',
   'pop',
   'push',
   'reverse',
   'shift',
   'sort',
   'splice',
   'unshift',

   // Set | Map
   'add',
   'set',
   'clear',
   'delete',
]);
