
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {Object} cf 
 */
const insertNodeAuchToNode = (cf) => {
   let pm = cf.p.m;
   if (cf.p.t === 8) {
      _obj.insertBefore(_obj.parentNode(pm), cf.m, pm);
   } else {
      _obj.appendChild(pm, cf.m);
   }
};

export default insertNodeAuchToNode;