---
title: electron的使用
author: ming
date: '2021-07-26'
---

PC端项目主要用到了`electron`框架和`vue`框架。其中electron框架作为主进程用于将项目构建为PC应用，同时可以在渲染进程使用nodeAPI，这部分很重要，后期有几个关键功能就是通过这些API实现的。渲染进程使用的是Vue框架，基本上的页面开发和Web端比较类似。

### 渲染进程

渲染进程使用的是Vue框架，使用`component`标签动态切换不同的页面，具体的菜单页使用的是路由来控制的

#### 项目结构及页面布局

在用户登录后会显示主界面，主界面共有四个模块首页、菜单、统计和设置，统一由`MainTabs`组件中的`component`标签的`is`属性来进行切换，切换的条件为config/static文件中的`MainTabs`数组成员的name属性，设置is属性为不同的name值就可进行页面的跳转。整体上的页面布局采用了弹性盒子，并通过响应式单位完成了页面的响应式大小，包括对部分组件的样式重写使其具备响应式。在设置页还使用动画模拟出点击效果，增加了用户的体验感。

#### UI框架

该项目中的UI框架有两个，分别为Element-UI和Muse-UI，主要的框架为Muse-UI。因为Muse-UI的弹窗的优先级是高于element-UI的弹窗的优先级的，同时也为了尽量保证风格统一，弹窗这里统一使用的是Muse-UI的弹窗。因为Muse-UI的消息提示不是自带的，而是插件，所以这里还需要下载两个包`muse-ui-message`和`muse-ui-toast`。这里需要注意的是因为element-ui的弹窗和muse-ui-toast的使用方式冲突了，所以需要在使用muse-ui-toast的页面导入包然后通过实例的方法来使用，通过挂载到Vue上的方法使用是不行的。

#### 其他拓展插件

1. `axios`用于数据请求
2. `lodash`js函数库，减少代码编写量提升开发效率
3. `echarts`可视化库，用于实现图表展示
4. `qs`一个增加了一些安全性的查询字符串解析和序列化字符串的库。
5. `vue-i18n`vue国际化插件

除上述的插件外还有`eslint`格式化代码并限制代码格式插件、`animate.css`vue动画库、`typescript`ts运行环境等等。因为这些都是运行代码环境所需或者vue脚手架自带的所以这里暂不介绍。

#### 路由

因为页面部分有很大一部分内容是菜单页面的子菜单，所以这部分使用了vue-router来进行控制页面跳转，这里着重讲一下菜单部分由路由实现页面切换的步骤。

​	1.在router文件夹下的routes.ts文件中的routesList对象中定义子菜单页面，格式如下：

```javascript
{
    path: "/UsmAndon",
    name: "UsmAndon",
    component: () => import("../views/UsmModlue/UsmAndon.vue"),
    meta: {
      title: "Andon看板"
    }
  },
```

name：就是组件的name值，路径就是文件所处位置，component采用的是动态加载组件的方式，meta中的title就是给用户展示的页面名称。

2. 在菜单页面引入路由，并注册相关组件



   因为是动态加载组件，所以这里的组件注册也是按需加载。

3. 通过接口获取到菜单数据，进行处理并展示后，用户就可以进行点击了。在用户点击代表某一个子菜单的图标后会携带当前选项卡的值触发跳转方法

   ```javascript
   goToChildMenu(item) {
         this.$router.options.routes.forEach((routerItme) => {
           if (routerItme.meta && routerItme.meta.title == item) {
             if (
               !this.tabList.map((_item) => _item.name).includes(routerItme.name)
             ) {
               console.log(routerItme);
               this.tabList.push(routerItme);
             }
             this.currentTabName = routerItme.name;
           }
         });
       }
   ```

   在方法中会遍历路由列表，将title值一致的组件push到tablist中，因为这里使用的是el-tab组件来实现的，而el-tab-pane处理菜单首页外其余的都是v-for循环生成的,push到tabList中后页面会自动生成一个包含该子菜单的tab页，同时设置currentTabName属性跳转到当前的子菜单页面。

#### eventBus

在实现从首页的消息跳转到相应的子菜单页面功能时会有一个问题，因为这是两个兄弟组件，所以实现的方法不多，因为父级组件MainTabs无法更改菜单组件中的 相应的值，所以只能使用vuex或者eventBus,这里因为Vuex使用的是TS语法，为了避免麻烦我使用的是EventBus，跳转方法如下：

1. 创建一个名为`eventBus`js文件,然后写入以下语句

   ```javascript
   import Vue from 'vue'
   export const EventBus = new Vue()
   ```

2. 在`NewHome`组件中通过事件触发一个方法，在方法中发射一个事件给父组件

   ```javascript
   dealMsg(data) {
         this.$emit("toMenu", data);
       },
   ```

