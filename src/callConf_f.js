
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {Proxy} target 
 */
const callConf_f = ($this, target) => {
   console.log(
      $this.$fp
   );
   // console.log(
   //    $this.$fp.get(target)
   // );
};

export default callConf_f;