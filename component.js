(function (window, document, undefined) {
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

   const gb_mutating_mth = new Set([
      // Array
      'copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift',

      // Set
      'add', 'clear', 'delete',

      // Map
      'clear', 'delete', 'set'
   ]);

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

   const slice = (a, b, c) => a.slice(b, c);

   const href = (a) => a.href;

   const length = (a) => a.length;

   const childNodes = (a) => a.childNodes;
   const parentNode = (a) => a.parentNode;

   const func = (a) => Function(a);

   const objToString = Object.prototype.toString;

   const getType = (a) => slice(objToString.call(a), 8, -1);

   const isArr = (a) => Array.isArray(a);
   const isMap = (a) => getType(a) === 'Map';
   const isSet = (a) => getType(a) === 'Set';
   const isStr = (a) => typeof a === 'string';
   const isObj = (a) => getType(a) === 'Object';
   const isFun = (a) => getType(a) === 'Function';
   const isPxy = (a) => indexOf(getType(a), 'Proxy') === 0;
   // const isWmap = (a) => getType(a) === 'WeakMap';
   // const isWset = (a) => getType(a) === 'WeakSet';

   const trim = (a) => a.trim();

   const pop = (a) => a.pop();

   const remove = (a) => a.remove();

   const nodeName = (a) => a.nodeName;

   const nodeType = (a) => a.nodeType;

   const firstChild = (a) => a.firstChild;

   const nextSibling = (a) => a.nextSibling;

   // const previousSibling = (a) => a.previousSibling;

   const toLowerCase = (a) => a.toLowerCase();

   const createElement = (a) => document.createElement(a);

   const createTextNode = (a) => document.createTextNode(a);

   const promiseResolve = (a) => Promise.resolve(a);

   const promiseDomOnLoad = (a) => new Promise((resolve, reject) => {
      addEvent(a, 'load', () => {
         resolve(a);
      }, gb_event_once_conf);
      addEvent(a, 'error', () => {
         reject(a);
      }, gb_event_once_conf);
   });

   const keys = (a) => Object.keys(a);

   const assign = (a, b) => Object.assign(a, b);

   const appendChild = (a, b) => a.appendChild(b);

   const cloneNode = (a, b) => a.cloneNode(b);

   const indexOf = (a, b) => a.indexOf(b);

   const push = (a, b) => a.push(b);

   const textContent = (a) => a.textContent;

   const textContentSet = (a, b) => a.textContent = b;

   const getAttr = (a, b) => a.getAttribute(b);

   const getAttrDel = (a, b) => {
      let s = a.getAttribute(b);
      a.removeAttribute(b);
      return s;
   };

   const hasAttr = (a, b) => a.hasAttribute(b);

   const delAttr = (a, b) => a.removeAttribute(b);

   const domQueryAll = (a, b) => a.querySelectorAll(b);

   const insertBefore = (a, b, c) => a.insertBefore(b, c);

   const setAttr = (a, b, c) => a.setAttribute(b, c);

   const addEvent = (a, b, c, d) => a.addEventListener(b, c, d);

   const moveChilds = (a, b) => {
      let c = childNodes(a);
      while (length(c)) {
         appendChild(b, c[0]);
      }
   };

   const childsCopyToArray = (a) => {
      let b = [];
      let c = getType(a) === 'NodeList' ? a : childNodes(a);
      for (let i = 0, l = length(c); i < l; i++) {
         b[i] = c[i];
      }
      return b;
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
         let scope = [];
         let pcf = cf.p;
         while (pcf) {
            push(scope, pcf.a);
            pcf = pcf.p;
         }
         // 从祖先作用域开始到父节点作用域结束
         while (length(scope)) {
            assign(cf.a, pop(scope));
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
      if (nodeType(node) === 1) {
         if (name === 'FOR') {
            let asub = childNodes(node);
            if (!length(asub)) {
               remove(nodes[0]);
               return;
            }

            let prop = getAttr(node, '.');
            if (prop === gb_null) {
               remove(nodes[0]);
               return;
            }

            prop = slice(prop.split(/\s+/g).filter(v => v !== ''), 0, 3)
               .map(v => `${gb_arg0}.a.${v}`);

            if (length(prop) < 2) {
               remove(nodes[0]);
               return;
            }

            let com0 = cloneNode(gb_domcom);
            let com1 = cloneNode(gb_domcom);

            let conf = createNodeConf(com1, pcf);
            conf.b[10] = prop;
            conf.b[11] = nodes[0];
            conf.b[12] = asub; // 必须是实时的 NodeList
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
               let subs = cf.b[12];
               let com0 = cf.b[20];
               let com1 = cf.b[21];

               let lencfc = length(cf.c);
               let lensub = length(subs);
               let asub = childsCopyToArray(subs);

               let str = slice(cf.b[10], 0);
               let val = str.splice(-1)[0];
               let [typ, len] = func(`${gb_code_use_strict}return\x20${gb_arg1}(${val});`)
                  .call($this, cf, getTypeLength);

               if (!cf.b[9]) {
                  if (typ === 'Array') {
                     str[0] = `${str[0]}=${val}[i];`;
                     if (str[1]) {
                        str[1] = `${str[1]}=i;`;
                     }
                     str = `for(let\x20i=0,l=${val}.length;i<l;i++){${str.join('')}`;
                  } else if (typ === 'Object') {
                     str[0] = `${str[0]}=${val}[k[i]];`;
                     if (str[1]) {
                        str[1] = `${str[1]}=k[i];`;
                     }
                     str = `let\x20k=Object.keys(${val});for(let\x20i=0,l=k.length;i<l;i++){${str.join('')}`;
                  } else if (typ === 'Map') {
                     str[0] = `${str[0]}=${val}.get(k);`;
                     if (str[1]) {
                        str[1] = `${str[1]}=k;`;
                     }
                     str = `let\x20i=-1;for(let\x20k\x20of\x20${val}.keys()){i++;${str.join('')}`;
                  } else if (typ === 'Set') {
                     str[0] = `${str[0]}=v;`;
                     if (str[1]) {
                        str[1] = `${str[1]}=i;`;
                     }
                     str = `let\x20i=-1;for(let\x20v\x20of\x20${val}.keys()){i++;${str.join('')}`;
                  } else {
                     remove(com0);
                     remove(com1);
                     remove(node);
                     cf.p.c[indexOf(cf.p.c, cf)] = gb_null;
                     return;
                  }

                  cf.b[9] =
                     func(`${gb_code_use_strict}${str}${gb_arg1}(i)}`);
               }

               if (lencfc) {
                  let lens = len * lensub;
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
                        for (let i = 0; i < lensub; i++) {
                           parseNode($this, [subs[i], cloneNode(subs[i], true)], cf, false);
                        }
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
                        parseChildNode($this, asub, cf, false);
                     });
               }
            };
            push(pcf.c, conf);
            conf.r(conf);
         } else if (name === 'SWITCH') {
            let childlist = childNodes(node);
            if (!length(childlist)) {
               remove(nodes[0]);
               return;
            }

            let prop = getAttr(node, '.');
            if (prop === gb_null) {
               remove(nodes[0]);
               return;
            }

            let isbreak = hasAttr(node, gb_break) ? gb_break
               : (hasAttr(node, gb_continue) ? gb_continue : '');

            let arrsubs = [];
            for (let i = 0, l = length(childlist); i < l; i++) {
               let dom = childlist[i];
               let nam = nodeName(dom);
               if (nam === 'CASE' && !hasAttr(dom, '.')) {
                  continue;
               }
               if (nam === 'CASE' || nam === 'DEFAULT') {
                  let sbreak = hasAttr(dom, gb_break)
                     ? gb_break : (hasAttr(dom, gb_continue)
                        ? gb_continue : isbreak);
                  let c = getAttr(dom, '.');
                  if (c === gb_null) {
                     c = '';
                  }
                  if (sbreak) {
                     sbreak += ';';
                  }
                  push(arrsubs, {
                     n: childsCopyToArray(dom),
                     c: c,
                     b: sbreak,
                     m: toLowerCase(nam),
                  });
               }
            }

            if (!length(arrsubs)) {
               remove(nodes[0]);
               return;
            }

            let com0 = cloneNode(gb_domcom);
            let com1 = cloneNode(gb_domcom);

            let conf = createNodeConf(com1, pcf);
            conf.b[10] = prop;
            conf.b[11] = arrsubs;
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
               let subs = cf.b[11];
               let com0 = cf.b[20];
               let com1 = cf.b[21];

               if (!cf.b[9]) {
                  let aks = keys(cf.a);
                  let sexp = codeExpandConf(aks, 0);
                  let loop = gb_reg3.test(cf.b[10])
                     ? assignvalpdomrec(aks, 0) : '';

                  let code = [];
                  for (let i = 0, l = length(subs); i < l; i++) {
                     let obj = subs[i];
                     let lop = obj.b ? loop : (i + 1 === l ? loop : '');
                     push(code, `${obj.m}\x20${obj.c}:${lop}${gb_arg1}(${i});${obj.b}`);
                  }

                  cf.b[9] =
                     func(`${sexp}switch(${prop}){${code.join('')}}`);
               }

               let c0 = nextSibling(com0);
               while (c0 && c0 !== com1) {
                  let c1 = c0;
                  c0 = nextSibling(c0);
                  remove(c1);
               }

               cf.b[9].call($this, cf, (k) => {
                  parseChildNode($this, subs[k].n, cf, true);
               });
               // try {
               //    let c0 = nextSibling(com0);
               //    while (c0 && c0 !== com1) {
               //       let c1 = c0;
               //       c0 = nextSibling(c0);
               //       remove(c1);
               //    }

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
         } else if (name === 'IFELSE') {
            let arrsubs = [];
            let childlist = childNodes(node);
            for (let i = 0, l = length(childlist); i < l; i++) {
               let dom = childlist[i];
               let nam = nodeName(dom);
               let isbreak = hasAttr(dom, gb_break) ? gb_break
                  : (hasAttr(dom, gb_continue) ? gb_continue : '');
               if (isbreak) {
                  isbreak += ';';
               }
               push(arrsubs, {
                  n: childsCopyToArray(dom),
                  c: getAttr(dom, '.'),
                  b: isbreak,
                  m: toLowerCase(nam),
               });
            }

            if (arrsubs[0].c === gb_null) {
               remove(nodes[0]);
               return;
            }

            let com0 = cloneNode(gb_domcom);
            let com1 = cloneNode(gb_domcom);

            let conf = createNodeConf(com1, pcf);
            // conf.b[10] = arrsubs[0].c;
            conf.b[11] = arrsubs;
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
               let subs = cf.b[11];
               let com0 = cf.b[20];
               let com1 = cf.b[21];

               if (!cf.b[9]) {
                  let aks = keys(cf.a);
                  let sexp = codeExpandConf(aks, 0);

                  let code = [];
                  for (let i = 0, l = length(subs); i < l; i++) {
                     let obj = subs[i];
                     if (obj.c !== gb_null) {
                        let loop = gb_reg3.test(obj.c)
                           ? assignvalpdomrec(aks, 0) : '';
                        let loopf = loop ? `||(function(){${loop}}).call(this,${gb_arg0})` : '';
                        if (i === 0) {
                           push(code, `${obj.m}(${obj.c}${loopf}){${loop}${gb_arg1}(${i});${obj.b}}`);
                        } else {
                           push(code, `${obj.m}\x20if(${obj.c}${loopf}){${loop}${gb_arg1}(${i});${obj.b}}`);
                        }
                     } else {
                        push(code, `${obj.m}{${gb_arg1}(${i});${obj.b}}`);
                        subs.splice(i + 1);
                        break;
                     }
                  }

                  cf.b[9] =
                     func(`${sexp}${code.join('')}`);
               }

               let c0 = nextSibling(com0);
               while (c0 && c0 !== com1) {
                  let c1 = c0;
                  c0 = nextSibling(c0);
                  remove(c1);
               }

               cf.b[9].call($this, cf, (k) => {
                  parseChildNode($this, subs[k].n, cf, true);
               });
               // try {
               //    let c0 = nextSibling(com0);
               //    while (c0 && c0 !== com1) {
               //       let c1 = c0;
               //       c0 = nextSibling(c0);
               //       remove(c1);
               //    }

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
         } else if (name !== 'ELSE') {
            let bind = getAttrDel(node, '#');
            let prop = getAttrDel(node, '.');
            let attr = getAttrDel(node, '..');
            let asub = childsCopyToArray(node);

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
                  // scf.r = (cf) => {
                  //    setRecScope($this, cf);
                  // };
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
                  // scf.r(scf);
               }
            }

            // 解析子节点
            parseChildNode($this, asub, conf, scope);
         }
      } else if (name === gb_name_domtxt) {
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
    * @param {Array} subs 
    * @param {Object} pcf
    * @param {Boolean} scope
    */
   const parseChildNode = ($this, subs, pcf, scope = true) => {
      for (let i = 0, l = length(subs); i < l; i++) {
         let dom = subs[i];
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
                  if (hasAttr(node, gb_onload)) {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onload, o: txt })
                     );
                  } else if (hasAttr(node, gb_onunload)) {
                     push(
                        arrps,
                        promiseResolve({ s: gb_onunload, o: txt })
                     );
                  } else if (hasAttr(node, gb_onadopt)) {
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
      const domfratop = cloneNode($this.$cf.temp.content, true)
         , arr_ps_all = []
         , arr_ps_jsi = [];

      fetchComponentGen(domfratop);

      parseBeforeHandle(
         $this,
         domfratop,
         arr_ps_all,
         arr_ps_jsi
      );

      let list = domQueryAll(domfratop, 'if');
      for (let i = 0, l = length(list); i < l; i++) {
         if (nodeName(parentNode(list[i])) !== 'IFELSE') {
            let dom_a = list[i];
            let arrdelete = [];
            let domifelse = gb_null;
            while (dom_a) {
               let dom = dom_a;
               let nmb = nodeName(dom);
               dom_a = nextSibling(dom_a);
               if (nmb === 'IF' || nmb === 'ELSE') {
                  while (length(arrdelete)) {
                     remove(pop(arrdelete));
                  }
                  if (nmb === 'IF' && domifelse === gb_null) {
                     domifelse = createElement('ifelse');
                     insertBefore(parentNode(dom), domifelse, dom);
                  }
                  appendChild(domifelse, dom);
               } else {
                  push(arrdelete, dom);
               }
               if (dom_a && nodeName(dom_a) === 'IF') {
                  break;
               }
            }
         }
      }

      let scope = true;
      let conf = createNodeConf($this.$sd);
      conf.b[30] = scope;
      conf.f = ($this, cf) => {
         if (cf.b[30]) {
            cf.b[30] = false;
            setRecScope($this, cf);
         }
      };
      parseChildNode($this, childsCopyToArray(domfratop), conf, scope);

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
      const CPsub = class extends CP { }
         , orig = objurl.origin
         , file = objurl.pathname.replace(/[\/]+/g, '/');
      CPsub.$cf = {
         base: orig + slice(file, 0, file.lastIndexOf('/') + 1),
         href: sethref ? (orig + file) : gb_undf,
         attr: gb_attrname,
         name: tagname,
         temp: domtemp,
      };
      customElements.define(tagname, CPsub);
   };

   const parseTemplateComponent = (doc) => {
      let attr = 'component';
      let domlist = domQueryAll(doc, `[${attr}*="-"]`);
      for (let i = 0, l = length(domlist); i < l; i++) {
         const domtemp = domlist[i];
         const name = getAttr(domtemp, attr);
         domtemp.replaceWith(createElement(name));

         defineElementClass(location, name, domtemp, false);
      }
   };

   const fetchComponentGen = (doc) => {
      let nodelist = domQueryAll(doc, gb_selector), i = length(nodelist);
      if (i) {
         // 倒序 先注册的覆盖后注册的
         const domjson = {};
         while (i--) {
            let k = toLowerCase(nodeName(nodelist[i]));
            domjson[k] = nodelist[i];
         }
         const arrkey = keys(domjson);
         for (let i = 0, l = length(arrkey); i < l; i++) {
            if (indexOf(arrkey[i], '-') > -1) {
               const name = arrkey[i];
               fetch(getAttr(domjson[name], gb_attrname)).then(r => {
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
                  const domtemp = createElement('template');
                  domtemp.innerHTML = res.txt;

                  defineElementClass(new URL(res.url), name, domtemp, true);
               });
            }
         }
      }
   };

   const createProxy = ($this, data) => {
      $fp = $this.$fp;
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
      parseTemplateComponent(document);
   }, gb_event_once_conf);

   class CP extends HTMLElement {
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
            setAttr(this, this.$cf.attr, h);
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