3. 在父组件`MainTabs`中接收这个事件并调用一个方法，在方法内部设置当前的tabIndex的值为代表菜单页的`view_module`,这个时候页面就会切换为菜单页，然后在`MainTabs`中导入EventBus文件，并通过eventBus发射一个事件

   ```javascript
   import { EventBus } from "../event-bus.js";
   
   
   toMenu(data) {
         this.tabIndex = "view_module";
         EventBus.$emit("toChildMenu", "Andon看板");
       },
   ```

4. 在菜单页面同样引入EventBus文件,然后在created钩子函数中使用EventBus.$on来接收父组件发射的事件。接收到父组件传过来的值后（这里是自菜单的title值），执行方法跳转到相应子菜单。

   ```javascript
   import { EventBus } from "../event-bus.js";
   
   
     created() {
       EventBus.$on("toChildMenu", (msg) => {
         this.goToChildMenu(msg);
       });
     },
   ```

#### 动态加载图片

因为每个子菜单的图标是不一样的而且数据是接口拿到的，所以这里的图片是需要动态加载的。但是这里的动态图片不能使用传统的字符串拼接的方式，因为vue不能正确的识别图片类型，所以需要使用require来引入。这里因为我使用的是双重循环生成数据，所以不需要太多处理，直接将img标签写成下面的格式即可：

```vue
<img :src="require('../assets/images/' + _item.iconName)"/>
```

#### 登出

在用户点击登出后会弹出提示信息，如果用户点击确定就会通过渲染进程发送一个logout的事件，在主进程监听到后会隐藏当前主窗口并显示登录窗口。这里需要注意的，如果登录的时候不清除登录页面的状态，登出的时候会显示之前的状态。

```javascript
//渲染进程
Message.confirm(
        this.$i18n.t("message.message_mine_quitout"),
        this.$i18n.t("base.prompt"),
        {
          type: "warning",
          icon: "cloud_upload",
          okLabel: this.$i18n.t("base.confirm"),
          cancelLabel: this.$i18n.t("base.cancel"),
        }
      ).then(({ result }) => {
        if (result) {
          // 关闭当前窗口
          ipcRenderer.send("logout");
        }
      });
      
  //主进程
  ipcMain.on("logout", () => {
    loginWin.show();
    (<BrowserWindow>win).hide();
  });
```

#### 国际化格式

因为会有英文字数大大超过中文字数的现象出现，所以为了避免因为字数过多影响布局，在设置页统一设置了单行文字、溢出隐藏以及tooltip提示文字

~~~css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

~~~



### 主进程

