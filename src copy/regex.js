

export const reg0 = /(?<!\\)\$\{[^\$\}]*(?:\`.*?\`)*[^\$\{]*\}/gs;
export const reg1 = /([^'";=\s]+)\s*=\s*(?:([^'";]*)|('[^']*'|"[^"]*"))?/gs;
export const reg2 = /(?<!\\)\$\{.*?\}/gs;
export const reg3 = /[\+\-\*\/\%\^\&\<\>\?\|\~]+=|[\+\-]{2}|[_a-zA-Z$][\w\$\.]*\(.*?\)/s;

export const reg4 = /([^'";=\s]+)\s*=([^;\n]*)[\n\;]?/gs;
export const reg5 = /[_a-zA-Z$][\w\$\.]*/s;
export const reg6 = /(['"])?[_a-zA-Z$][\w\$\.]*(['"])?/gs;
export const reg7 = /\<\/?(if|else|for|switch|case|default)\s*(?:\.\s*=\s*("[^"]*?"|'[^']*?')?)?\s*\>/gsi;
export const reg8 = /\s*<[^<>]+(?:[^<>]*=(?:"[^"]*"|'[^']*'))*?\s*>\s*/gs;

export const reg9 = /\s*<([^<>"'=\s]+)(?:[^<>"'=]*(?:=("[^"]*"|'[^']*'))?)*?\s*>\s*/gs;

export const reg10 = /\s*<\/?([^<>"'=\s]+)(?:[^<>"'=]*(?:=(?:"[^"]*"|'[^']*'))?)*?\s*>\s*/gs;