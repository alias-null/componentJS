
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 增加代码压缩率
 * 递归设置作用域 共享作用开始 再从顶级祖先到父节点结束
 * @param {HTMLElement} $this 组件 HTMLElement
 * @param {Object} cf 配置 索引 a 存储目标作用域变量 索引 i 存储ID 其中 0 为父节点id
 * @return {Object} 返回父节点配置
 */
const assignScope = ($this, cf) => {
   // 先从共享作用域开始
   _obj.assign(cf.a, $this.$vd);
   if (cf.p) {
      let arr = [];
      let pcf = cf.p;
      while (pcf) {
         _obj.push(arr, pcf.a);
         pcf = pcf.p;
      }
      // 从祖先作用域开始到父节点作用域结束
      for (let i = _obj.length(arr) - 1; i >= 0; i--) {
         _obj.assign(cf.a, arr[i]);
      }
   }
};

export default assignScope;