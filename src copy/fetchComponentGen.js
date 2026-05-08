
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import defineElementClass from './defineElementClass.js';

/**
 * 
 * @param {Node} doc 
 */
const fetchComponentGen = (doc) => {
   let querylist = _obj.querySelectorAll(doc, `[${_pam.s_attrname}*=".html"],[${_pam.s_attrname}*=".htm"]`)
      , i = _obj.length(querylist);
   if (i) {
      // 倒序 先注册的覆盖后注册的
      const domjson = {};
      while (i--) {
         let k = _obj.toLowerCase(_obj.nodeName(querylist[i]));
         domjson[k] = querylist[i];
      }
      const arrkey = _obj.keys(domjson);
      for (let i = 0, l = _obj.length(arrkey); i < l; i++) {
         if (_obj.indexOf(arrkey[i], '-') > -1) {
            const name = arrkey[i];
            fetch(_obj.getAttribute(domjson[name], _pam.s_attrname)).then(r => {
               if (r.status !== 200) {
                  return _pam.o_null;
               }
               return r.text().then(txt => ({ txt, url: r.url }));
            }).then(res => {
               if (res === _pam.o_null) {
                  return _pam.o_null;
               }
               if (_pam.o_customElements.get(name) !== _pam.o_undf) {
                  return _pam.o_null;
               }
               const domtemp = _obj.createElement(_pam.s_template);

               domtemp.innerHTML =
                  _obj.replace(res.txt, _reg.reg10, (s, s1) => {
                     s = _obj.trim(s);
                     s1 = _obj.toLowerCase(s1);
                     if (_pam.o_custempname.has(s1)) {
                        if (_obj.indexOf(s, '</') === 0) {
                           return `</${_pam.s_template}>`;
                        }
                        s = _obj.trim(_obj.substring(s, _obj.length(s1) + 1));
                        return `<${_pam.s_template}\x20-='${s1}'\x20${s}`;
                     } else if (s1 === _pam.s_template && _obj.indexOf(s, '</') !== 0) {
                        let i0 = _obj.indexOf(s, '.');
                        let i1 = _obj.indexOf(s, '=');
                        if (i0 > -1 && i1 > -1) {
                           s1 = _obj.trim(_obj.slice(s, i0 + 1, i1));
                           s = _obj.substring(s, i1);
                           return `<${_pam.s_template}\x20-='${s1}'\x20.${s}`;
                        }
                     }
                     return s;
                  });

               defineElementClass(
                  new URL(res.url),
                  name,
                  domtemp,
                  true
               );
            });
         };
      }
   }
};

export default fetchComponentGen;