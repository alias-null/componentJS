
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Node} m 
 * @param {Node|Null} n 
 * @param {Object|Null} p 
 * @returns 
 */
const createNodeConf = (m, n, p) => {
   return {
      a: {}, // 作用域
      b: {}, // 备用参数
      c: _obj.newMap(), // 子节点 配置列表
      d: _pam.o_null, // 属性节点 配置列表
      e: () => { }, // 函数
      f: () => { }, // 函数
      m, // 操作锚点
      n, // 操作锚点
      p, // 父节点 配置
      r: true, // f 的执行关联项
      s: true, // 是否设置作用域
      t: _obj.nodeType(m), // 存储锚点的类型
   };
};

export default createNodeConf;