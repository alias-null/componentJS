
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import parseNodeElement from './parseNodeElement.js';
import parseNodeSwitch from './parseNodeSwitch.js';
import parseNodeIfelse from './parseNodeIfelse.js';
import parseNodeText from './parseNodeText.js';
import parseNodeFor from './parseNodeFor.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Number} pcf
 * @param {Node} node
 * @returns 
 */
const parseNodeAll = ($this, pcf, node) => {
   _obj.remove(node);
   let name = _obj.nodeName(node);
   let type = _obj.nodeType(node);
   if (type === 1) {
      let tag = _obj.getAttribute(node, '-');
      if (name === 'TEMPLATE') {
         if (tag === 'for') {
            parseNodeFor($this, pcf, node, tag);
         } else if (tag === 'ifelse') {
            parseNodeIfelse($this, pcf, node, tag);
         } else if (tag === 'switch') {
            parseNodeSwitch($this, pcf, node, tag);
         } else if (!pcf.c.has(node)) {
            parseNodeElement($this, pcf, node, name);
         }
      } else if (!pcf.c.has(node)) {
         parseNodeElement($this, pcf, node, name);
      }
   } else if (type === 3) {
      parseNodeText($this, pcf, node, name);
   }
};

export default parseNodeAll;