
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import parseNodeAll from './parseNodeAll.js';

/**
 * 
 * @param {HTMLElement} $this 
 * @param {Object} conf
 * @param {Node} node
 * @param {Function} callbak
 */
const parseChildNode = ($this, conf, node, callbak = () => { }) => {
   let nodelist = _obj.childNodes(node);
   let arr = [];
   for (let i = 0, l = _obj.length(nodelist); i < l; i++) {
      arr[i] = nodelist[i];
   }

   for (let i = 0, l = _obj.length(arr); i < l; i++) {
      parseNodeAll($this, conf, arr[i]);
   }

   // 避免子节点迭代动态重复计算 等迭代结束再处理子元素 
   if (conf.c) {
      let pr = conf.r;
      for (let scf of _obj.terValues(conf.c)) {
         callbak($this, scf);
         scf.e(scf);
         scf.c = _obj.newMap();
         parseChildNode($this, scf, scf.n, callbak);
      }
      // console.log(conf.c, conf.n);
   }
};

export default parseChildNode;