
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Object} cf 
 */
const insertCommAuchToNode = (cf) => {
   let pm = cf.p.m;
   if (cf.p.t === 8) {
      let pn = _obj.parentNode(pm);
      _obj.insertBefore(pn, cf.b[20], pm);
      _obj.insertBefore(pn, cf.b[21], pm);
   } else {
      _obj.appendChild(pm, cf.b[20]);
      _obj.appendChild(pm, cf.b[21]);
   }
};

export default insertCommAuchToNode;