electron框架分为主进程和渲染进程，主进程用于创建[BrowserWindow](https://github.com/electron/electron/blob/master/docs/api/browser-window.md)实例以及各种应用程序事件，可以说主进程负责整个程序的运行。

#### 主窗口

使用electron框架自带的BrowserWindow构造函数来创建一个主窗口，这里给了一些配置项，例如窗口大小，关闭自带的顶部菜单栏等选项。这里需要一个变量去接收这个窗口实例以供后期使用。

主窗口会监听最小化、退出应用以及登录、登出四个事件，前两个事件顾名思义不用赘述，重点是这个登录和登出的事件。在用户登录成功时会触发登录事件，这时会将登录的子窗口关闭，显示应用的主窗口。当登出事件触发时则正好相反，主窗口隐藏，登录窗口显示。

#### 子窗口(登录窗口)

子窗口的创建方式和主窗口一致，但是需要设置parent属性来指明该窗口所属的父级窗口。

子窗口监听`hide`事件，这个是当子窗口隐藏时会触发该事件，在该事件中我们让主窗口进行显示。

#### 检测网络

本项目中检测网络使用的是cmd中的ping命令来实现的，操作方式如下

1. 在主进程中开放node的接口。
2. 在渲染进程中需要使用检测网络功能的页面通过导入拿到node中的`child_process`模块
3. 导入`iconv-lite`插件，这个是用于将cmd的内容进行转码，拿到`iconv-lite`实例后设置实例的`skipDecodeWarning`属性为`true`跳过解码警告
4. 设置解码方式和二进制编码

```javascript
const encodings = "cp936";
const binaryEncoding = "binary";
```

5. 使用`child_process`中的`exec`方法来进行ping命令，并设置编码为之前设置的二进制编码

```javascript
const child = child_process.exec("ping " + ip, {
        encoding: binaryEncoding,
      });

```

6. 分别监听`child`实例中的`stdout`和`stderr`的值

```javascript
child.stdout.on("data", (data) => {
        item.checked = true;
        console.log(iconv.decode(data, encodings));
      });
child.stderr.on("data", (err) => {
        item.checked = false;
        console.log("error 输出:", iconv.decode(err, encodings));
      });
```

7. 这个时候我们就可以看到控制台打印出了cmd运行命令的过程输出语句，这个时候只要对结果进行处理判断就可以判断该网络是否可用。



#### 更新应用

本项目实现应用更新是使用`electron-updater`来实现的，因为本应用有自动更新和手动更新，这里为表达详细暂以手动更新做示例。步骤如下：

1. 在`vue.config.js`文件中的`electronBuilder`对象中添加一个`builderOptions`编译选项对象，配置如下：

```javascript
      builderOptions: {
        nsis: {
          oneClick: false,
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          runAfterFinish: true,
          installerIcon: "./build/favicon.ico",
          uninstallerIcon: "./build/favicon.ico"
        },
        publish: [{
          provider: "generic",
          url: "http://192.168.37.112:8888/uma-unimax-web/ext/download/"
        }],
        mac: {
          icon: "./build/aaaaa.ico"
        },
        win: {
          icon: "./build/aaaaa.ico"
        },
        linux: {
          icon: "./build/aaaaa.ico"
        }
      }
```

这里解释一下各个参数的含义，其中`publish`是最为关键的，该配置会在打包项目时生成一个`latest.yml`文件，改文件是实现更新的关键。publish中的url一定要是服务器的地址同时还需要和主进程中的配置一直，这个会在后面说到。`nsis`是应用相关的配置，这里随便说两个，例如`allowToChangeInstallationDirectory`是否允许用户自定义安装目录，`createDesktopShortcut`是否生成桌面快捷方式，`installerIcon`安装包的图标。。。最后就是mac、win、linux中的icon就是各个环境下的图标样式。

2. 配置完毕后执行打包命令，这个时候会生成dist_electron文件夹，目录结构如下:然后将之前提过的`latest.yml`文件和应用安装包`unimax-pc Setup 0.0.1.exe`方法放到服务器的指定地址下面，这个地址后面会说。这个安装包后面的0.0.1就是应用的版本号。latest.yml文件之所以重要是因为它记录了应用需要更新的相关信息例如版本号、更新地址等。

3. 在主进程中拿到`electron-updater`中的`autoUpdater`,然后定义一个方法，在方法中设置更新的网址

   >  autoUpdater.setFeedURL(
   >
   >    "http://192.168.40.156:8888/uma-unimax-web/ext/download"
   >
   >   );

   其中ip地址就是之前在`vue.config.js`文件中设置的ip地址，这里有域名也可以用域名会更方便。后面的路径就是专门用于存放之前说过的两个文件的地方。

4. 定义一个方法，然后在方法内通过`autoUpdater`监听下列一系列事件

```javascript
/更新错误
    autoUpdater.on("error", function (error) {
      sendUpdateMessage(returnData.error);
    });

    //检查中
    autoUpdater.on("checking-for-update", function () {
      sendUpdateMessage(returnData.checking);
    });

    //发现新版本
    //当发现一个可用更新的时候，更新包下载会自动开始
    autoUpdater.on("update-available", function (info) {
      sendUpdateMessage(JSON.stringify(info) + '___' + JSON.stringify(returnData.updateAva));
    });

    //当前版本为最新版本
    autoUpdater.on("update-not-available", function (info) {
      setTimeout(function () {
        sendUpdateMessage(returnData.updateNotAva);
      }, 1000);
    });

    // 更新下载进度事件
    autoUpdater.on("download-progress", function (progressObj) {
      sendUpdateMessage("正在下载");
      if (win) {
        win.webContents.send("downloadProgress", progressObj);
      }
    });

    autoUpdater.on("update-downloaded", function (
      event,
      releaseNotes,
      releaseName,
      releaseDate,
      updateUrl,
      quitAndUpdate
    ) {

      sendUpdateMessage("更新完毕");
      // 退出并安装
      autoUpdater.quitAndInstall()
    });
```

各个监听事件的作用都有注释这里就不再解释了。

5. 在主进程设置了更新事件后还需要定义一个方法去发送消息给渲染进程

   ```javascript
    // 通过main进程发送事件给renderer进程，提示更新信息
     function sendUpdateMessage(text) {
       if (win) {
         win.webContents.send("message", text);
       }
     }
   ```

6. 最后再监听自动更新事件,然后再执行第四步中的方法

   ```javascript
    // 检查更新
     ipcMain.on("checkForUpdate", (event, data) => {
       console.log("执行自动更新检查!!!");
       autoUpdater.checkForUpdates();
     });
   ```
   
7. 在渲染进程中获取`package.json`文件中的版本信息，然后在通过接口获取到服务器所存放的最新安装包的版本进行比对，如果不是最新版则提示用户执行更新。

8. 渲染进程首先通过`send`方法去触发检查更新

   ```javascript
    ipcRenderer.send("checkForUpdate");
   ```

9. 在事件触发后，`autoUpdater`会自动触发第四步中的一系列监听，首先会开启`checking-for-update`事件，确认需要更新后会执行`update-available`事件开始下载，下载时会触发`download-progress`事件，我们可以在该事件的回调中拿到下载进度等一系列参数。在下载完毕后会执行`update-downloaded`事件，然后退出当前应用并自动安装新版本。下载的最新版本会存放在`C:\Users\zym\AppData\Local\unimax-pc-updater`路径下。 .
