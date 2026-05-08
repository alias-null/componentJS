
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 当运行时执行的变量发生变化 递归将变量覆盖到父节点
 * @param {Array} a 
 * @param {Number} i
 * @returns 
 */
const codeAssignToPcf = (a, i) => {
   let k = _obj.join(a, ',');
   let s = _obj.arg(i);
   return `while(${s}){Object.assign(${s}.a,{${k}});${s}=${s}.p;}`;
};

export default codeAssignToPcf;