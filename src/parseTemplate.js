
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import fetchComponentGen from './fetchComponentGen.js';
import parseBeforeHandle from './parseBeforeHandle.js';
import callConfRec_f from './callConfRec_f.js';
import createNodeConf from './createNodeConf.js';
import parseChildNode from './parseChildNode.js';
import assignScope from './assignScope.js';

/**
 * 
 * @param {HTMLElement} $this
 */
const parseTemplate = ($this) => {
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
      let domtarget = _pam.gb_null;
      let domcontent = _pam.gb_null;
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
               if (tag === 'if' && domtarget === _pam.gb_null) {
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
      let str = _obj.getAttribute(domtarget, '.');
      if (!str || !_obj.length(_obj.childNodes(_obj.content(domtarget)))) {
         _obj.remove(domtarget);
      }
   }


   let conf = createNodeConf($this.$sd, _pam.gb_null);

   parseChildNode($this, conf, domfratop);

   Promise.allSettled(arr_ps_all).then(list => {
      for (let i = _obj.length(list) - 1; i >= 0; i--) {
         let val = list[i].value;
         if (_obj.isStr(val)) {
            let rs = _obj.func(_pam.gb_use_strict + val).call($this);
            if (_obj.isObj(rs)) {
               _obj.assign($this.$vd, rs);
            }
         } else if (_obj.isObj(val)) {
            if (val.h) {
               _pam.gb_modules.set(val.h, val.o);
               if (val.s !== val.h) {
                  _pam.gb_modules.set(val.s, val.h);
               }
            } else if (val.o) {
               if ($this.$cf[val.s] === _pam.gb_undf) {
                  $this.$cf[val.s] = [];
               }
               _obj.push($this.$cf[val.s], _obj.func(_pam.gb_use_strict + val.o));
            }
         }
      }

      if ($this.$cf[_pam.gb_onload]) {
         let arr = $this.$cf[_pam.gb_onload];
         for (let i = 0, l = _obj.length(arr); i < l; i++) {
            let rs = arr[i].call($this);
            if (_obj.isObj(rs)) {
               _obj.assign($this.$vd, rs);
            }
         }
      }

      callConfRec_f($this, new Map([[$this.$sd, conf]]), ($this, cf) => {
         if (cf.t !== 3) {
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

export default parseTemplate;