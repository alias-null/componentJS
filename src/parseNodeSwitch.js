
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import parseChildNode from './parseChildNode.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';
import removeComOldNodes from './removeComOldNodes.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeSwitch = ($this, pcf, node) => {
   let _isbreak = _obj.hasAttribute(node, gb_break) ? gb_break
      : (_obj.hasAttribute(node, gb_continue) ? gb_continue : '');

   let nodelist = _obj.childNodes(_obj.content(node));
   let arrconf = [];
   for (let i = 0, il = _obj.length(nodelist); i < il; i++) {
      let dom = nodelist[i];
      let atr = _obj.getAttribute(dom, '.');
      let isbreak = _obj.hasAttribute(dom, gb_break)
         ? gb_break : (_obj.hasAttribute(dom, gb_continue)
            ? gb_continue : _isbreak);
      if (isbreak) {
         isbreak += ';';
      }
      _obj.push(arrconf, {
         // n: cloneNode(content(dom), true),
         n: _obj.content(dom),
         c: atr ? atr : '',
         b: isbreak,
         m: _obj.getAttribute(dom, '-'),
      });
   }

   let com0 = _obj.cloneNode(gb_domcom);
   let com1 = _obj.cloneNode(gb_domcom);

   let conf = createNodeConf(com1, pcf);
   conf.b[10] = _obj.getAttribute(node, '.');
   conf.b[11] = arrconf;
   conf.b[20] = com0;
   conf.b[21] = com1;
   conf.e = insertCommAuchToNode;
   conf.f = ($this, cf) => {
      let prop = cf.b[10];
      let arrconf = cf.b[11];
      let com0 = cf.b[20];
      let com1 = cf.b[21];

      if (!cf.b[9]) {
         let aks = _obj.keys(cf.a);
         let sexp = codeExpScope(aks, 0);
         let loop = _reg.reg3.test(cf.b[10])
            ? codeAssignToPcf(aks, 0) : '';

         let code = [];
         for (let i = 0, l = _obj.length(arrconf); i < l; i++) {
            let obj = arrconf[i];
            let lop = obj.b ? loop : (i + 1 === l ? loop : '');
            _obj.push(code, `${obj.m}\x20${obj.c}:${lop}${gb_arg1}(${i});${obj.b}`);
         }

         cf.b[9] =
            _obj.func(`${sexp}switch(${prop}){${_obj.join(code, '')}}`);
      }

      removeComOldNodes(com0, com1);

      cf.b[9].call($this, cf, (k) => {
         parseChildNode($this, cf, arrconf[k].n, true);
      });
   };
   _obj.push(pcf.c, conf);
};

export default parseNodeSwitch;