# 轻量级 Web Component 解析库

这是一个基于 Web Component 构建的轻量级单文件 HTML 解析库。它旨在让你在浏览器中直接享受组件化开发的便利，无需复杂的构建工具。

本库支持 UMD 打包，既可以通过 CDN 直接在页面中引入使用，也支持通过自定义标签远程加载单文件 HTML 组件。它提供了一套简洁的响应式数据绑定语法，让你在 HTML 中直接书写逻辑与视图。

## 核心特性

- **零构建开发**：支持单文件 HTML 开发，无需 Webpack/Vite 等构建工具。
- **原生 Web Component**：基于标准 Web Component API，轻量且无依赖。
- **响应式数据驱动**：内置 `val` 函数，实现数据到视图的自动更新。
- **灵活的模板语法**：支持文本插值、属性绑定、DOM 原型操作以及流程控制（if/for/switch）。
- **双模式支持**：既支持在现有页面中解析 `<template>`，也支持远程加载独立 `.html` 组件。

## 快速开始

### 安装与引入

由于库打包为 UMD 格式，你可以直接通过 `<script>` 标签引入：

```
<script src="path/to/component.umd.min.js"></script>
```

### 模式一：远程加载单文件组件 (推荐)

这是本库最核心的用法。你可以定义一个自定义标签（如 `<w-test>`），通过 `html` 属性指定组件路径。

**主页面 (index.html):**

```
<body>
  <!-- 远程加载单文件组件 -->
  <w-test html="/components/my-component.html"></w-test>
</body>
```

**组件文件 (/components/my-component.html):**

在单文件中，你可以直接编写 HTML，无需 `<template>` 包裹。

```
<!-- 1. 定义逻辑与数据 -->
<script>
  const { val } = this; // this 指向 Web Component 实例
  const str = val('World'); // 定义响应式数据
  return { str }; // 暴露给模板使用
</script>

<!-- 2. 定义视图 -->
<h1>Hello ${str.val}</h1>

<!-- 支持纯文本节点，无需根标签 -->
<script>
   const {val}=this; 
   const msg = val('这是纯文本'); 
   return {msg}
</script>
${msg.val}
```

### 模式二：页面内直接解析

如果在当前页面直接使用，为了避免浏览器的默认解析行为，使用 `<template>` 标签包裹组件内容，并指定 `component` 属性。

```
<body>
  <!-- 页面中直接编写组件 -->
  <template component="my-inline-comp">
    <script>
        const {val} = this;
        const str = val('world');
        return {str};
    </script>
    <div>hello ${str.val}</div>
  </template>
</body>
```

## 语法指南

本库提供了丰富的指令和绑定方式，让你能够精细地控制 DOM。

### 数据绑定

**文本插值 **`${}`:
用于文本节点中，直接显示数据。

```
<script>
   const {val}=this; 
   const str=val('World'); 
   return{str}
</script>
<h1>Hello ${str.val}</h1>
```

**DOM 绑定 **`#`:
用于直接将数据绑定到 DOM 元素。注意：使用 `#` 绑定时，数据对象不需要加 `.val`。

```
<script>
   const {val,called}=this; 
   const dom=val(); 
   called(()=>{
      console.log(dom.val);
   });
   return{dom}
</script>
<!-- 绑定元素 -->
<div #="dom"></div>
```

### 属性操作

**DOM 原型操作 **`.`:
直接操作 DOM 元素的属性或原型属性（如 style, className）。

```
<div .="style.border='1px solid red'"></div>
```

**SetAttribute 操作 **`..`:
等同于调用 `dom.setAttribute(key, value)`。

```
<div ..="data-test=str.val"></div>
```

### 流程控制

在单文件 HTML 中，你可以直接使用以下标签进行逻辑控制（在页面内联模式下需包裹在 `<template>` 中）：

**条件渲染 (**`<if>`**, **`<else>`**, **`<else-if>`**)**

```
<if .="str.val === 'World'">
  <h1>Hello World</h1>
</if>
<else .="str.val === 'sir'">
  <h1>Hello Stranger</h1>
</else>
<else>
  <h1>Hello Stranger</h1>
</else>
```

**列表渲染 (**`<for>`**)**

```
<for .="item in list">
  <li>${item.name}</li>
</for>
```

**条件判断 (**`<switch>`**, **`<case>`**, **`<default>`**)**

```
<switch .="status" break>
  <case .="'success'">Success!</case>
  <case .="'error'">Error!</case>
  <default>Unknown Status</default>
</switch>
```

## 核心 API

在组件的 `<script>` 标签中，`this` 指向当前的 Web Component 实例。

### 生命周期与工具

`this.val(initialValue)`:
定义响应式数据。返回一个包含 `.val` 属性的对象。当 `.val` 改变时，视图会自动更新。

`this.module(moduleName)`:
获取模板中加载的外部模块或依赖。

`this.called()`:
**关键生命周期钩子**。

该函数在组件的 DOM 解析完成且数据加载完毕后执行。

- **用途**：用于将 script 中的数据最终绑定到真实的 DOM 上，或者执行依赖 DOM 孌在的初始化逻辑。
- **时机**：它是连接数据层与视图层的最后一环。

## 总结

这个库通过极简的设计，将现代前端框架的响应式体验带回了原生的 HTML 开发中。无论是通过 CDN 快速引入，还是构建独立的单文件组件，都能让你以更少的代码实现更复杂的交互。

