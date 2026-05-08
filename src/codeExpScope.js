
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Array} a 
 * @param {Number} i
 * @returns 
 */
const codeExpScope = (a, i) =>
   `${_pam.s_usestrict}let\x20{${_obj.join(a, ',')}}=${_obj.arg(i)}.a;`;

export default codeExpScope;