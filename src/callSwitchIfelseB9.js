
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


/**
 * 
 * @param {Object} cf 
 */
const callSwitchIfelseB9 = ($this, cf) => {
   removeComOldNodes(cf.b[8].s, cf.b[8].e);

   cf.b[9].call($this, cf, (k) => {
      // 设置 ifelse 节点的分支标记
      cf.r = k;

      // 解析子节点 生成配置缓存
      if (!cf.b[10][k]) {
         parseChildNode($this, cf, cf.b[0][k].n);
         cf.b[10][k] = cf.c;
         // 清空 ifelse 的 .c 避免被外部 call 因为条件分支不是全部一起执行
         cf.c = _obj.newMap();

         // 设置所有后代分支 不关心顺序 设置就行
         let a = [cf.b[10][k]];
         while (_obj.length(a)) {
            let objcf = _obj.pop(a);
            if (objcf && _obj.size(objcf)) {
               for (let scf of _obj.terValues(objcf)) {
                  scf.r = k;
                  if (_obj.size(scf.c)) {
                     _obj.push(a, scf.c);
                  } else if (scf.b[10]) {
                     a = a.concat(scf.b[10]);
                  }
                  if (scf.d) {
                     let l = _obj.length(scf.d);
                     while (l--) { scf.d[l].r = k; }
                  }
               }
            }
         }
      } else {
         // 缓存节点 需要重新执行 e 因为非缓存节点在解析时执行
         let a = [cf.b[10][k]];
         while (_obj.length(a)) {
            let objcf = _obj.pop(a);
            if (objcf && _obj.size(objcf)) {
               for (let scf of _obj.terValues(objcf)) {
                  scf.e(scf);
                  if (_obj.size(scf.c)) {
                     _obj.push(a, scf.c);
                  }
               }
            }
         }
      }

      // 执行分支后代节点
      callConfRecF($this, cf.b[10][k], ($this, cf) => {
         if (cf.s) {
            assignScope($this, cf);
         }
      });
   });
};

export default callSwitchIfelseB9;