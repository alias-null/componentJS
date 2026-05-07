
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import promiseDomOnLoad from './promiseDomOnLoad.js';

/**
 * 
 * @param {HTMLElement} $this
 * @param {Node} node
 * @param {Array} arrps 
 * @param {Array} arrjsi 
 * @param {Object} objtemp 
 */
const parseBeforeHandle = ($this, node, arrps, arrjsi, objtemp) => {
   let childs = _obj.childNodes(node);
   for (let i = _obj.length(childs) - 1; i >= 0; i--) {
      let node = childs[i];
      switch (_obj.nodeName(node)) {
         case 'LINK':
            if (_obj.toLowerCase(node.rel) === 'stylesheet'
               && _obj.indexOf(_obj.toLowerCase(_obj.href(node)), '.css') > -1) {
               _obj.push(arrps, promiseDomOnLoad(node));
               _obj.insertBefore($this.$sd, node, _obj.firstChild($this.$sd));
            } else {
               _obj.remove(node);
            }
            break;

         case 'STYLE':
            if (_obj.trim(_obj.textContent(node)) !== '') {
               _obj.push(arrps, promiseDomOnLoad(node));
               _obj.insertBefore($this.$sd, node, _obj.firstChild($this.$sd));
            } else {
               _obj.remove(node);
            }
            break;

         case 'SCRIPT':
            _obj.remove(node);
            let src = node.src
               , typ = node.type
               , txt = _obj.trim(_obj.textContent(node));
            if (!!src) {
               let s = new URL(src, $this.$cf.base), h = _obj.href(s);
               if (typ === 'module'
                  && _pam.gb_modules.get(h) === _pam.gb_undf) {
                  _obj.push(
                     arrps,
                     import(h).then(m => {
                        let res = { s: src, h };
                        if (m.default !== _pam.gb_undf) {
                           res.o = m.default;
                           return res;
                        }
                        let arrkey = _obj.keys(m);
                        if (_obj.length(arrkey) > 0) {
                           res.o = {};
                           for (let j = 0, jl = _obj.length(arrkey); j < jl; j++) {
                              res.o[arrkey[j]] = m[arrkey[j]];
                           }
                           return res;
                        }
                        return _pam.gb_undf;
                     })
                  );
                  _obj.push(arrjsi, _obj.length(arrps) - 1);
               } else if (!typ && _obj.indexOf(s.pathname, '.js') >= 0) {
                  _obj.push(
                     arrps,
                     fetch(h)
                        .then(r => r.status !== 200 ? _pam.gb_undf : r.text())
                  );
                  _obj.push(arrjsi, _obj.length(arrps) - 1);
               }
            } else if (!!txt && !typ) {
               if (_obj.hasAttribute(node, _pam.gb_onload)) {
                  _obj.push(
                     arrps,
                     _obj.promiseResolve({ s: _pam.gb_onload, o: txt })
                  );
               } else if (_obj.hasAttribute(node, _pam.gb_onunload)) {
                  _obj.push(
                     arrps,
                     _obj.promiseResolve({ s: _pam.gb_onunload, o: txt })
                  );
               } else if (_obj.hasAttribute(node, _pam.gb_onadopt)) {
                  _obj.push(
                     arrps,
                     _obj.promiseResolve({ s: _pam.gb_onadopt, o: txt })
                  );
               } else {
                  _obj.push(
                     arrps,
                     _obj.promiseResolve({ s: _pam.gb_onload, o: txt })
                  );
               }
               _obj.push(arrjsi, _obj.length(arrps) - 1);
            }
            break;

         case 'TEMPLATE':
            let tag = _obj.getAttribute(node, '-');
            if (tag === 'if' || tag === 'for' || tag === 'switch') {
               _obj.push(objtemp[tag], node);
            }
            break;

         case '#text':
            if (_obj.trim(_obj.textContent(node)) === '') {
               _obj.remove(node);
            }
            break;

         default:
            if (_obj.nodeType(node) !== 1) {
               _obj.remove(node);
            }
            break;
      }
      parseBeforeHandle($this, node, arrps, arrjsi);
   }
};

export default parseBeforeHandle;