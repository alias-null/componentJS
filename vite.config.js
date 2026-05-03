import { defineConfig } from 'vite';

export default defineConfig({
   build: {
      // 设置兼容目标
      target: 'es2018',
      // 启用库模式
      lib: {
         // 入口文件，指向你的源码主文件
         entry: './component.js',
         // 库的全局变量名，当通过 <script> 标签引入时，会挂载到 window 上
         name: 'Component',
         // 指定输出格式为 UMD
         formats: ['umd'],
         // 生成的文件名
         fileName: (format) => `component.${format}.min.js`,
      },
   },
});