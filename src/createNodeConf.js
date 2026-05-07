
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Node} m 
 * @param {Object} p 
 * @returns 
 */
const createNodeConf = (m = _pam.gb_null, p = _pam.gb_null, c = new Map(), d = []) => {
   return {
      a: {}, // 作用域
      b: {}, // 备用参数
      c, // 子节点 配置列表
      d, // 属性节点 配置列表
      e: () => { },
      f: () => { },
      m, // 操作锚点
      p, // 父节点 配置
      s: _pam.gb_null, // f 的执行关联项
      t: _obj.nodeType(m)
   };
};

export default createNodeConf;