
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import parseTemplateFile from './parseTemplateFile.js';
import createProxy from './createProxy.js';

class CusElement extends HTMLElement {
   $cf = {};
   $vd = {};
   $fp = new WeakMap();
   $sd = _pam.o_null;
   $fc = _pam.o_null;
   $fn = () => { };

   constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      let class_old = _pam.o_customElements.get(
         _obj.toLowerCase(_obj.nodeName(this))
      );
      this.$cf = class_old.$cf;
      this.$sd = this.shadowRoot;
      let h = _obj.href(this.$cf);
      if (h) {
         _obj.setAttribute(this, this.$cf.attr, h);
      }
      parseTemplateFile(this);
   }

   adoptedCallback() {
      if (this.$cf.onadopt) {
         let arr = this.$cf.onadopt;
         for (let i = 0, l = _obj.length(arr); i < l; i++) {
            arr[i].call(this);
         }
      }
   }

   disconnectedCallback() {
      if (this.$cf.unload) {
         let arr = this.$cf.unload;
         for (let i = 0, l = _obj.length(arr); i < l; i++) {
            arr[i].call(this);
         }
      }
   }

   connectedCallback() {
   }

   /**
    * 
    * @param {String} s 
    * @returns 
    */
   module = (s) => {
      let m = _pam.o_mods.get(s);
      if (_obj.isStr(m)) {
         m = _pam.o_mods.get(m);
      }
      return m;
   };

   // class方法依赖 this 必用箭头函数
   /**
    * 
    * @param {Function} c 
    */
   called = (c) => {
      this.$fn = c;
   };

   /**
    * 
    * @param {Array} a 
    */
   binded = (a) => {
      console.log(a);
   };

   /**
    * class方法依赖 this 必用箭头函数
    * @param {*} param 
    * @returns 
    */
   val = (param) => {
      return _obj.isPxy(param)
         ? param : createProxy(this, { val: param, $: this });
   };
}

export default CusElement;