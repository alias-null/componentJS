
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Object} a 
 * @returns 
 */
const getTypeLength = (a) => {
   let t = _obj.getType(a).replace('Proxy', '');
   switch (t) {
      case 'Map': return [t, _obj.size(a)];
      case 'Set': return [t, _obj.size(a)];
      case 'Array': return [t, _obj.length(a)];
      case 'Number': return [t, _obj.length(a)];
      case 'String': return [t, _obj.length(a)];
      case 'Object': return [t, _obj.length(_obj.keys(a))];
   }
};

export default getTypeLength;