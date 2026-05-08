
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

/**
 * 执行函数列表
 * @param {HTMLElement} $this 
 * @param {Map} objcf 
 */
const callConfRecF = ($this, objcf, callbak = () => { }) => {
   let a = [objcf];
   while (_obj.length(a)) {
      let objcf = _obj.pop(a);
      if (objcf && _obj.size(objcf)) {
         for (let conf of _obj.terValues(objcf)) {
            if (conf.p.r === true || conf.r === conf.p.r) {
               // console.log('call before>>', conf, 'r>>', conf.r);
               callbak($this, conf);
               $this.$fc = conf;
               conf.f($this, conf);
               $this.$fc = _pam.o_null;
               // console.log('call after>>', conf, 'r>>', conf.r);

               let arr = conf.d, il;
               if (arr && (il = _obj.length(arr))) {
                  for (let i = 0; i < il; i++) {
                     let dcf = arr[i];
                     $this.$fc = dcf;
                     dcf.f($this, dcf);
                     $this.$fc = _pam.o_null;
                  }
               }

               // 此处固定使用 .c 
               if (_obj.size(conf.c)) {
                  _obj.push(a, conf.c);
               } else {
                  // console.log(conf.b[10]);
                  // for (let i = _obj.length(conf.b[10]) - 1; i >= 0; i--) {
                  //    _obj.push(a, conf.b[10][i]);
                  //    // // 执行分支后代节点
                  //    // callConfRecF($this, conf.b[10][i], ($this, cf) => {
                  //    //    if (cf.s) {
                  //    //       // assignScope($this, cf);
                  //    //    }
                  //    // });
                  // }
               }
            }
         }
      }
   }
};

export default callConfRecF;