
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import createNodeConf from './createNodeConf.js';
import getTypeLength from './getTypeLength.js';
import codeExpScope from './codeExpScope.js';
import parseChildNode from './parseChildNode.js';
import insertCommAuchToNode from './insertCommAuchToNode.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeFor = ($this, pcf, node) => {
   let prop = _obj.getAttribute(node, '.');

   let com0 = _obj.cloneNode(_pam.gb_domcom);
   let com1 = _obj.cloneNode(_pam.gb_domcom);

   let conf = createNodeConf(com1, pcf);
   conf.b[10] = _obj.slice(_obj.filter(_obj.split(prop, /\s+/g), v => v !== ''), 0, 3);
   conf.b[11] = node;
   conf.b[12] = _obj.childNodes(_obj.content(node)); // 类型必须是实时的 NodeList
   conf.b[20] = com0;
   conf.b[21] = com1;
   conf.e = insertCommAuchToNode;
   conf.f = ($this, cf) => {
      cf.c = _obj.filter(cf.c, v => v !== gb_null);

      let node = cf.b[11];
      let nodelist = cf.b[12];
      let com0 = cf.b[20];
      let com1 = cf.b[21];

      let lencfc = _obj.length(cf.c);
      let lensub = _obj.length(nodelist);

      let str = _obj.slice(cf.b[10], 0);
      let val = str.splice(-1)[0];

      let aks = _obj.keys(cf.a);
      let sexp = codeExpScope(aks, 0);

      let str0 = `Object.assign(${gb_arg0}.a,{${str.join(',')}});`;

      cf.b[13] = _obj.func(`${sexp}return\x20${val};`)
         .call($this, cf);
      cf.b[14] = getTypeLength(cf.b[13]);

      if (!cf.b[9]) {
         let typ = cf.b[14][0];

         if (typ === 'Array') {
            str[0] = `${str[0]}=${val}[i]`;
            if (str[1]) {
               str[1] = `${str[1]}=i`;
            }
            str = `for(let\x20i=0,l=${val}.length;i<l;i++){let\x20${str.join(',')};${str0}`;
         } else if (typ === 'Object') {
            str[0] = `${str[0]}=${val}[k[i]]`;
            if (str[1]) {
               str[1] = `${str[1]}=k[i]`;
            }
            str = `let\x20k=Object.keys(${val});for(let\x20i=0,l=k.length;i<l;i++){let\x20${str.join(',')};${str0}`;
         } else if (typ === 'Map') {
            str[0] = `${str[0]}=${val}.get(k)`;
            if (str[1]) {
               str[1] = `${str[1]}=k`;
            }
            str = `let\x20i=-1;for(let\x20k\x20of\x20${val}.keys()){i++;let\x20${str.join(',')};${str0}`;
         } else if (typ === 'Set') {
            str[0] = `${str[0]}=v`;
            if (str[1]) {
               str[1] = `${str[1]}=i`;
            }
            str = `let\x20i=-1;for(let\x20v\x20of\x20${val}.keys()){i++;let\x20${str.join(',')};${str0}`;
         } else {
            _obj.remove(com0);
            _obj.remove(com1);
            _obj.remove(node);
            cf.p.c[indexOf(cf.p.c, cf)] = gb_null;
            return;
         }

         cf.b[9] =
            func(`${sexp}${str}${gb_arg1}(i)}`);
      }

      if (lencfc) {
         let lens = cf.b[14][1] * lensub;
         if (lencfc > lens) { // 存在 且 减少
            let dcf = cf.c.splice(lens);
            while (_obj.length(dcf)) {
               let df = _obj.pop(dcf);
               if (_obj.nodeType(df.m) === 8) {
                  _obj.remove(df.b[20]);
                  _obj.remove(df.b[21]);
               } else {
                  _obj.remove(df.m);
               }
               for (let i = 0, l = _obj.length(df.c); i < l; i++) {
                  _obj.push(dcf, df.c[i]);
               }
            }
         } else if (lencfc < lens) { // 存在 且 增多
            let j = (lens - lencfc) / lensub;
            while (j--) {
               // 无需 作用域设置
               parseChildNode($this, cf, node, false);
            }
         }
         // 不减少 不增多 直接更新
         cf.b[9]
            .call($this, cf, (k) => {
               for (let i = 0; i < lensub; i++) {
                  let kcf = cf.c[k * lensub + i];
                  // 所有后代节点 使用一次作用域设置
                  let arrcf = [kcf];
                  while (_obj.length(arrcf)) {
                     let conf = _obj.pop(arrcf);
                     conf.j = true;
                     // 属性操作 也要 使用一次作用域设置
                     let ld = _obj.length(conf.d);
                     while (ld--) {
                        conf.d[ld].j = true;
                     }
                     for (let i = 0, l = _obj.length(conf.c); i < l; i++) {
                        _obj.push(arrcf, conf.c[i]);
                     }
                  }
                  // 此行删除了 配置执行函数
               }
            });
      } else { // 初始 或 空
         cf.b[9]
            .call($this, cf, (k) => {
               console.log(cf);
               console.log(node);
               parseChildNode($this, cf, _obj.cloneNode(node, true), false);
            });
      }
   };
   _obj.push(pcf.c, conf);
};

export default parseNodeFor;