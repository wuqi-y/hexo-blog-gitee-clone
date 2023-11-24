---
abbrlink: ''
categories: []
cover: ''
date: '2023-11-24T19:58:13.051416+08:00'
tags: []
title: 如何在静态页面构建并使用tailwindcss
updated: 2023-11-24T19:58:14.802+8:0
---
* ### 安装 Tailwind CSS

````npm install -D tailwindcss````

````npx tailwindcss init````

* ### 配置模板文件的路径

执行完上述操作会在根目录生成一个配置文件

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

* ### 将加载 Tailwind 的指令添加到你的 CSS 文件中

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

* ### 开启 Tailwind CLI 构建流程

  运行命令行（CLI）工具扫描模板文件中的所有出现的 CSS 类（class）并编译 CSS 代码。

  ```npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch```


* ### 在你的 HTML 代码中使用 Tailwind 吧

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/dist/output.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</body>
</html>
```

注意你的文件都要在配置的`** **content**:** **[**"./src/\*\*/\*.{html,js}"**]**,`比如这里都要在src目录下，可以根据需求来调整

<link href="/dist/output.css" rel="stylesheet"/>
