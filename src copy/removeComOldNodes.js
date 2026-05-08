
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

const removeComOldNodes = (com0, com1) => {
   let c0 = _obj.nextSibling(com0);
   while (c0 && c0 !== com1) {
      let c1 = c0;
      c0 = _obj.nextSibling(c0);
      _obj.remove(c1);
   }
};

export default removeComOldNodes;