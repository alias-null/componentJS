
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import defineClass from './defineClass.js';

/**
 * 
 * @param {Node} doc 
 */
const parseTemplateComponent = (doc) => {
   let attr = 'component';
   let domlist = _obj.querySelectorAll(doc, `[${attr}*="-"]`);
   for (let i = 0, l = _obj.length(domlist); i < l; i++) {
      const domtemp = domlist[i];
      const name = _obj.getAttribute(domtemp, attr);
      domtemp.replaceWith(_obj.createElement(name));

      defineClass(
         location,
         name,
         domtemp,
         false
      );
   }
};

export default parseTemplateComponent;