
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import callConfProxy from './callConfProxy.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {*} data 
 * @returns 
 */
const createProxy = ($this, data) => new Proxy(data, {
   // 拦截 deleteProperty（delete 操作）
   deleteProperty(target, key) {
      let res = Reflect.deleteProperty(target, key);
      // console.log('deleteProperty setter',);

      callConfProxy($this, $this.$fp.get(target));

      return res;
   }

   // // 拦截 defineProperty（Object.defineProperty）
   // , defineProperty(target, key, descriptor) {
   //    let res = Reflect.defineProperty(target, key, descriptor);
   //    console.log('defineProperty setter',);

   //    callConfProxy($this, $this.$fp.get(target));

   //    return res;
   // }

   , get(target, key, receiver) {
      console.log('getter',);
      if (key === Symbol.toStringTag) {
         return `${_pam.s_Proxy}${_obj.getType(target)}`;
      }

      let val = target[key];
      let valtyp = _obj.getType(val);

      if (valtyp === _pam.s_Function) {
         if (_pam.o_pxymth.has(key)) {
            return function () {
               // console.log(`function ${key} setter`,);
               let res = val.apply(target, arguments);

               callConfProxy($this, $this.$fp.get(target));

               return res;
            };
         }


         // 模板函数执行 触发数据读取 自动收集依赖函数 存储为顺序集合列表
         // 取出执行时不能递归 因为读取时已经递归执行
         if ($this.$fc) {
            let objconf = $this.$fp.get(target);
            if (objconf) {
               if (!objconf.has($this.$fc)) {
                  objconf.add($this.$fc);
               }
            } else {
               $this.$fp.set(target, new Set([$this.$fc]));
            }
         }


         if (key === 'toString') {
            let tartyp = _obj.getType(target);
            if (tartyp === _pam.s_Set) {
               return function () {
                  let k = -1;
                  let a = [];
                  for (let v of target) {
                     a[++k] = v;
                  }
                  return a;
               };
            }
            if (tartyp === _pam.s_Map) {
               return function () {
                  let a = [];
                  for (let v of target) {
                     _obj.push(a, v);
                  }
                  return a;
               };
            }
            if (tartyp === _pam.s_Array
               || tartyp === _pam.s_Object) {
               return function () {
                  return JSON.stringify(target);
               };
            }
         }

         return function () {
            return val.apply(target, arguments);
         };
      }

      // 模板函数执行 触发数据读取 自动收集依赖函数 存储为顺序集合列表
      // 取出执行时不能递归 因为读取时已经递归执行
      if ($this.$fc) {
         let objconf = $this.$fp.get(target);
         if (objconf) {
            if (!objconf.has($this.$fc)) {
               objconf.add($this.$fc);
            }
         } else {
            $this.$fp.set(target, new Set([$this.$fc]));
         }
      }

      if (
         valtyp.slice(-5) === _pam.s_Array
         || valtyp === _pam.s_Array
         || valtyp === _pam.s_Object
         || valtyp === _pam.s_Set
         || valtyp === _pam.s_Map
      ) {
         return createProxy($this, val);
      }

      return val;
   }

   , set(target, key, val, receiver) {
      let valtyp = _obj.getType(val);
      if (_obj.indexOf(valtyp, _pam.s_Proxy) === 0) {
         if (val.$ === $this) {
            val = val.val;
         }
      } else if (
         valtyp.slice(-5) === _pam.s_Array
         || valtyp === _pam.s_Array
         || valtyp === _pam.s_Object
         || valtyp === _pam.s_Set
         || valtyp === _pam.s_Map
      ) {
         val = createProxy($this, val);
      }

      // console.log('setter',);

      let res = Reflect.set(target, key, val, receiver);

      callConfProxy($this, $this.$fp.get(target));

      return res;
   }
});

export default createProxy;