---
abbrlink: ''
categories: []
cover: /img/image/5.jpg
date: '2023-11-02T09:45:26.993702+08:00'
tags:
- windowns
title: Windows操作系统生成SSH密钥
updated: 2023-11-2T9:52:34.487+8:0
---
**在Windows上生成SSH密钥可以通过以下简单步骤：**

1. 创建公钥（如果在cmd窗口不可执行，请下载gitbash执行）

```cmd
ssh-keygen -t rsa -C "youremail@example.com"
```

2. 输入完毕后按回车，到底即可，此时 c盘——用户——用户名——.ssh文件夹 里面生成好了“id\_rsa”和“id\_rsa.pub”文件（*不一定是一样的位置，会有提示请以自己的目录为准*）。
3. 将公钥添加到需要访问的服务器上的authorized\_keys文件中。
4. 使用私钥进行SSH连接。
