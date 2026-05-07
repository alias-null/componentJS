else if (tag === 'switch') {
   let _isbreak = hasAttribute(node, gb_break) ? gb_break
      : (hasAttribute(node, gb_continue) ? gb_continue : '');

   let nodelist = childNodes(content(node));
   let arrconf = [];
   for (let i = 0, il = length(nodelist); i < il; i++) {
      let dom = nodelist[i];
      let atr = getAttribute(dom, '.');
      let isbreak = hasAttribute(dom, gb_break)
         ? gb_break : (hasAttribute(dom, gb_continue)
            ? gb_continue : _isbreak);
      if (isbreak) {
         isbreak += ';';
      }
      push(arrconf, {
         // n: cloneNode(content(dom), true),
         n: content(dom),
         c: atr ? atr : '',
         b: isbreak,
         m: getAttribute(dom, '-'),
      });
   }

   let com0 = cloneNode(gb_domcom);
   let com1 = cloneNode(gb_domcom);

   let conf = createNodeConf(com1, pcf);
   conf.b[10] = getAttribute(node, '.');
   conf.b[11] = arrconf;
   conf.b[20] = com0;
   conf.b[21] = com1;
   conf.j = scope;
   conf.i = savepx;
   conf.e = (cf) => {
      assignScope($this, cf);
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
      if (cf.j) {
         cf.j = false;
         assignScope($this, cf);
      }

      let prop = cf.b[10];
      let arrconf = cf.b[11];
      let com0 = cf.b[20];
      let com1 = cf.b[21];

      if (!cf.b[9]) {
         let aks = keys(cf.a);
         let sexp = codeExpScope(aks, 0);
         let loop = _reg.reg3.test(cf.b[10])
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
         parseChildNode($this, cf, arrconf[k].n, true);
      });
      // try {
      //    removeOldNodes(com0, com1);

      //    cf.b[9].call($this, cf, (k) => {
      //       cf.b[40] = arrconf[k].c;
      //       parseChildNode($this, cf, arrconf[k].n, true);
      //    });
      // } catch (e) {
      //    console.log(e);
      //    throw new Error(cf.b[40]);
      // }
   };
   push(pcf.c, conf);
} else if (tag === 'for') {
   let prop = getAttribute(node, '.');

   let com0 = cloneNode(gb_domcom);
   let com1 = cloneNode(gb_domcom);

   let conf = createNodeConf(com1, pcf);
   conf.b[10] = slice(prop.split(/\s+/g).filter(v => v !== ''), 0, 3);
   conf.b[11] = node;
   conf.b[12] = childNodes(content(node)); // 类型必须是实时的 NodeList
   conf.b[20] = com0;
   conf.b[21] = com1;
   conf.j = scope;
   conf.i = savepx;
   conf.e = (cf) => {
      assignScope($this, cf);
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
      if (cf.j) {
         cf.j = false;
         assignScope($this, cf);
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
      let sexp = codeExpScope(aks, 0);

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
                  while (length(arrcf)) {
                     let conf = pop(arrcf);
                     conf.j = true;
                     // 属性操作 也要 使用一次作用域设置
                     let ld = length(conf.d);
                     while (ld--) {
                        conf.d[ld].j = true;
                     }
                     for (let i = 0, l = length(conf.c); i < l; i++) {
                        push(arrcf, conf.c[i]);
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
               parseChildNode($this, cf, cloneNode(node, true), false);
            });
      }
   };
   push(pcf.c, conf);
} 