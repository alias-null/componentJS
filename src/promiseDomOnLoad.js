
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

const promiseDomOnLoad = (a) => new Promise((resolve, reject) => {
   _obj.addEventListener(
      a,
      'load',
      () => resolve(a),
      _pam.gb_event_once_conf
   );
   _obj.addEventListener(
      a,
      'error',
      () => reject(a),
      _pam.gb_event_once_conf
   );
});

export default promiseDomOnLoad;