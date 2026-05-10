import {
   o_window as window,
   o_document as document,
} from "./param.js";

import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import fetchComponentGen from './fetchComponentGen.js';
import parseBeforeHandle from './parseBeforeHandle.js';
import callConfRecF from './callConfRecF.js';
import createNodeConf from './createNodeConf.js';
import parseChildNode from './parseChildNode.js';
import assignScope from './assignScope.js';
import forGetTypeLen from "./forGetTypeLen.js";

/**
 * 
 * @param {HTMLElement} $this
 */
const parseTemplateFile = ($this) => {
   const domfratop = _obj.cloneNode(_obj.content($this.$cf.temp), true)
      , arr_ps_all = []
      , arr_ps_jsi = []
      , objtemplate = { if: [], for: [], switch: [] }
      , arr_tempif = objtemplate.if
      , arr_tempfor = objtemplate.for
      , arr_tempswitch = objtemplate.switch;

   fetchComponentGen(domfratop);

   parseBeforeHandle(
      $this,
      domfratop,
      arr_ps_all,
      arr_ps_jsi,
      objtemplate
   );

   // ifelse
   for (let i = 0, il = _obj.length(arr_tempif); i < il; i++) {
      let dom_a = arr_tempif[i];
      let arrdelete = [];
      let domtarget = _pam.o_null;
      let domcontent = _pam.o_null;
      while (dom_a) {
         let dom = dom_a;
         let typ = _obj.nodeType(dom);
         dom_a = _obj.nextSibling(dom_a);
         if (typ === 1) {
            let tag = _obj.getAttribute(dom, '-');
            if (tag === 'if' || tag === 'else') {
               let l = _obj.length(arrdelete);
               while (l--) { _obj.remove(arrdelete[l]); }
               arrdelete = [];
               if (tag === 'if' && domtarget === _pam.o_null) {
                  domtarget = _obj.cloneNode($this.$cf.temp);
                  domcontent = _obj.content(domtarget);
                  _obj.setAttribute(domtarget, '-', 'ifelse');
                  _obj.insertBefore(_obj.parentNode(dom), domtarget, dom);
               }
               _obj.appendChild(domcontent, dom);
            } else {
               _obj.push(arrdelete, dom);
            }
         } else {
            _obj.push(arrdelete, dom);
         }
         if (dom_a && _obj.nodeType(dom_a) === 1 && _obj.hasAttribute(dom_a, 'if')) {
            break;
         }
      }
      if (domcontent) {
         let nodelist = _obj.childNodes(domcontent);
         let lastsub = _obj.lastChild(domcontent);
         let arrdels = [];
         for (let j = 0, jl = _obj.length(nodelist); j < jl; j++) {
            let dom = nodelist[j];
            let tag = _obj.getAttribute(dom, '-');
            let str = _obj.getAttribute(dom, '.');
            if (str) {
               if (tag === 'else') {
                  _obj.setAttribute(dom, '-', tag + '\x20if');
               }
            } else if (dom !== lastsub) {
               _obj.push(arrdels, dom);
            }
         }
         let l = _obj.length(arrdels);
         while (l--) { _obj.remove(arrdels[l]); }
         if (_obj.getAttribute(nodelist[0], '-') !== 'if') {
            _obj.remove(domtarget);
            // _obj.textContentSet(domcontent, '');
         }
      }
   }

   // switch
   for (let i = 0, il = _obj.length(arr_tempswitch); i < il; i++) {
      let domtarget = arr_tempswitch[i];
      let str = _obj.getAttribute(domtarget, '.');
      if (!str) {
         _obj.remove(domtarget);
      } else {
         let domcontent = _obj.content(domtarget);
         let nodelist = _obj.childNodes(domcontent);
         let arrdels = [];
         for (let j = 0, jl = _obj.length(nodelist); j < jl; j++) {
            let dom = nodelist[j];
            let tag = _obj.getAttribute(dom, '-');
            let str = _obj.getAttribute(dom, '.');
            if (!str && tag !== 'default') {
               _obj.push(arrdels, dom);
            }
         }
         let l = _obj.length(arrdels);
         while (l--) { _obj.remove(arrdels[l]); }
      }
   }

   // for 
   for (let i = 0, il = _obj.length(arr_tempfor); i < il; i++) {
      let domtarget = arr_tempfor[i];
      if (!_obj.length(_obj.childNodes(_obj.content(domtarget)))) {
         _obj.remove(domtarget);
      } else {
         let str = _obj.getAttribute(domtarget, '.');
         if (!str
            || _obj.length(_obj.filter(_obj.split(str, /\s+/g), v => v !== '')) < 2) {
            _obj.remove(domtarget);
         }
      }
   }

   let pcf = createNodeConf($this, $this, _pam.o_null);

   let conf = createNodeConf($this.$sd, $this.$sd, pcf);
   conf.c = _obj.newMap();
   pcf.c.set($this.$sd, conf);

   parseChildNode($this, conf, domfratop);

   Promise.allSettled(arr_ps_all).then(list => {
      for (let i = _obj.length(list) - 1; i >= 0; i--) {
         let val = list[i].value;
         if (_obj.isStr(val)) {
            let rs = _obj.func(_pam.s_usestrict + val).call($this);
            if (_obj.isObj(rs)) {
               _obj.assign($this.$vd, rs);
            }
         } else if (_obj.isObj(val)) {
            if (val.h) {
               _pam.o_mods.set(val.h, val.o);
               if (val.s !== val.h) {
                  _pam.o_mods.set(val.s, val.h);
               }
            } else if (val.o) {
               if ($this.$cf[val.s] === _pam.o_undf) {
                  $this.$cf[val.s] = [];
               }
               _obj.push($this.$cf[val.s], _obj.func(_pam.s_usestrict + val.o));
            }
         }
      }

      if ($this.$cf[_pam.s_onload]) {
         let arr = $this.$cf[_pam.s_onload];
         for (let i = 0, l = _obj.length(arr); i < l; i++) {
            let rs = arr[i].call($this);
            if (_obj.isObj(rs)) {
               _obj.assign($this.$vd, rs);
            }
         }
      }

      callConfRecF($this, new Map([[$this.$sd, conf]]), ($this, cf) => {
         if (cf.s) {
            assignScope($this, cf);
         }
      });

      // after call 
      $this.$fn();

      // new Map([
      //    ['dom-0',
      //       {
      //          a: {},
      //          b: {},
      //          c: new Map([
      //             ['dom-0',
      //                {
      //                   c: new Map()
      //                }
      //             ]
      //          ]),
      //          d: [{a,b,c...},{...},{...}...],
      //          e: () => { },
      //          f: () => { },
      //       }
      //    ],
      //    ['dom-1',
      //       {
      //          c: new Map([
      //             [

      //             ]
      //          ])
      //       }
      //    ],
      // ]);
   });
};

export default parseTemplateFile;