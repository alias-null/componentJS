import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import codeExpScope from './codeExpScope.js';
import codeAssignToPcf from './codeAssignToPcf.js';
import removeComOldNodes from './removeComOldNodes.js';
import parseChildNode from './parseChildNode.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';
import callConfRecF from './callConfRecF.js';
import assignScope from './assignScope.js';
import callSwitchIfelseB9 from './callSwitchIfelseB9.js';


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
      let isbreak = _obj.hasAttribute(dom, _pam.s_break) ? _pam.s_break
         : (_obj.hasAttribute(dom, _pam.s_continue) ? _pam.s_continue : '');
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

   let com0 = _obj.cloneNode(_pam.o_comment);
   let com1 = _obj.cloneNode(_pam.o_comment);

   let conf = createNodeConf(com1, node, pcf);
   conf.b[0] = arrconf;
   conf.b[8] = { s: com0, e: com1 };
   conf.b[10] = [];
   conf.e = insertCommAuchToNode;
   conf.f = ($this, cf) => {
      let arrconf = cf.b[0];
      let com0 = cf.b[8].s;
      let com1 = cf.b[8].e;

      if (!cf.b[9]) {
         let aks = _obj.keys(cf.a);
         let sexp = codeExpScope(aks, 0);

         let ag00 = _obj.arg(0);
         let ag01 = _obj.arg(1);

         let code = [];
         for (let i = 0, l = _obj.length(arrconf); i < l; i++) {
            let obj = arrconf[i];
            if (obj.c) {
               let loop = _obj.test(_reg.reg3, obj.c) ? codeAssignToPcf(aks, 0) : '';
               let loopf = loop ? `||(function(){${loop}})(${ag00})` : '';
               _obj.push(code, `${obj.g}(${obj.c}${loopf}){${loop}${ag01}(${i});${obj.b}}`);
            } else {
               _obj.push(code, `${obj.g}{${ag01}(${i});${obj.b}}`);
               arrconf.splice(i + 1);
               break;
            }
         }

         // console.log(`${sexp}${_obj.join(code, '')}`);
         cf.b[9] =
            _obj.func(`${sexp}${_obj.join(code, '')}`);
      }

      callSwitchIfelseB9($this, cf);

      // removeComOldNodes(com0, com1);

      // cf.b[9].call($this, cf, (k) => {
      //    // 设置 ifelse 节点的分支标记
      //    cf.r = k;

      //    // 解析子节点 生成配置缓存
      //    if (!cf.b[10][k]) {
      //       parseChildNode($this, cf, cf.b[0][k].n);
      //       cf.b[10][k] = cf.c;
      //       // 清空 ifelse 的 .c 避免被外部 call 因为条件分支不是全部一起执行
      //       cf.c = _obj.newMap();

      //       // 设置所有后代分支 不关心顺序 设置就行
      //       let a = [cf.b[10][k]];
      //       while (_obj.length(a)) {
      //          let objcf = _obj.pop(a);
      //          if (objcf && _obj.size(objcf)) {
      //             for (let scf of _obj.terValues(objcf)) {
      //                scf.r = k;
      //                if (_obj.size(scf.c)) {
      //                   _obj.push(a, scf.c);
      //                } else if (scf.b[10]) {
      //                   a = a.concat(scf.b[10]);
      //                }
      //                if (scf.d) {
      //                   let l = _obj.length(scf.d);
      //                   while (l--) { scf.d[l].r = k; }
      //                }
      //             }
      //          }
      //       }
      //    } else {
      //       // 缓存节点 需要重新执行 e 因为非缓存节点在解析时执行
      //       let a = [cf.b[10][k]];
      //       while (_obj.length(a)) {
      //          let objcf = _obj.pop(a);
      //          if (objcf && _obj.size(objcf)) {
      //             for (let scf of _obj.terValues(objcf)) {
      //                scf.e(scf);
      //                if (_obj.size(scf.c)) {
      //                   _obj.push(a, scf.c);
      //                }
      //             }
      //          }
      //       }
      //    }

      //    // 执行分支后代节点
      //    callConfRecF($this, cf.b[10][k], ($this, cf) => {
      //       if (cf.s) {
      //          assignScope($this, cf);
      //       }
      //    });
      // });
   };
   pcf.c.set(node, conf);
};

export default parseNodeIfelse;
