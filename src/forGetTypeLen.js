
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
   let t = _obj.getType(a).replace('Proxy', '');
   switch (t) {
      case 'Map': return [t, _obj.size(a)];
      case 'Set': return [t, _obj.size(a)];
      case 'Array': return [t, _obj.length(a)];
      case 'Object': return [t, _obj.length(_obj.keys(a))];
      case 'String': return [t, _obj.length(a)];
      case 'Number': // 数字只能从 0 开始
         return Number.isNaN(a) || a < 0 ? _pam.gb_null : [t, a];
      default:
         let i = _obj.indexOf(t, 'Array');
         return i > -1 ? [_obj.substring(t, i), _obj.length(a)] : _pam.gb_null;
   }
};

export default forGetTypeLen;