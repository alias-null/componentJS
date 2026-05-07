
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {Proxy} target 
 */
const callPxyConfRec = ($this, target) => {
   console.log(
      $this.$fp
   );
   // console.log(
   //    $this.$fp.get(target)
   // );
};

export default callPxyConfRec;