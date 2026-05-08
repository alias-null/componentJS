
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 可遍历 Map | Set | Array | Object | String | Number | TypeArray
 * String | Number | TypeArray 使用和 Array 一样的遍历方法
 * @param {Object} a 
 * @returns {Array|Null}
 */
const forGetTypeLen = (a) => {
   let t = _obj.getType(a).replace(_pam.s_Proxy, '');
   switch (t) {
      case _pam.s_Map:
      case _pam.s_Set: return [t, _obj.size(a)];
      case _pam.s_Object:
         a = _obj.keys(a);
      case _pam.s_Array:
      case _pam.s_String: return [t, _obj.length(a)];
      case _pam.s_Number: // 数字只能从 0 开始
         return Number.isNaN(a) || a < 0 ? _pam.o_null : [t, a];
      default:
         t = t.slice(-5);
         return t === _pam.s_Array
            ? [t, _obj.length(a)] : _pam.o_null;
   }
};

export default forGetTypeLen;