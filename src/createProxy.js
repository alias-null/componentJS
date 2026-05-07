
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {*} data 
 * @returns 
 */
const createProxy = ($this, data) => {
   let $fp = $this.$fp;
   return new Proxy(data, {
      // 拦截 deleteProperty（delete 操作）
      deleteProperty(target, key) {
         let res = Reflect.deleteProperty(target, key);
         log('deleteProperty setter',);

         callConf_f($this, target);

         return res;
      }

      // // 拦截 defineProperty（Object.defineProperty）
      // , defineProperty(target, key, descriptor) {
      //    let res = Reflect.defineProperty(target, key, descriptor);
      //    log('defineProperty setter',);

      //    callConf_f($this, target);

      //    return res;
      // }

      , get(target, key, receiver) {
         if (key === Symbol.toStringTag) {
            return `Proxy${_obj.getType(target)}`;
         }

         let val = target[key];
         // log('getter',);

         if (_obj.isFun(val)) {
            if (_pam.gb_mutating_mth.has(key)) {
               return function () {
                  // log(`function ${key} setter`,);
                  let res = val.apply(target, arguments);

                  callConf_f($this, target);

                  return res;
               };
            }


            // 模板函数执行 触发数据读取 自动收集依赖函数 存储为顺序集合列表
            // 取出执行时不能递归 因为读取时已经递归执行
            if ($this.$fc) {
               let arrconf = $fp.get(target);
               if (arrconf) {
                  _obj.push(arrconf, $this.$fc);
               } else {
                  $fp.set(target, [$this.$fc]);
               }
            }


            if (key === 'toString') {
               if (_obj.isSet(target)) {
                  return function () {
                     let k = -1;
                     let a = [];
                     for (let v of target) {
                        a[++k] = v;
                     }
                     return a;
                  };
               }
               if (_obj.isMap(target)) {
                  return function () {
                     let a = [];
                     for (let v of target) {
                        _obj.push(a, v);
                     }
                     return a;
                  };
               }
               if (_obj.isArr(target) || _obj.isObj(target)) {
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
            let arrconf = $fp.get(target);
            if (!arrconf) {
               $fp.set(target, [$this.$fc]);
            } else if (_obj.indexOf(arrconf, $this.$fc) < 0) {
               _obj.push(arrconf, $this.$fc);
            }
         }


         if (_obj.isArr(val)
            || _obj.isObj(val)
            || _obj.isSet(val)
            || _obj.isMap(val)) {
            return createProxy($this, val);
         }

         return val;
      }

      , set(target, key, val, receiver) {
         log('setter',);
         let res = Reflect.set(target, key, val, receiver);

         callConf_f($this, target);

         return res;
      }
   });
};

export default createProxy;