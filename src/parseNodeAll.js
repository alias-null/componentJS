
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';
import insertNodeAuchToNode from './insertNodeAuchToNode.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import removeComOldNodes from './removeComOldNodes.js';
import parseChildNode from './parseChildNode.js';
import parseNodeElement from './parseNodeElement.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeAll = ($this, pcf, node) => {
   let type = _obj.nodeType(node);
   if (type === 1) {
      let tag = _obj.getAttribute(node, '-');
      if (_obj.nodeName(node) === 'TEMPLATE') {
         if (tag === 'ifelse') {
            let nodelist = _obj.childNodes(_obj.content(node));
            let arrconf = [];
            for (let i = 0, il = _obj.length(nodelist); i < il; i++) {
               let dom = nodelist[i];
               let atr = _obj.getAttribute(dom, '.');
               let isbreak = _obj.hasAttribute(dom, _pam.gb_break) ? _pam.gb_break
                  : (_obj.hasAttribute(dom, _pam.gb_continue) ? _pam.gb_continue : '');
               if (isbreak) {
                  isbreak += ';';
               }
               _obj.push(arrconf, {
                  // n: _obj.cloneNode(_obj.content(dom), true),
                  n: _obj.content(dom),
                  c: atr ? atr : '',
                  b: isbreak,
                  m: _obj.getAttribute(dom, '-'),
               });
            }

            let com0 = _obj.cloneNode(_pam.gb_domcom);
            let com1 = _obj.cloneNode(_pam.gb_domcom);

            let conf = createNodeConf(com1, pcf);
            // conf.b[10] = arrconf[0].c;
            conf.b[11] = arrconf;
            conf.b[12] = {};
            conf.b[13] = _pam.gb_null;
            conf.b[20] = com0;
            conf.b[21] = com1;
            conf.e = insertCommAuchToNode;
            conf.f = ($this, cf) => {
               // let prop = cf.b[10];
               let arrconf = cf.b[11];
               let com0 = cf.b[20];
               let com1 = cf.b[21];

               if (!cf.b[9]) {
                  let aks = _obj.keys(cf.a);
                  let sexp = codeExpScope(aks, 0);

                  let ag0 = _obj.arg(0);
                  let ag1 = _obj.arg(1);

                  let code = [];
                  for (let i = 0, l = _obj.length(arrconf); i < l; i++) {
                     let obj = arrconf[i];
                     if (obj.c) {
                        let loop = _obj.test(_reg.reg3, obj.c)
                           ? codeAssignToPcf(aks, 0) : '';
                        let loopf = loop ? `||(function(){${loop}}).call(this,${ag0})` : '';
                        _obj.push(code, `${obj.m}(${obj.c}${loopf}){${loop}${ag1}(${i});${obj.b}}`);
                     } else {
                        _obj.push(code, `${obj.m}{${ag1}(${i});${obj.b}}`);
                        arrconf.splice(i + 1);
                        break;
                     }
                  }

                  // console.log(`${sexp}${_obj.join(code, '')}`);
                  cf.b[9] =
                     _obj.func(`${sexp}${_obj.join(code, '')}`);
               }

               console.log(arrconf);
               let l = _obj.length(arrconf);
               cf.b[9].call($this, cf, (k) => {
                  cf.s = k;

                  // 缓存上一个条件分支
                  if (k !== cf.b[13]) {
                     cf.b[13] = k;
                     removeComOldNodes(com0, com1);
                  }
                  console.log(k);
                  console.log(cf);
                  // 解析子节点 生成配置
                  if (!cf.b[12][k]) {
                     parseChildNode($this, cf, arrconf[k].n);

                     let a = [cf.c];
                     while (_obj.length(a)) {
                        let c = _obj.terValues(_obj.pop(a));
                        for (let v of c) {
                           v.s = k;
                           console.log(v);
                           if (_obj.size(v.c)) {
                              _obj.push(a, v.c);
                           }
                        }
                     }

                     console.log(cf.c);

                     cf.b[12][k] = cf.c;

                     // console.log(cf.b[12]);
                     // console.log(cf.b[12][k]);
                  }
               });
            };
            pcf.c.set(node, conf);
         } else if (!pcf.c.has(node)) {
            parseNodeElement($this, pcf, node);
         }
      } else if (!pcf.c.has(node)) {
         parseNodeElement($this, pcf, node);
      }
   } else if (type === 3) {
      _obj.remove(node);

      let val = _obj.trim(node.nodeValue);
      let arr = [];
      let len;
      val = _obj.replace(val, _reg.reg0, (m) => {
         _obj.push(arr, m);
         return '${}';
      });
      val = val.split(_reg.reg2);

      len = _obj.length(val);
      while (len--) {
         let str = val[len];
         if (str) {
            let conf = createNodeConf(_obj.createTextNode(str), pcf, _pam.gb_null, _pam.gb_null);
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
            let conf = createNodeConf(_obj.createTextNode(''), pcf, _pam.gb_null, _pam.gb_null);
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
            pcf.c.set(scf.m, scf);
         }
      }
   }
};

export default parseNodeAll;