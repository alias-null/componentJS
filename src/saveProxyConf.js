

/**
 * 模板函数执行 触发数据读取 自动收集依赖函数 存储为顺序集合列表
 * @param {HTMLElement} $this 
 * @param {Object} target 
 */
const saveProxyConf = ($this, target) => {
   if ($this.$fc) {
      let objconf = $this.$fp.get(target);
      if (objconf) {
         objconf.add($this.$fc);
      } else {
         $this.$fp.set(target, new Set([$this.$fc]));
      }
   }
};

export default saveProxyConf;