---
title: nvm的安装及常用指令
author: ming
date: '2021-04-29'
---

### 安装nvm

nvm的安装地址是：https://github.com/coreybutler/nvm-windows/releases，下载的时候直接下`nvm-setup.zip`就行了。下载之后解压，里面就一个安装程序。

安装的时候除了安装路径需要更改一下其余的都默认就行，这里要注意的是安装nvm之前要确保电脑上没有node.js,并且安装完毕后要重新配置环境变量。

### nvm管理Node.js

  1、查看本地安装的所有版本；有可选参数available，显示所有可下载的版本。

```
nvm list [available]
```

  2、安装，命令中的版本号可自定义，具体参考命令1查询出来的列表

```
nvm install 14.16.0
```

  3、使用特定版本的Node.js

```
nvm use 14.16.0
```

  4、卸载node.js

```
nvm uninstall 14.16.0
```

### nvm的常用命令

1. `nvm arch`：显示node是运行在32位还是64位。
2. `nvm install <version> [arch]`：安装node， version是特定版本也可以是最新稳定版本latest。可选参数arch指定安装32位还是64位版本，默认是系统位数。可以添加--insecure绕过远程服务器的SSL。
3. `nvm list [available]`：显示已安装的列表。可选参数available，显示可安装的所有版本。list可简化为ls。
4. `nvm on`：开启node.js版本管理。
5. `nvm off`：关闭node.js版本管理。
6. `nvm proxy [url]`：设置下载代理。不加可选参数url，显示当前代理。将url设置为none则移除代理。
7. `nvm node_mirror [url] `：设置node镜像。默认是https://nodejs.org/dist/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
8. `nvm npm_mirror [url]`：设置npm镜像。https://github.com/npm/cli/archive/。如果不写url，则使用默认url。设置后可至安装目录settings.txt文件查看，也可直接在该文件操作。
9. `nvm uninstall <version>`：卸载指定版本node。
10. `nvm use [version] [arch]`：使用制定版本node。可指定32/64位。
11. `nvm root [path]`：设置存储不同版本node的目录。如果未设置，默认使用当前目录。
12. `nvm version`：显示nvm版本。version可简化为v。

<span style="color:red;font-size:24px">这里一定要主要注意一下，一定要在NVM目录下的`setting.txt`文件中添加下面两行命令，否则npm无法下载成功</span>

```
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
```

其实也可以通过命令改，不过这种方式更方便一点。