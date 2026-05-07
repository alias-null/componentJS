
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import removeComOldNodes from './removeComOldNodes.js';
import parseChildNode from './parseChildNode.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeIfelse = ($this, pcf, node) => {
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
};

export default parseNodeIfelse;