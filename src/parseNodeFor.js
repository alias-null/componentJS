
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
import forGetTypeLen from './forGetTypeLen.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @param {String} name
 * @returns 
 */
const parseNodeFor = ($this, pcf, node, name) => {
   let prop = _obj.getAttribute(node, '.');

   let com0 = _obj.cloneNode(_pam.o_comment);
   let com1 = _obj.cloneNode(_pam.o_comment);

   let conf = createNodeConf(com1, node, pcf);
   conf.u = name;
   conf.b[0] = _obj.slice(_obj.filter(_obj.split(prop, /\s+/g), v => v !== ''), 0, 3);
   conf.b[1] = node;
   conf.b[8] = { s: com0, e: com1 };
   conf.b[10] = [];
   conf.e = insertCommAuchToNode;
   conf.f = ($this, cf) => {
      // cf.c = _obj.filter(cf.c, v => v !== o_null);

      // 缓存代码 数据可变 代码不可变
      if (!cf.b[2]) {
         cf.b[2] = [0, cf.b[0].splice(-1)[0]];
         cf.b[2][0] = cf.b[0].slice(0, 2);
         cf.b[2][2] = `Object.assign(${_obj.arg(0)}.a,{${_obj.join(cf.b[2][0], ',')}});`;
      }

      let node = cf.b[1];

      let com0 = cf.b[8].s;
      let com1 = cf.b[8].e;

      let val = cf.b[2][1];

      let aks = _obj.keys(cf.a);
      let sexp = codeExpScope(aks, 0);

      // 缓存获取数据函数 因为数据可变 而for代码是固定不变的
      if (!cf.b[3]) {
         cf.b[3] = _obj.func(`${sexp}return\x20${val};`);
      }

      // 动态获取类型和长度 应对数据变化 因为数据变化需要使用不同的for循环
      let typelen = forGetTypeLen(
         cf.b[3].call($this, cf)
      );
      let b10len = _obj.length(cf.b[10]);

      // 无法识别类型 或者 遍历长度小于 0 视为无效遍历 删除这个节点即可
      if (!typelen || typelen[1] < 0) {
         _obj.remove(node);
         _obj.remove(com0);
         _obj.remove(com1);
         // 父节点若存在 该节点 则删除
         if (pcf.c && pcf.c.has(node)) {
            _obj.del(pcf.c, node);
         }
         // 如果是 ifelse | switch 不存在 .c 而是 .b[10] 分支存储 分支编号为 r
         else if (pcf.b[10] && pcf.b[10][cf.r] && pcf.b[10][cf.r].has(node)) {
            _obj.del(pcf.b[10][cf.r], node);
         }
         return;
      }

      // 缓存类型 只要数据的类型没有变化 就无需重新构造代码
      if (!cf.b[4] || cf.b[4][0] !== typelen[0]) {
         cf.b[4] = typelen;

         let code = _obj.slice(cf.b[2][0], 0);
         let assi = cf.b[2][2];
         let ag01 = _obj.arg(1);
         let ag96 = _obj.arg(96);
         let ag97 = _obj.arg(97);
         let ag98 = _obj.arg(98);
         let ag99 = _obj.arg(99); // 减少 Proxy 变量的读取
         switch (cf.b[4][0]) {
            case _pam.s_Array:
            case _pam.s_Number:
            case _pam.s_String:
               code[0] = `${code[0]}=${ag99}[${ag97}]`;
               if (code[1]) {
                  code[1] = `${code[1]}=${ag97}`;
               }
               code =
                  `${ag99}=${val};for(${ag97}=0,${ag98}=${ag99}.length;${ag97}<${ag98};${ag97}++){let\x20${_obj.join(code, ',')};${assi}`;
               break;


            case _pam.s_Object:
               code[0] = `${code[0]}=${ag99}[${ag96}[${ag97}]]`;
               if (code[1]) {
                  code[1] = `${code[1]}=${ag96}[${ag97}]`;
               }
               code =
                  `${ag99}=${val};${ag96}=Object.keys(${ag99});for(${ag97}=0,${ag98}=${ag96}.length;${ag97}<${ag98};${ag97}++){let\x20${_obj.join(code, ',')};${assi}`;
               break;


            case _pam.s_Map:
               code[0] = `${code[0]}=${ag99}.get(${ag98})`;
               if (code[1]) {
                  code[1] = `${code[1]}=${ag98}`;
               }
               code =
                  `${ag99}=${val};${ag97}=-1;for(${ag98}\x20of\x20${ag99}.keys()){${ag97}++;let\x20${_obj.join(code, ',')};${assi}`;
               break;


            case _pam.s_Set:
               code[0] = `${code[0]}=${ag98}`;
               if (code[1]) {
                  code[1] = `${code[1]}=${ag97}`;
               }
               code =
                  `${ag99}=${val};${ag97}=-1;for(${ag98}\x20of\x20${ag99}.keys()){${ag97}++;let\x20${_obj.join(code, ',')};${assi}`;
               break;
         }

         cf.b[9] =
            _obj.func(`${sexp}${code}${ag01}(${ag97})}`);
      } else {
         cf.b[4][1] = typelen[1];
      }

      if (!b10len) {
         cf.b[9].call($this, cf, (k) => {
            // 解析子节点 生成配置缓存
            parseChildNode(
               $this,
               cf,
               _obj.cloneNode(_obj.content(node), true),
               ($this, scf) => {
                  if (scf.s) {
                     assignScope($this, scf);
                  }
               }
            );

            cf.b[10][k] = cf.c;
            cf.c = _obj.newMap();

            // 执行分支后代节点
            callConfRecF($this, cf.b[10][k], ($this, cf) => {
               // if (cf.s) {
               //    assignScope($this, cf);
               // }
            });
         });

         // for (let i = 0, l = _obj.length(cf.b[10]); i < l; i++) {
         //    // 执行分支后代节点
         //    callConfRecF($this, cf.b[10][i], ($this, cf) => {
         //       if (cf.s) {
         //          // assignScope($this, cf);
         //       }
         //    });
         // }
      } else {
         if (cf.b[4][1] > b10len) {
            let j = cf.b[4][1];
            for (let k = b10len; k < j; k++) {
               parseChildNode(
                  $this,
                  cf,
                  _obj.cloneNode(_obj.content(node), true),
                  // ($this, scf) => {
                  //    if (scf.s) {
                  //       assignScope($this, scf);
                  //    }
                  // }
               );

               cf.b[10][k] = cf.c;
               cf.c = _obj.newMap();
            }
         } else if (cf.b[4][1] < b10len) {
            for (let i = cf.b[4][1]; i < b10len; i++) {
               for (let scf of _obj.terValues(cf.b[10][i])) {
                  if (scf.t === 8) {
                     removeComOldNodes(scf.b[8].s, scf.b[8].e);
                     _obj.remove(scf.b[8].s);
                     _obj.remove(scf.b[8].e);
                  } else {
                     _obj.remove(scf.n);
                  }
               }
            }
            cf.b[10].splice(cf.b[4][1]);
         }

         cf.b[9].call($this, cf, (k) => {
            // // 解析子节点 生成配置缓存
            // parseChildNode(
            //    $this,
            //    cf,
            //    _obj.cloneNode(_obj.content(node), true),
            //    ($this, scf) => {
            //       if (scf.s) {
            //          assignScope($this, scf);
            //       }
            //    }
            // );

            // cf.b[10][k] = cf.c;
            // cf.c = _obj.newMap();

            // 执行分支后代节点
            callConfRecF($this, cf.b[10][k], ($this, cf) => {
               if (cf.s) {
                  assignScope($this, cf);
               }
            });
         });
      }
   };
   pcf.c.set(node, conf);
};

export default parseNodeFor;