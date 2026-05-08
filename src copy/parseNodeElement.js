
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import insertNodeAuchToNode from './insertNodeAuchToNode.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {Object} pcf
 * @param {Node} node
 * @param {String} name
 */
const parseNodeElement = ($this, pcf, node, name) => {
   let bind = _obj.getAttributeRemove(node, '#');
   let prop = _obj.getAttributeRemove(node, '.');
   let attr = _obj.getAttributeRemove(node, '..');
   let ater = [];

   let conf = createNodeConf(node, node, pcf);
   conf.d = [];
   conf.u = name;
   conf.b[0] = bind;
   conf.e = insertNodeAuchToNode;
   conf.f = ($this, cf) => {
      if (!cf.b[9]) {
         let bind = cf.b[0];
         if (bind && $this.$vd[bind]) {
            $this.$vd[bind].val = cf.n;
         }
         cf.b[9] = true;
      }
   };
   pcf.c.set(node, conf);

   // 属性解析
   if (prop) {
      _obj.push(ater, {
         w: _obj.matchAll(_reg.reg4, prop),
         x: (a, b) => `${a}=${b}`,
         y: (a) => a,
      });
   }
   if (attr) {
      _obj.push(ater, {
         w: _obj.matchAll(_reg.reg4, attr),
         x: (a, b) => `setAttribute('${a}',${b})`,
         y: (a) => `getAttribute('${a}')`,
      });
   }

   // 共用父节点作用域 所以使用 _obj.arg(1)
   let ag01 = _obj.arg(1) + '.m';
   let ag99 = _obj.arg(99);
   for (let i = 0, l = _obj.length(ater); i < l; i++) {
      for (let a of ater[i].w) {
         a[2] = _obj.trim(a[2]);

         let { x, y } = ater[i];

         let scf = createNodeConf(conf.m, _pam.o_null, conf);
         scf.s = false;
         scf.b[0] = a[2];
         scf.b[1] = `${ag99}=${a[2]};if(${ag99}!==${ag01}.${y(a[1])}){${ag01}.${x(a[1], ag99)};}`;
         // scf.b[1] = `${ag99}=${a[2]};${ag01}.${x(a[1], ag99)};`;
         scf.f = ($this, cf) => {
            if (!cf.b[9]) {
               // 共用父节点作用域
               let aks = _obj.keys(cf.p.a);
               let sexp = codeExpScope(aks, 0);
               let loop = _obj.test(_reg.reg3, cf.b[0])
                  ? codeAssignToPcf(aks, 0) : '';

               // 共用父节点作用域 所以使用 _obj.arg(1)
               cf.b[9] = _obj.func(`${sexp}${cf.b[1]}${loop}`);
            }
            // 共用父节点作用域
            cf.b[9].call($this, cf.p, cf);
         };
         _obj.push(conf.d, scf);
      }
   }
};

export default parseNodeElement;