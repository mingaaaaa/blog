---
title: electron的使用
author: ming
date: '2021-07-26'
---

### 一、注册PC菜单

PC端的菜单需要先在web的菜单定义中先定义，注册菜单时大致和web端注册页面没有区别，但是以下有几个需要注意的点：

1. 关系URL可以不填，维护rel页面名称且必填。

2. 在注册菜单时将系统标识选择为PC，部分人在这个时候可能会没有PC类型只有WEB和APP类型，这个时候需要查看web端代码是否是最新的版本。如果项目的代码不是最新的产品代码可能会没有PC选项，这个时候需要在web代码中找到`menu.vue`文件，然后定位到562行的代码，在数组中添加代码`menuField.systemFlag.PC`，添加后的代码如下所示：

   ```javascript
   systemFlagOptions: [menuField.systemFlag.SYSTEM, menuField.systemFlag.PDA,menuField.systemFlag.PC]
   ```

   然后在`src`→`util`→`staticConfig.js`中找到`systemFlag`对象，添加PC属性，添加后的代码如下所示:

   ```javascript
     systemFlag: {
       SYSTEM: {
         value: "SYSTEM",
         label: "WEB",
       },
       PDA: {
         value: "PDA",
         label: "APP",
       },
       PC: {
         value: "PC",
         label: "PC",
       },
     },
   ```

   刷新web页面后就会在类型中新增PC选项。

3. 菜单样式一定要填，虽然该选项不是必填，但在PC端中菜单选项的显示是有图标的，所以如果不填菜单会无法显示。菜单的默认样式为`img:test1.png,#4f93f2,3,4,1`，可以看到有四个逗号，第一个是菜单的图片名称，第二个是菜单图标的颜色，后面的三个数字中的3是菜单层级，4和1保持一致即可。扩展字段必填，但不做要求，一般填入03或者04即可。

   示例：

   ![](https://gitee.com/zhang_yang_ming/image/raw/master/image-20210908154219400.png)

### 二、注册路由

👏路由注册在`router`→`index.ts`文件中进行，但是为了方便管理建立了`routes.ts`文件专门存放路由。

> 🚩为了区分项目的路由和产品的路由，建议新建一个`project-routes.ts`文件，然后导入到`routes.ts`文件中，这样会更方便管理

打开`router`文件夹下的`routes.ts`文件，在`routesList`数组中注册一个路由，格式如下：

```javascript
{
    path: "/UsmAndon", //定义路由的引用路径,和name值一致即可
    name: "UsmAndon", //设置为菜单的rel即可
    component: () => import("../views/UsmModlue/UsmAndon.vue"),//vue文件在本地的路径
    meta: {
      title: "Andon看板", //菜单的name值，为了方便管理可以不用添加
      iframe: true, //页面是否为iframe页面
    }
  },
```



### 三、开发页面

🎈PC端的开发方式和WEB端基本一致，整体的页面结构也是由`template`、`script`、`style`三部分组成。目前PC端使用的UI组件库和WEB有所不同，PC统一使用`Vuetify`，目前还没有合适的产品组件，后续会陆续添加。[

```javascript
const child_process = require("child_process");
```

如果需要与主进程通讯可以使用渲染进程去触发事件，然后主进程接受事件，两者的通信是相互的。下面以PC端的退出登录为例：

```javascript
// 渲染进程
const { ipcRenderer } = require("electron");

.
.
.

// 触发退出登录方法
ipcRenderer.send("logout"); //向主进程发送登出事件

//=========================================================================================================

//主进程(background.ts)
import { app, protocol, BrowserWindow, ipcMain } from "electron";

.
.
.

ipcMain.on("logout", () => { //接受渲染进程发送的登出事件并进行相应的处理
    isLogin = false;
    loginWin.show();
    (<BrowserWindow>win).hide();
    // 通过main进程发送事件给renderer进程，提示更新信息
    loginWin.webContents.send("cleanLoginForm", 1);
  });
```



### 四、项目结构

项目的主题结构如下所示：

![image-20210908171042140](https://gitee.com/zhang_yang_ming/image/raw/master/image-20210908171042140.png)

一般项目开发的代码存放在project文件夹下。
