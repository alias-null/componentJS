
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeSwitch = ($this, pcf, node) => {
   let _isbreak = hasAttribute(node, gb_break) ? gb_break
      : (hasAttribute(node, gb_continue) ? gb_continue : '');

   let nodelist = childNodes(content(node));
   let arrconf = [];
   for (let i = 0, il = length(nodelist); i < il; i++) {
      let dom = nodelist[i];
      let atr = getAttribute(dom, '.');
      let isbreak = hasAttribute(dom, gb_break)
         ? gb_break : (hasAttribute(dom, gb_continue)
            ? gb_continue : _isbreak);
      if (isbreak) {
         isbreak += ';';
      }
      push(arrconf, {
         // n: cloneNode(content(dom), true),
         n: content(dom),
         c: atr ? atr : '',
         b: isbreak,
         m: getAttribute(dom, '-'),
      });
   }

   let com0 = cloneNode(gb_domcom);
   let com1 = cloneNode(gb_domcom);

   let conf = createNodeConf(com1, pcf);
   conf.b[10] = getAttribute(node, '.');
   conf.b[11] = arrconf;
   conf.b[20] = com0;
   conf.b[21] = com1;
   conf.j = scope;
   conf.i = savepx;
   conf.e = (cf) => {
      assignScope($this, cf);
      let pm = cf.p.m;
      if (nodeType(pm) === 8) {
         let pn = parentNode(pm);
         insertBefore(pn, cf.b[20], pm);
         insertBefore(pn, cf.b[21], pm);
      } else {
         appendChild(pm, cf.b[20]);
         appendChild(pm, cf.b[21]);
      }
   };
   conf.f = ($this, cf) => {
      if (cf.j) {
         cf.j = false;
         assignScope($this, cf);
      }

      let prop = cf.b[10];
      let arrconf = cf.b[11];
      let com0 = cf.b[20];
      let com1 = cf.b[21];

      if (!cf.b[9]) {
         let aks = keys(cf.a);
         let sexp = codeExpScope(aks, 0);
         let loop = _reg.reg3.test(cf.b[10])
            ? assignvalpdomrec(aks, 0) : '';

         let code = [];
         for (let i = 0, l = length(arrconf); i < l; i++) {
            let obj = arrconf[i];
            let lop = obj.b ? loop : (i + 1 === l ? loop : '');
            push(code, `${obj.m}\x20${obj.c}:${lop}${gb_arg1}(${i});${obj.b}`);
         }

         cf.b[9] =
            func(`${sexp}switch(${prop}){${code.join('')}}`);
      }

      removeOldNodes(com0, com1);

      cf.b[9].call($this, cf, (k) => {
         parseChildNode($this, cf, arrconf[k].n, true);
      });
      // try {
      //    removeOldNodes(com0, com1);

      //    cf.b[9].call($this, cf, (k) => {
      //       cf.b[40] = arrconf[k].c;
      //       parseChildNode($this, cf, arrconf[k].n, true);
      //    });
      // } catch (e) {
      //    console.log(e);
      //    throw new Error(cf.b[40]);
      // }
   };
   push(pcf.c, conf);
};

export default parseNodeSwitch;