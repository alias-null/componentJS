
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
      _obj.insertBefore(pn, cf.b[8].s, pm);
      _obj.insertBefore(pn, cf.b[8].e, pm);
   } else {
      _obj.appendChild(pm, cf.b[8].s);
      _obj.appendChild(pm, cf.b[8].e);
   }
};

export default insertCommAuchToNode;