
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 执行函数列表
 * @param {HTMLElement} $this 
 * @param {Map} mapcf 
 */
const callConfFunRec = ($this, mapcf, callbak = () => { }) => {
   if (mapcf) {
      let values = _obj.terValues(mapcf);
      for (let conf of values) {
         callbak($this, conf);
         $this.$fc = conf;
         conf.f($this, conf);
         $this.$fc = _pam.gb_null;

         let arr = conf.d, il;
         if (arr && (il = _obj.length(arr))) {
            for (let i = 0; i < il; i++) {
               let dcf = arr[i];
               $this.$fc = dcf;
               dcf.f($this, dcf);
               $this.$fc = _pam.gb_null;
            }
         }

         callConfFunRec($this, conf.c, callbak);
      }
   }
};

export default callConfFunRec;