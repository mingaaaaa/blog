---
title: electron镜像地址设置
author: ming
date: '2021-07-22'
---

### 环境搭建

使用`electron`时可能会出现下载报错的现象，这个时候就需要更改`electron`的源的地址，切换为淘宝的就可以下载了，使用下面的命令即可。

```bash
$ npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
```

我在写demo的时候出现了编译错误，


这里会发现要编译的页面是乱码，排查后发现是`package-lock.json`文件出了问题，部分依赖的地址在使用`npm install`命令时会将淘宝的地址改为npm的地址，在编译的时候就会导致报错。

如果使用朱博龙的文件夹直接下载就可以运行，同时使用npm i命令时依赖的地址也不会改变，猜测可能是项目配置或者npm配置的问题，同时只要更改代码就会报错，暂不清楚原因