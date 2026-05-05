
import {
   gb_window as window,
   gb_document as document,
} from "./utils/param.js";

import {
   // Object
   getType,
   href,
   size,
   length,
   trim,
   pop,
   push,
   toLowerCase,
   toUpperCase,
   indexOf,
   lastIndexOf,
   keys,
   assign,
   slice,

   // Node
   content,
   nodeName,
   nodeType,
   lastChild,
   firstChild,
   childNodes,
   parentNode,
   textContent,
   nextSibling,
   previousSibling,
   textContentSet,
   remove,
   cloneNode,
   appendChild,
   insertBefore,
   createElement,
   createTextNode,
   getAttribute,
   hasAttribute,
   removeAttribute,
   setAttribute,
   querySelector,
   querySelectorAll,
   getAttributeRemove,
} from "./utils/object.js";

// import * as Object from "./utils/object.js"; // 批量导出并创建一个对象存储

(function (window, document, undefined) {
   'use strict';

   const gb_null = null;
   const gb_undf = undefined;

   const gb_domcom = document.createComment('');

   const gb_modules = new Map(); // 全局级别

   const gb_event_once_conf = { once: true, capture: true };
   const gb_dom_obs_conf = { childList: true, subtree: true };

   const gb_attrname = 'html';
   const gb_selector = `[${gb_attrname}*=".html"],[${gb_attrname}*=".htm"]`;

   const gb_reg0 = /(?<!\\)\$\{[^\$\}]*(?:\`.*?\`)*[^\$\{]*\}/gs;
   const gb_reg1 = /([^'";=\s]+)\s*=\s*(?:([^'";]*)|('[^']*'|"[^"]*"))?/gs;
   const gb_reg2 = /(?<!\\)\$\{.*?\}/gs;
   const gb_reg3 = /[\+\-\*\/\%\^\&\<\>\?\|\~]+=|[\+\-]{2}|[_a-zA-Z$][\w\$\.]*\(.*?\)/s;

   const gb_reg4 = /([^'";=\s]+)\s*=([^;\n]*)[\n\;]?/gs;
   const gb_reg5 = /[_a-zA-Z$][\w\$\.]*/s;
   const gb_reg6 = /(['"])?[_a-zA-Z$][\w\$\.]*(['"])?/gs;
   const gb_reg7 = /\<\/?(if|else|for|switch|case|default)\s*(?:\.\s*=\s*("[^"]*?"|'[^']*?')?)?\s*\>/gsi;
   const gb_reg8 = /\s*<[^<>]+(?:[^<>]*=(?:"[^"]*"|'[^']*'))*?\s*>\s*/gs;

   const gb_reg9 = /\s*<([^<>"'=\s]+)(?:[^<>"'=]*(?:=("[^"]*"|'[^']*'))?)*?\s*>\s*/gs;

   const gb_reg10 = /\s*<\/?([^<>"'=\s]+)(?:[^<>"'=]*(?:=(?:"[^"]*"|'[^']*'))?)*?\s*>\s*/gs;

   const gb_mutating_mth = new Set([
      // Array
      'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift',

      // Set
      'add', 'clear', 'delete',

      // Map
      'clear', 'delete', 'set'
   ]);

   const gb_parseto_template = new Set([
      'for', 'if', 'else',
      'switch', 'case', 'default',
   ]);

   const gb_type_length = {
      Map: (t, a) => [t, size(a)],
      Set: (t, a) => [t, size(a)],
      Array: (t, a) => [t, length(a)],
      Number: (t, a) => [t, length(a)],
      String: (t, a) => [t, length(a)],
      Object: (t, a) => [t, length(keys(a))],
   };

   const gb_template = 'template';
   const gb_onload = 'onload';
   const gb_onunload = 'onunload';
   const gb_onadopt = 'onadopt';
   const gb_break = 'break';
   const gb_continue = 'continue';
   const gb_args = 'arguments';
   const gb_name_domfra = '#document-fragment';
   const gb_name_domtxt = '#text';
   const gb_arg0 = `${gb_args}[0]`;
   const gb_arg1 = `${gb_args}[1]`;
   const gb_arg2 = `${gb_args}[2]`;
   const gb_code_use_strict = "'use strict';";

   function log() {
      return console.log.apply(gb_null, arguments);
   }

   const getTypeLength = (a) => {
      let t = getType(a).replace('Proxy', '');
      switch (t) {
         case 'Map': return [t, a.size];
         case 'Set': return [t, a.size];
         case 'Array': return [t, length(a)];
         case 'Number': return [t, length(a)];
         case 'String': return [t, length(a)];
         case 'Object': return [t, length(keys(a))];
      }
   };

   const func = (a) => Function(a);

   const isArr = (a) => Array.isArray(a);
   const isMap = (a) => getType(a) === 'Map';
   const isSet = (a) => getType(a) === 'Set';
   const isStr = (a) => typeof a === 'string';
   const isObj = (a) => getType(a) === 'Object';
   const isFun = (a) => getType(a) === 'Function';
   const isPxy = (a) => indexOf(getType(a), 'Proxy') === 0;
   // const isWmap = (a) => getType(a) === 'WeakMap';
   // const isWset = (a) => getType(a) === 'WeakSet';

   const promiseResolve = (a) => Promise.resolve(a);

   const promiseDomOnLoad = (a) => new Promise((resolve, reject) => {
      addEvent(a, 'load', () => {
         resolve(a);
      }, gb_event_once_conf);
      addEvent(a, 'error', () => {
         reject(a);
      }, gb_event_once_conf);
   });

   const addEvent = (a, b, c, d) => a.addEventListener(b, c, d);

   const removeOldNodes = (com0, com1) => {
      let c0 = nextSibling(com0);
      while (c0 && c0 !== com1) {
         let c1 = c0;
         c0 = nextSibling(c0);
         remove(c1);
      }
   };

   /**
    * 
    * @param {HTMLElement} $this 
    * @param {Object} conf 
    */
   const callCfFun = ($this, conf) => {
      if (conf.f) {
         $this.$fc = conf;
         conf.f($this, conf);
         $this.$fc = gb_null;
      }
      let arrd = conf.d;
      let lj = length(arrd);
      if (lj) {
         for (let j = 0; j < lj; j++) {
            let df = arrd[j];
            $this.$fc = df;
            df.f($this, df);
            $this.$fc = gb_null;
         }
      }
   };

   /**
    * 执行函数列表
    * @param {HTMLElement} $this 
    * @param {Set|Array} objcf 
    */
   const callUiFun = ($this, objcf) => {
      if (objcf) {
         for (let conf of objcf) {
            callCfFun($this, conf);
            callUiFun($this, conf.c);
         }
      }
   };

   // 当运行时执行的变量发生变化 递归将变量覆盖到父节点
   const assignvalpdomrec = (arrkeys, i0) => {
      let k = arrkeys.join(',');
      let s = `${gb_args}[${i0}]`;
      return `while(${s}){Object.assign(${s}.a,{${k}});${s}=${s}.p;}`;
   };

   /**
    * 
    * @param {Array} keys 
    * @param {Number} i0 
    * @returns 
    */
   const codeExpandConf = (arrkeys, i0) =>
      `${gb_code_use_strict}let\x20{${arrkeys.join(',')}}=${gb_args}[${i0}].a;`;

   /**
    * 增加代码压缩率
    * 递归设置作用域 共享作用开始 再从顶级祖先到父节点结束
    * @param {HTMLElement} $this 组件 HTMLElement
    * @param {Object} cf 配置 索引 a 存储目标作用域变量 索引 i 存储ID 其中 0 为父节点id
    * @return {Object} 返回父节点配置
    */
   const setRecScope = ($this, cf) => {
      // 先从共享作用域开始
      assign(cf.a, $this.$vd);
      if (cf.p) {
         let arr = [];
         let pcf = cf.p;
         while (pcf) {
            push(arr, pcf.a);
            pcf = pcf.p;
         }
         // 从祖先作用域开始到父节点作用域结束
         for (let i = length(arr) - 1; i >= 0; i--) {
            assign(cf.a, arr[i]);
         }
      }
   };

   /**
    * 
    * @param {Node} m 
    * @param {Object} p 
    * @returns 
    */
   const createNodeConf = (m = gb_null, p = gb_null) => {
      return {
         a: {}, // 作用域
         b: {}, // 备用参数
         c: [], // 子节点 配置列表
         d: [], // 当前节点 属性操作
         m, // 操作锚点
         p, // 父节点 配置
      };
   };

   /**
    * 
    * @param {HTMLElement} $this
    * @param {Array} nodes
    * @param {Number} pcf
    * @param {Boolean} scope
    * @returns 
    */
   const parseNode = ($this, nodes, pcf, scope = true) => {
      let node = nodes[1];
      let name = nodeName(node);
      let type = nodeType(node);
      if (type === 1) {
         if (name === 'TEMPLATE' && hasAttribute(node, '@')) {
            let tag = getAttribute(node, '@');
            if (tag === 'if' || tag === 'ifelse') {
               if (tag === 'if') {
                  let dom_a = nodes[0]; // 用真实 node  处理一遍
                  let arrdelete = [];
                  let domifelse = gb_null;
                  while (dom_a) {
                     let dom = dom_a;
                     let typ = nodeType(dom);
                     dom_a = nextSibling(dom_a);
                     if (typ === 1) {
                        let tag = getAttribute(dom, '@');
                        if (tag === 'if' || tag === 'else') {
                           let l = length(arrdelete);
                           while (l--) { remove(arrdelete[l]); }
                           arrdelete = [];
                           if (tag === 'if' && domifelse === gb_null) {
                              domifelse = cloneNode($this.$cf.temp);
                              setAttribute(domifelse, '@', 'ifelse');
                              insertBefore(parentNode(dom), domifelse, dom);
                           }
                           appendChild(content(domifelse), dom);
                        } else {
                           push(arrdelete, dom);
                        }
                     } else {
                        push(arrdelete, dom);
                     }
                     if (dom_a && nodeType(dom_a) === 1 && hasAttribute(dom_a, 'if')) {
                        break;
                     }
                  }
                  nodes[0] = domifelse;
                  nodes[1] = cloneNode(domifelse, true);
               }

               let lastchild = content(nodes[0]).lastChild;
               // 真实 node 优化
               let nodelist = childNodes(content(nodes[0]));
               let ter = nodelist.values();
               let obj, arrconf = [], arrdels = [];
               while (!(obj = ter.next()).done) {
                  let dom = obj.value;
                  let tag = getAttribute(dom, '@');
                  let atr = getAttribute(dom, '.');
                  if (tag === 'if'
                     || tag === 'else'
                     && (atr || dom === lastchild)) {
                     let isbreak = hasAttribute(dom, gb_break) ? gb_break
                        : (hasAttribute(dom, gb_continue) ? gb_continue : '');
                     if (isbreak) {
                        isbreak += ';';
                     }
                     push(arrconf, {
                        n: cloneNode(content(dom), true),
                        c: atr ? atr : '',
                        b: isbreak,
                        m: tag === 'else' && atr ? 'else\x20if' : tag,
                     });
                  } else {
                     push(arrdels, dom); // 真实 node 优化
                  }
               }
               let l = length(arrdels);
               while (l--) { remove(arrdels[l]); }

               if (!arrconf[0].c) {
                  remove(nodes[0]);
                  return;
               }

               let com0 = cloneNode(gb_domcom);
               let com1 = cloneNode(gb_domcom);

               let conf = createNodeConf(com1, pcf);
               // conf.b[10] = arrconf[0].c;
               conf.b[11] = arrconf;
               conf.b[20] = com0;
               conf.b[21] = com1;
               conf.b[30] = scope;
               conf.r = (cf) => {
                  setRecScope($this, cf);
                  let pm = cf.p.m;
                  if (nodeType(pm) === 8) {
                     let pn = parentNode(pm);
                     insertBefore(pn, cf.b[20], pm);
                     insertBefore(pn, cf.b[21], pm);
                  } else {
                     appendChild(pm, cf.b[20]);
                     appendChild(pm, cf.b[21]);
                  }
               };
               conf.f = ($this, cf) => {
                  if (cf.b[30]) {
                     cf.b[30] = false;
                     setRecScope($this, cf);
                  }

                  // let prop = cf.b[10];
                  let arrconf = cf.b[11];
                  let com0 = cf.b[20];
                  let com1 = cf.b[21];

                  if (!cf.b[9]) {
                     let aks = keys(cf.a);
                     let sexp = codeExpandConf(aks, 0);

                     let code = [];
                     for (let i = 0, l = length(arrconf); i < l; i++) {
                        let obj = arrconf[i];
                        if (obj.c) {
                           let loop = gb_reg3.test(obj.c)
                              ? assignvalpdomrec(aks, 0) : '';
                           let loopf = loop ? `||(function(){${loop}}).call(this,${gb_arg0})` : '';
                           push(code, `${obj.m}(${obj.c}${loopf}){${loop}${gb_arg1}(${i});${obj.b}}`);
                        } else {
                           push(code, `${obj.m}{${gb_arg1}(${i});${obj.b}}`);
                           arrconf.splice(i + 1);
                           break;
                        }
                     }

                     cf.b[9] =
                        func(`${sexp}${code.join('')}`);
                  }

                  removeOldNodes(com0, com1);

                  cf.b[9].call($this, cf, (k) => {
                     parseChildNode($this, childNodes(arrconf[k].n), cf, true);
                  });
                  // try {
                  //    removeOldNodes(com0, com1);

                  //    cf.b[9].call($this, cf, (k) => {
                  //       cf.b[40] = subs[k].c;
                  //       parseChildNode($this, subs[k].n, cf, true);
                  //    });
                  // } catch (e) {
                  //    throw new Error(cf.b[40]);
                  // }
               };
               push(pcf.c, conf);
               conf.r(conf);
            } else if (tag === 'for') {
               let nodelist = childNodes(content(node));
               if (!length(nodelist)) {
                  remove(nodes[0]);
                  return;
               }

               let prop = getAttribute(node, '.');

               if (prop === gb_null) {
                  remove(nodes[0]);
                  return;
               }

               prop = slice(prop.split(/\s+/g).filter(v => v !== ''), 0, 3);

               if (length(prop) < 2) {
                  remove(nodes[0]);
                  return;
               }

               let com0 = cloneNode(gb_domcom);
               let com1 = cloneNode(gb_domcom);

               let conf = createNodeConf(com1, pcf);
               conf.b[10] = prop;
               conf.b[11] = nodes[0];
               conf.b[12] = nodelist; // 类型必须是实时的 NodeList
               conf.b[20] = com0;
               conf.b[21] = com1;
               conf.b[30] = scope;
               conf.r = (cf) => {
                  setRecScope($this, cf);
                  let pm = cf.p.m;
                  if (nodeType(pm) === 8) {
                     let pn = parentNode(pm);
                     insertBefore(pn, cf.b[20], pm);
                     insertBefore(pn, cf.b[21], pm);
                  } else {
                     appendChild(pm, cf.b[20]);
                     appendChild(pm, cf.b[21]);
                  }
               };
               conf.f = ($this, cf) => {
                  if (cf.b[30]) {
                     cf.b[30] = false;
                     setRecScope($this, cf);
                  }

                  cf.c = cf.c.filter(v => v !== gb_null);

                  let node = cf.b[11];
                  let nodelist = cf.b[12];
                  let com0 = cf.b[20];
                  let com1 = cf.b[21];

                  let lencfc = length(cf.c);
                  let lensub = length(nodelist);

                  let str = slice(cf.b[10], 0);
                  let val = str.splice(-1)[0];

                  let aks = keys(cf.a);
                  let sexp = codeExpandConf(aks, 0);

                  let str0 = `Object.assign(${gb_arg0}.a,{${str.join(',')}});`;

                  cf.b[13] = func(`${sexp}return\x20${val};`)
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
                        remove(com0);
                        remove(com1);
                        remove(node);
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
                        while (length(dcf)) {
                           let df = pop(dcf);
                           if (nodeType(df.m) === 8) {
                              remove(df.b[20]);
                              remove(df.b[21]);
                           } else {
                              remove(df.m);
                           }
                           for (let i = 0, l = length(df.c); i < l; i++) {
                              push(dcf, df.c[i]);
                           }
                        }
                     } else if (lencfc < lens) { // 存在 且 增多
                        let j = (lens - lencfc) / lensub;
                        while (j--) {
                           // 无需 作用域设置
                           parseChildNode($this, nodelist, cf, false);
                        }
                     }
                     // 不减少 不增多 直接更新
                     cf.b[9]
                        .call($this, cf, (k) => {
                           for (let i = 0; i < lensub; i++) {
                              let kcf = cf.c[k * lensub + i];
                              // 所有后代节点 使用一次作用域设置
                              let arrcf = [kcf];
                              while (length(arrcf)) {
                                 let conf = pop(arrcf);
                                 conf.b[30] = true;
                                 // 属性操作 也要 使用一次作用域设置
                                 let ld = length(conf.d);
                                 while (ld--) {
                                    conf.d[ld].b[30] = true;
                                 }
                                 for (let i = 0, l = length(conf.c); i < l; i++) {
                                    push(arrcf, conf.c[i]);
                                 }
                              }
                              callCfFun($this, kcf);
                           }
                        });
                  } else { // 初始 或 空
                     cf.b[9]
                        .call($this, cf, (k) => {
                           parseChildNode($this, nodelist, cf, false);
                        });
                  }
               };
               push(pcf.c, conf);
               conf.r(conf);
            } else if (tag === 'switch') {

               let prop = getAttribute(node, '.');
               if (prop === gb_null) {
                  remove(nodes[0]);
                  return;
               }

               let isbreak = hasAttribute(node, gb_break) ? gb_break
                  : (hasAttribute(node, gb_continue) ? gb_continue : '');

               // 真实 node 优化
               let nodelist = childNodes(content(nodes[0]));
               let ter = nodelist.values();
               let obj, arrconf = [], arrdels = [];
               while (!(obj = ter.next()).done) {
                  let dom = obj.value;
                  let tag = getAttribute(dom, '@');
                  let atr = getAttribute(dom, '.');
                  if (tag === 'default'
                     || tag === 'case' && atr
                  ) {
                     let sbreak = hasAttribute(dom, gb_break)
                        ? gb_break : (hasAttribute(dom, gb_continue)
                           ? gb_continue : isbreak);
                     if (sbreak) {
                        sbreak += ';';
                     }
                     push(arrconf, {
                        n: cloneNode(content(dom), true),
                        c: atr ? atr : '',
                        b: sbreak,
                        m: tag === 'else' && atr ? 'else\x20if' : tag,
                     });
                  } else {
                     push(arrdels, dom); // 真实 node 优化
                  }
               }
               let l = length(arrdels);
               while (l--) { remove(arrdels[l]); }

               if (!arrconf[0].c) {
                  remove(nodes[0]);
                  return;
               }

               let com0 = cloneNode(gb_domcom);
               let com1 = cloneNode(gb_domcom);

               let conf = createNodeConf(com1, pcf);
               conf.b[10] = prop;
               conf.b[11] = arrconf;
               conf.b[20] = com0;
               conf.b[21] = com1;
               conf.b[30] = scope;
               conf.r = (cf) => {
                  setRecScope($this, cf);
                  let pm = cf.p.m;
                  if (nodeType(pm) === 8) {
                     let pn = parentNode(pm);
                     insertBefore(pn, cf.b[20], pm);
                     insertBefore(pn, cf.b[21], pm);
                  } else {
                     appendChild(pm, cf.b[20]);
                     appendChild(pm, cf.b[21]);
                  }
               };
               conf.f = ($this, cf) => {
                  if (cf.b[30]) {
                     cf.b[30] = false;
                     setRecScope($this, cf);
                  }

                  let prop = cf.b[10];
                  let arrconf = cf.b[11];
                  let com0 = cf.b[20];
                  let com1 = cf.b[21];

                  if (!cf.b[9]) {
                     let aks = keys(cf.a);
                     let sexp = codeExpandConf(aks, 0);
                     let loop = gb_reg3.test(cf.b[10])
                        ? assignvalpdomrec(aks, 0) : '';

                     let code = [];
                     for (let i = 0, l = length(arrconf); i < l; i++) {
                        let obj = arrconf[i];
                        let lop = obj.b ? loop : (i + 1 === l ? loop : '');
                        push(code, `${obj.m}\x20${obj.c}:${lop}${gb_arg1}(${i});${obj.b}`);
                     }

                     cf.b[9] =
                        func(`${sexp}switch(${prop}){${code.join('')}}`);
                  }

                  removeOldNodes(com0, com1);

                  cf.b[9].call($this, cf, (k) => {
                     parseChildNode($this, childNodes(arrconf[k].n), cf, true);
                  });
                  // try {
                  //    removeOldNodes(com0, com1);

                  //    cf.b[9].call($this, cf, (k) => {
                  //       cf.b[40] = subs[k].c;
                  //       parseChildNode($this, subs[k].n, cf, true);
                  //    });
                  // } catch (e) {
                  //    throw new Error(cf.b[40]);
                  // }
               };
               push(pcf.c, conf);
               conf.r(conf);
            }
         } else {
            let bind = getAttributeRemove(node, '#');
            let prop = getAttributeRemove(node, '.');
            let attr = getAttributeRemove(node, '..');
            let nodelist = childNodes(cloneNode(node, true));

            let conf = createNodeConf(node, pcf);
            conf.b[10] = bind;
            conf.b[30] = scope;
            conf.r = (cf) => {
               setRecScope($this, cf);
               textContentSet(cf.m, '');
               let pm = cf.p.m;
               if (nodeType(pm) === 8) {
                  insertBefore(parentNode(pm), cf.m, pm);
               } else {
                  appendChild(pm, cf.m);
               }
            };
            conf.f = ($this, cf) => {
               if (cf.b[30]) {
                  cf.b[30] = false;
                  setRecScope($this, cf);
               }

               if (!cf.b[9]) {
                  let bind = cf.b[10];
                  if (bind && $this.$vd[bind]) {
                     $this.$vd[bind].val = cf.m;
                  }
                  cf.b[9] = true;
               }
            };
            push(pcf.c, conf);
            conf.r(conf);

            let iterarr = [];
            if (prop) {
               push(iterarr, {
                  m: prop.matchAll(gb_reg4),
                  x: (a, b) => `${a}=${b}`,
               });
            }
            if (attr) {
               push(iterarr, {
                  m: attr.matchAll(gb_reg4),
                  x: (a, b) => `setAttribute('${a}',${b})`,
               });
            }

            for (let i = 0, l = length(iterarr); i < l; i++) {
               for (let arr of iterarr[i].m) {
                  arr[2] = trim(arr[2]);

                  let scf = createNodeConf(conf.m, conf);
                  scf.b[10] = arr[2];
                  scf.b[11] = iterarr[i].x(arr[1], arr[2]);
                  scf.b[30] = scope;
                  scf.r = (cf) => {
                     setRecScope($this, cf);
                  };
                  scf.f = ($this, cf) => {
                     if (cf.b[30]) {
                        cf.b[30] = false;
                        setRecScope($this, cf);
                     }

                     if (!cf.b[9]) {
                        let aks = keys(cf.a);
                        let sexp = codeExpandConf(aks, 0);
                        let loop = gb_reg3.test(cf.b[10])
                           ? assignvalpdomrec(aks, 0) : '';

                        cf.b[9] =
                           func(`${sexp}${gb_arg0}.m.${cf.b[11]};${loop}`);
                     }

                     cf.b[9].call($this, cf);
                     // try {
                     //    cf.b[9].call($this, cf);
                     // } catch (e) {
                     //    throw new Error(cf.b[11]);
                     // }
                  };
                  push(conf.d, scf);
                  scf.r(scf);
               }
            }

            // 解析子节点
            parseChildNode($this, nodelist, conf, scope);
         }
      } else if (type === 3) {
         let val = trim(node.nodeValue);
         let arr = [];
         let len;
         val = val.replace(gb_reg0, (m) => {
            push(arr, m);
            return '${}';
         });
         val = val.split(gb_reg2);
         len = length(val);
         while (len--) {
            let conf = createNodeConf(createTextNode(val[len]), pcf);
            conf.r = (cf) => { // 普通文本节点 无需参数
               setRecScope($this, cf);
               let pm = cf.p.m;
               if (nodeType(pm) === 8) {
                  insertBefore(parentNode(pm), cf.m, pm);
               } else {
                  appendChild(pm, cf.m);
               }
            };
            val[len] = conf;
         }
         len = length(arr);
         while (len--) {
            let six = len + 1;
            if (trim(slice(arr[len], 2, -1))) {
               let conf = createNodeConf(createTextNode(''), pcf);
               conf.b[10] = arr[len];
               conf.b[11] = gb_arg0 + '.m.nodeValue';
               conf.b[12] = `\`${arr[len]}\``;
               conf.b[13] = `if(${conf.b[11]}!==${conf.b[12]}){${conf.b[11]}=${conf.b[12]}`;
               conf.b[30] = scope;
               conf.r = (cf) => {
                  setRecScope($this, cf);
                  let pm = cf.p.m;
                  if (nodeType(pm) === 8) {
                     insertBefore(parentNode(pm), cf.m, pm);
                  } else {
                     appendChild(pm, cf.m);
                  }
               };
               conf.f = ($this, cf) => {
                  if (cf.b[30]) {
                     cf.b[30] = false;
                     setRecScope($this, cf);
                  }

                  if (!cf.b[9]) {
                     let aks = keys(cf.a);
                     let sexp = codeExpandConf(aks, 0);
                     let loop = gb_reg3.test(cf.b[10])
                        ? assignvalpdomrec(aks, 0) : '';

                     cf.b[9] =
                        func(`${sexp}${cf.b[13]}${loop}}`);
                  }

                  cf.b[9].call($this, cf);
                  // try {
                  //    cf.b[9].call($this, cf);
                  // } catch (e) {
                  //    throw new Error(cf.b[11]);
                  // }
               };
               val.splice(six, 0, conf);
            } else {
               val.splice(six, 0, gb_null);
            }
         }

         for (let i = 0, l = length(val); i < l; i++) {
            let conf = val[i];
            if (conf) {
               push(pcf.c, conf);
               conf.r(conf);
            }
         }
      }
   };

   /**
    * 
    * @param {HTMLElement} $this 
    * @param {Nodelist} nodelist
    * @param {Object} pcf
    * @param {Boolean} scope
    */
   const parseChildNode = ($this, nodelist, pcf, scope = true) => {
      let ter = nodelist.values(), obj;
      while (!(obj = ter.next()).done) {
         let dom = obj.value;
         parseNode($this, [dom, cloneNode(dom, true)], pcf, scope);
      }
   };

   const parseBeforeHandle = ($this, node, arrps, arrjsi) => {
      let childs = childNodes(node);
      for (let i = length(childs) - 1; i >= 0; i--) {
         let node = childs[i], name = nodeName(node);
         switch (name) {
            case 'LINK':
               if (toLowerCase(node.rel) === 'stylesheet'
                  && indexOf(toLowerCase(href(node)), '.css') > -1) {
                  push(arrps, promiseDomOnLoad(node));
                  insertBefore($this.$sd, node, firstChild($this.$sd));
               } else {
                  remove(node);
               }
               break;

            case 'STYLE':
               if (trim(textContent(node)) !== '') {
                  push(arrps, promiseDomOnLoad(node));
                  insertBefore($this.$sd, node, firstChild($this.$sd));
               } else {
                  remove(node);
               }
               break;

            case 'SCRIPT':
               remove(node);
               let src = node.src
                  , typ = node.type
                  , txt = trim(textContent(node));
               if (!!src) {
                  let s = new URL(src, $this.$cf.base), h = href(s);
                  if (typ === 'module'
                     && gb_modules.get(h) === gb_undf) {
                     push(
                        arrps,
                        import(h).then(m => {
                           let res = { s: src, h };
                           if (m.default !== gb_undf) {
                              res.o = m.default;
                              return res;
                           }
                           let arrkey = keys(m);
                           if (length(arrkey) > 0) {
                              res.o = {};
                              for (let j = 0, jl = length(arrkey); j < jl; j++) {
                                 res.o[arrkey[j]] = m[arrkey[j]];
                              }
                              return res;
                           }
                           return gb_undf;
                        })
                     );
                     push(arrjsi, length(arrps) - 1);
                  } else if (!typ && indexOf(s.pathname, '.js') >= 0) {
                     push(
                        arrps,
                        fetch(h)
                           .then(r => r.status !== 200 ? gb_undf : r.text())
                     );
                     push(arrjsi, length(arrps) - 1);
                  }
               } else if (!!txt && !typ) {
                  if (hasAttribute(node, gb_onload)) {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onload, o: txt })
                     );
                  } else if (hasAttribute(node, gb_onunload)) {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onunload, o: txt })
                     );
                  } else if (hasAttribute(node, gb_onadopt)) {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onadopt, o: txt })
                     );
                  } else {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onload, o: txt })
                     );
                  }
                  push(arrjsi, length(arrps) - 1);
               }
               break;

            case gb_name_domtxt:
               if (trim(textContent(node)) === '') {
                  remove(node);
               }
               break;

            default:
               if (nodeType(node) !== 1) {
                  remove(node);
               }
               break;
         }
         parseBeforeHandle($this, node, arrps, arrjsi);
      }
   };

   const parseTemplate = ($this) => {
      const domfratop = cloneNode(content($this.$cf.temp), true)
         , arr_ps_all = []
         , arr_ps_jsi = [];

      fetchComponentGen(domfratop);

      parseBeforeHandle(
         $this,
         domfratop,
         arr_ps_all,
         arr_ps_jsi
      );

      let scope = true;
      let conf = createNodeConf($this.$sd);
      conf.b[30] = scope;
      conf.f = ($this, cf) => {
         if (cf.b[30]) {
            cf.b[30] = false;
            setRecScope($this, cf);
         }
      };
      parseChildNode($this, childNodes(domfratop), conf, scope);

      Promise.allSettled(arr_ps_all).then(list => {
         for (let i = length(list) - 1; i >= 0; i--) {
            let val = list[i].value;
            if (isStr(val)) {
               let rs = func(gb_code_use_strict + val).call($this);
               if (isObj(rs)) {
                  assign($this.$vd, rs);
               }
            } else if (isObj(val)) {
               if (val.h) {
                  gb_modules.set(val.h, val.o);
                  if (val.s !== val.h) {
                     gb_modules.set(val.s, val.h);
                  }
               } else if (val.o) {
                  if ($this.$cf[val.s] === gb_undf) {
                     $this.$cf[val.s] = [];
                  }
                  push($this.$cf[val.s], func(gb_code_use_strict + val.o));
               }
            }
         }

         if ($this.$cf[gb_onload]) {
            let arr = $this.$cf[gb_onload];
            for (let i = 0, l = length(arr); i < l; i++) {
               let rs = arr[i].call($this);
               if (isObj(rs)) {
                  assign($this.$vd, rs);
               }
            }
         }

         callUiFun($this, [conf]);

         // after call 
         $this.$fn();
      });
   };

   /**
    * 注册 Element class 组件
    * @param {URL} objurl 来源 URL 对象
    * @param {String} tagname 组件标签名
    * @param {HTMLTemplateElement} domtemp 模板 html 
    * @param {Boolean} sethref 是否设置 href 到配置中
    */
   const defineElementClass = (objurl, tagname, domtemp, sethref = true) => {
      const Component = class extends CusElement { }
         , orig = objurl.origin
         , file = objurl.pathname.replace(/[\/]+/g, '/');
      Component.$cf = {
         base: orig + slice(file, 0, lastIndexOf(file, '/') + 1),
         href: sethref ? (orig + file) : gb_undf,
         attr: gb_attrname,
         name: tagname,
         temp: domtemp,
      };
      customElements.define(tagname, Component);
   };

   const parseTemplateComponent = (doc) => {
      let attr = 'component';
      let domlist = querySelectorAll(doc, `[${attr}*="-"]`);
      for (let i = 0, l = length(domlist); i < l; i++) {
         const domtemp = domlist[i];
         const name = getAttribute(domtemp, attr);
         domtemp.replaceWith(createElement(name));

         defineElementClass(
            location,
            name,
            domtemp,
            false
         );
      }
   };

   const fetchComponentGen = (doc) => {
      let querylist = querySelectorAll(doc, gb_selector), i = length(querylist);
      if (i) {
         // 倒序 先注册的覆盖后注册的
         const domjson = {};
         while (i--) {
            let k = toLowerCase(nodeName(querylist[i]));
            domjson[k] = querylist[i];
         }
         const arrkey = keys(domjson);
         for (let i = 0, l = length(arrkey); i < l; i++) {
            if (indexOf(arrkey[i], '-') > -1) {
               const name = arrkey[i];
               fetch(getAttribute(domjson[name], gb_attrname)).then(r => {
                  if (r.status !== 200) {
                     return gb_null;
                  }
                  return r.text().then(txt => ({ txt, url: r.url }));
               }).then(res => {
                  if (res === gb_null) {
                     return gb_null;
                  }
                  if (customElements.get(name) !== gb_undf) {
                     return gb_null;
                  }
                  const domtemp = createElement(gb_template);

                  domtemp.innerHTML = res.txt
                     .replace(gb_reg10, (s, s1) => {
                        s = trim(s);
                        if (gb_parseto_template.has(s1)) {
                           if (indexOf(s, '</') === 0) {
                              return `</${gb_template}>`;
                           }
                           s = s.substring(length(s1) + 1);
                           return `<${gb_template}\x20@='${s1}'${s}`;
                        }
                        return s;
                     });

                  defineElementClass(
                     new URL(res.url),
                     name,
                     domtemp,
                     true
                  );
               });
            }
         }
      }
   };

   const createProxy = ($this, data) => {
      let $fp = $this.$fp;
      return new Proxy(data, {
         // 拦截 deleteProperty（delete 操作）
         deleteProperty(target, key) {
            let res = Reflect.deleteProperty(target, key);
            // log('deleteProperty setter',);

            let confset = $fp.get(target);
            $fp.delete(target);
            callUiFun($this, confset);

            return res;
         }

         // // 拦截 defineProperty（Object.defineProperty）
         // , defineProperty(target, key, descriptor) {
         //    let res = Reflect.defineProperty(target, key, descriptor);
         //    log('defineProperty setter',);
         //    // let confset = $fp.get(target);
         //    // $fp.delete(target);
         //    // callUiFun($this, confset);
         //    return res;
         // }

         , get(target, key, receiver) {
            if (key === Symbol.toStringTag) {
               return `Proxy${getType(target)}`;
            }

            let val = target[key];
            // log('getter',);

            if (isFun(val)) {
               if (gb_mutating_mth.has(key)) {
                  return function () {
                     // log(`function ${key} setter`,);
                     let res = val.apply(target, arguments);

                     let confset = $fp.get(target);
                     $fp.delete(target);
                     callUiFun($this, confset);

                     return res;
                  };
               }

               if ($this.$fc) {
                  let confset = $fp.get(target);
                  if (confset) {
                     confset.add($this.$fc);
                  } else {
                     confset = new Set([$this.$fc]);
                     $fp.set(target, confset);
                  }
               }

               if (key === 'toString') {
                  if (isSet(target)) {
                     return function () {
                        let k = -1;
                        let a = [];
                        for (let v of target) {
                           a[++k] = v;
                        }
                        return a;
                     };
                  }
                  if (isMap(target)) {
                     return function () {
                        let a = [];
                        for (let v of target) {
                           push(a, v);
                        }
                        return a;
                     };
                  }
                  if (isArr(target) || isObj(target)) {
                     return function () {
                        return JSON.stringify(target);
                     };
                  }
               }

               return function () {
                  return val.apply(target, arguments);
               };
            }


            if ($this.$fc) {
               let confset = $fp.get(target);
               if (confset) {
                  confset.add($this.$fc);
               } else {
                  confset = new Set([$this.$fc]);
                  $fp.set(target, confset);
               }
            }
            // console.log($fp);

            if (isArr(val)) {
               return createProxy($this, val);
            }

            if (isObj(val)) {
               return createProxy($this, val);
            }

            if (isSet(val) || isMap(val)) {
               return createProxy($this, val);
            }

            return val;
         }

         , set(target, key, val, receiver) {
            // log('setter',);
            let res = Reflect.set(target, key, val, receiver);

            let confset = $fp.get(target);
            $fp.delete(target);
            callUiFun($this, confset);

            return res;
         }
      });
   };

   // 文档加载完成
   addEvent(window, 'DOMContentLoaded', () => {
      fetchComponentGen(document);
      // parseTemplateComponent(document);
   }, gb_event_once_conf);

   class CusElement extends HTMLElement {
      $cf = {};
      $vd = {};
      $fp = new WeakMap();
      $sd = gb_null;
      $fc = gb_null;
      $fn = () => { };

      constructor() {
         super();
         this.attachShadow({ mode: 'open' });
         let class_old = customElements.get(
            toLowerCase(nodeName(this))
         );
         this.$cf = class_old.$cf;
         this.$sd = this.shadowRoot;
         let h = href(this.$cf);
         if (h) {
            setAttribute(this, this.$cf.attr, h);
         }
         parseTemplate(this);
      }

      adoptedCallback() {
         if (this.$cf.onadopt) {
            let arr = this.$cf.onadopt;
            for (let i = 0, l = length(arr); i < l; i++) {
               arr[i].call(this);
            }
         }
      }

      disconnectedCallback() {
         if (this.$cf.unload) {
            let arr = this.$cf.unload;
            for (let i = 0, l = length(arr); i < l; i++) {
               arr[i].call(this);
            }
         }
      }

      connectedCallback() {
      }

      module = (s) => {
         let m = gb_modules.get(s);
         if (isStr(m)) {
            m = gb_modules.get(m);
         }
         return m;
      };

      // class方法依赖 this 必用箭头函数
      called = (c) => {
         this.$fn = c;
      };

      // class方法依赖 this 必用箭头函数
      val = (param) => {
         if (isPxy(param)) {
            return param;
         }
         let top = { val: param };
         top._ = top;
         return createProxy(this, top);
      };
   }
})(window, document);
