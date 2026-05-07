
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 执行函数列表
 * @param {HTMLElement} $this 
 * @param {Map} objcf 
 */
const callConfFunRec = ($this, objcf, callbak = () => { }) => {
   if (objcf && _obj.size(objcf)) {
      // console.log('call for before==>>>>', objcf);
      let ter = _obj.terValues(objcf);
      // console.log('==>>>>', ter);
      for (let conf of ter) {
         // console.log('==>>>>', conf);
         if (conf.p.r === true || conf.r === conf.p.r) {
            // console.log('call before>>', conf, 'r>>', conf.r);
            callbak($this, conf);
            $this.$fc = conf;
            conf.f($this, conf);
            $this.$fc = _pam.gb_null;
            // console.log('call after>>', conf, 'r>>', conf.r);

            let arr = conf.d, il;
            if (arr && (il = _obj.length(arr))) {
               for (let i = 0; i < il; i++) {
                  let dcf = arr[i];
                  $this.$fc = dcf;
                  dcf.f($this, dcf);
                  $this.$fc = _pam.gb_null;
               }
            }

            // 此处固定使用 .c 
            callConfFunRec($this, conf.c, callbak);
         }
      }
   }
};

export default callConfFunRec;