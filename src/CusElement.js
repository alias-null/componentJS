
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import parseTemplate from './parseTemplate.js';
import createProxy from './createProxy.js';

class CusElement extends HTMLElement {
   $cf = {};
   $vd = {};
   $fp = new WeakMap();
   $sd = _pam.gb_null;
   $fc = _pam.gb_null;
   $fn = () => { };

   constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      let class_old = customElements.get(
         _obj.toLowerCase(_obj.nodeName(this))
      );
      this.$cf = class_old.$cf;
      this.$sd = this.shadowRoot;
      let h = _obj.href(this.$cf);
      if (h) {
         _obj.setAttribute(this, this.$cf.attr, h);
      }
      parseTemplate(this);
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

   module = (s) => {
      let m = _pam.gb_modules.get(s);
      if (_obj.isStr(m)) {
         m = _pam.gb_modules.get(m);
      }
      return m;
   };

   // class方法依赖 this 必用箭头函数
   called = (c) => {
      this.$fn = c;
   };

   // class方法依赖 this 必用箭头函数
   val = (param) => {
      if (_obj.isPxy(param)) {
         return param;
      }
      let top = { val: param };
      top._ = top;
      return createProxy(this, top);
   };
}

export default CusElement;