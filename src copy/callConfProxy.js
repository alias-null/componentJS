
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 单点执行 只需执行数据依赖的集合 无需递归集合内的配置的后代
 * @param {HTMLElement} $this 
 * @param {Proxy} objcf 
 */
const callConfProxy = ($this, objcf, callbak = () => { }) => {
   if (objcf && _obj.size(objcf)) {
      for (let conf of _obj.terValues(objcf)) {
         // console.log('PxyCall before>>', conf, 'r>>', conf.r);

         if (conf.p.r === true || conf.r === conf.p.r) {
            callbak($this, conf);
            $this.$fc = conf;
            conf.f($this, conf);
            $this.$fc = _pam.o_null;
            // console.log('PxyCall after>>', conf, 'r>>', conf.r);
         }
      }
   }
};

export default callConfProxy;