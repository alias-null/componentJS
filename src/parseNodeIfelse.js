
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import removeComOldNodes from './removeComOldNodes.js';
import parseChildNode from './parseChildNode.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';
import callConfFunRec from './callConfFunRec.js';
import assignScope from './assignScope.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @param {String} name
 * @returns 
 */
const parseNodeIfelse = ($this, pcf, node, name) => {
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
         g: _obj.getAttribute(dom, '-'),
      });
   }

   let com0 = _obj.cloneNode(_pam.gb_domcom);
   let com1 = _obj.cloneNode(_pam.gb_domcom);

   let conf = createNodeConf(com1, node, pcf);
   conf.u = name;
   conf.b[0] = arrconf;
   conf.b[8] = { s: com0, e: com1 };
   conf.b[10] = {};
   conf.b[11] = _pam.gb_null;
   conf.e = insertCommAuchToNode;
   conf.f = ($this, cf) => {
      let arrconf = cf.b[0];
      let com0 = cf.b[8].s;
      let com1 = cf.b[8].e;

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
               _obj.push(code, `${obj.g}(${obj.c}${loopf}){${loop}${ag1}(${i});${obj.b}}`);
            } else {
               _obj.push(code, `${obj.g}{${ag1}(${i});${obj.b}}`);
               arrconf.splice(i + 1);
               break;
            }
         }

         // console.log(`${sexp}${_obj.join(code, '')}`);
         cf.b[9] =
            _obj.func(`${sexp}${_obj.join(code, '')}`);
      }

      let realkey = _pam.gb_null;
      cf.b[9].call($this, cf, (k) => {
         realkey = k;
         console.log('ifelse ==>>', k);
         // 设置 ifelse 节点的分支标记
         if (cf.r !== k) {
            // 等于 true 说明是初始的状况
            if (cf.r !== true) {
               removeComOldNodes(com0, com1);
            }
            // 设置新的分支标记
            cf.r = k;
         }

         // 解析子节点 生成配置
         if (!cf.b[10][k]) {
            parseChildNode($this, cf, arrconf[k].n);
            cf.b[10][k] = cf.c;
            // 清空 ifelse 的 .c 避免被外部 call 因为条件分支不是全部一起执行
            cf.c = _obj.newMap();
         }

         // 先递归后代 修改 ifelse 后代节点的分支标记
         let a = [cf.b[10][k]];
         while (_obj.length(a)) {
            let c = _obj.terValues(_obj.pop(a));
            for (let v of c) {
               v.r = k;
               if (v.c && _obj.size(v.c)) {
                  _obj.push(a, v.c);
               }
               if (v.d) {
                  let l = _obj.length(v.d);
                  while (l--) { v.d[l].r = k; }
               }
            }
         }

         // 执行分支后代节点
         callConfFunRec($this, cf.b[10][k], ($this, cf) => {
            if (cf.s) {
               assignScope($this, cf);
            }
         });
      });

      if (realkey === _pam.gb_null) {
         removeComOldNodes(com0, com1);
         cf.r = _pam.gb_null;
      }
   };
   pcf.c.set(node, conf);
};

export default parseNodeIfelse;