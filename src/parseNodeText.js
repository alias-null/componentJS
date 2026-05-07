
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import createNodeConf from './createNodeConf.js';
import insertNodeAuchToNode from './insertNodeAuchToNode.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @param {String} name
 * @returns 
 */
const parseNodeText = ($this, pcf, node, name) => {
   _obj.remove(node);

   let val = _obj.trim(node.nodeValue);
   let arr = [];
   let len;
   val = _obj.replace(val, _reg.reg0, (m) => {
      _obj.push(arr, m);
      return '${}';
   });
   val = _obj.split(val, _reg.reg2);

   len = _obj.length(val);
   while (len--) {
      let str = val[len];
      if (str) {
         let cnode = _obj.createTextNode(str);
         let conf = createNodeConf(cnode, cnode, pcf);
         conf.u = name;
         conf.s = false;
         conf.e = insertNodeAuchToNode;
         val[len] = conf;
      } else {
         val[len] = _pam.gb_null;
      }
   }

   // 共用父节点作用域 所以使用 _obj.arg(1)
   let op_arg = _obj.arg(1) + '.m.nodeValue';
   let va_arg = _obj.arg(99);

   len = _obj.length(arr);
   while (len--) {
      let idx = len + 1;
      if (_obj.trim(_obj.slice(arr[len], 2, -1))) {
         let cnode = _obj.createTextNode('');
         let conf = createNodeConf(cnode, cnode, pcf);
         conf.u = name;
         conf.s = false;
         conf.b[0] = arr[len];
         conf.b[2] = `${va_arg}=\`${conf.b[0]}\`;if(${op_arg}!==${va_arg}){${op_arg}=${va_arg}`;
         conf.e = insertNodeAuchToNode;
         conf.f = ($this, cf) => {
            if (!cf.b[9]) {
               // 共用父节点作用域
               let aks = _obj.keys(cf.p.a);
               let sexp = codeExpScope(aks, 0);
               let loop = _obj.test(_reg.reg3, cf.b[0])
                  ? codeAssignToPcf(aks, 0) : '';

               // console.log(`${sexp}${cf.b[2]}${loop}}`);
               cf.b[9] =
                  _obj.func(`${sexp}${cf.b[2]}${loop}}`);
            }

            // 共用父节点作用域
            cf.b[9].call($this, cf.p, cf);
         };
         val.splice(idx, 0, conf);
      } else {
         val.splice(idx, 0, _pam.gb_null);
      }
   }

   for (let i = 0, l = _obj.length(val); i < l; i++) {
      let scf = val[i];
      if (scf) {
         pcf.c.set(scf.n, scf);
      }
   }
};

export default parseNodeText;