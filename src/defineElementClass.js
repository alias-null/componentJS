
import * as _reg from './regex.js';
import * as _obj from "./object.js";
import * as _pam from './param.js';

import CusElement from './CusElement.js';

/**
 * 注册 Element class 组件
 * @param {URL} objurl 来源 URL 对象
 * @param {String} tagname 组件标签名
 * @param {HTMLTemplateElement} domtemp 模板 html 
 * @param {Boolean} sethref 是否设置 href 到配置中
 */
const defineElementClass = (objurl, tagname, domtemp, sethref = true) => {
   const Component = class extends CusElement { }
      , orig = objurl.origin
      , file = _obj.replace(objurl.pathname, /[\/]+/g, '/');
   Component.$cf = {
      base: orig + _obj.slice(file, 0, _obj.lastIndexOf(file, '/') + 1),
      href: sethref ? (orig + file) : _pam.gb_undf,
      attr: _pam.gb_attrname,
      name: tagname,
      temp: domtemp,
   };
   customElements.define(tagname, Component);
};

export default defineElementClass;