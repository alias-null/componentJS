
import {
   o_window as window,
   o_document as document,
} from "./src/param.js";

import * as _reg from './src/regex.js';
import * as _obj from "./src/object.js";
import * as _pam from './src/param.js';

import fetchComponentGen from './src/fetchComponentGen.js';
import parseTemplateComponent from './src/parseTemplateComponent.js';

// 文档加载完成
_obj.addEventListener(window, 'DOMContentLoaded', () => {
   fetchComponentGen(document);
   parseTemplateComponent(document);
}, _pam.o_eventconf);