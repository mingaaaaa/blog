## 使用postcss-px-to-viewport-8-plugin将页面转响应式

### 背景

公司最近接了个项目，其中要求部分页面在移动端正常显示，第一方案是使用响应式，但是设计稿最后出的和Web端差别较大同时两端的功能不是完全对齐的，所以决定使用两个模块去实现，通过路由来控制显示的页面。

说到这里第一时间想到的当然是大名鼎鼎的**postcss-px-to-viewport**插件咯，之前也用过不少次了，非常香，这次也理所当然的打算使用该方案。

### postcss-px-to-viewport使用

因为我们使用的是next，next已经内置了postcss插件，所以我们下载`postcss-px-to-viewport`即可

```bash
pnpm install postcss-px-to-viewport --save-dev
```

然后在next项目的根目录创建`postcss.config.js`文件并添加如下配置

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 设计稿的视口宽度，假设设计稿宽度为 375px
      unitPrecision: 5, // 转换后的单位精度
      viewportUnit: 'vw', // 转换后的单位
      selectorBlackList: [], // 忽略的选择器
      minPixelValue: 1, // 最小的转换值
      mediaQuery: false, // 是否转换媒体查询中的 px
      exclude: /node_modules/, // 忽略的文件或文件夹
    },
  },
};
```

具体的配置网上很多了，这里贴一个文档地址吧，需要的可以自己选择自己的配置👉 [https://github.com/evrone/postcss-px-to-viewport](https://github.com/evrone/postcss-px-to-viewport)

### postcss-px-to-viewport部分配置不生效

配置完毕以后打包，啊哦，出现了一个打包错误，让我们来看看：

![image-20250329181403371](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20250329181403371.png)

原来是一个类型错误，无伤大雅，我们解决了以后接着打包，怎么打包失败？
![image-20250329182455256](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20250329182455256.png)

原来是权限问题，我们用管理员运行然后打包，打包成功！，现在我们来检查一下打包产物里面的css有没有更改单位。
![image-20250329182840967](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20250329182840967.png)

非常好，已经成功转成vw响应式了，但是根据模块检查发现是所有的页面都转vw了，而我只想转部分页面的单位，我们检查一下是不是部分配置项没有生效？

因为postcss-px-to-viewport支持**include**配置，所以我在想是不是我配置写的有问题，于是在尝试好几次不同的正则写法后打包的产物依然没变，连文件指纹都不带改的。。。

因为打包的时候为了检测配置项是否正确加载了，所以我在配置文件加了一行打印

```javascript
console.log('Loading postcss.config.js');

module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 375, // 设计稿的视口宽度，假设设计稿宽度为 375px
      ...
    },
  },
};
```

然后我发现控制台出现了这样的信息:

```bash
Loading postcss.config.js
postcss-px-to-viewport: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration
```

然后我看了下，发现是postcss8换写法了，得升级，于是我检查了一下next自带的postcss版本，发现是**8.4.14**的版本。这个时候我查了下，发现得换插件了，也就是[**postcss-px-to-viewport-8-plugin**](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin)。

### postcss-px-to-viewport-8-plugin的使用

postcss-px-to-viewport-8-plugin使用和postcss-px-to-viewport是一样的，只需要将插件名称更改一下即可。

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375, // 设计稿的视口宽度，假设设计稿宽度为 375px
      unitPrecision: 5, // 转换后的单位精度
      viewportUnit: 'vw', // 转换后的单位
      ...
    },
  },
};
```

然后我们接着打包看看。OK打包完成，检查一下css，发现和上面一样，单位是转换了，但是是全局的，include并没有生效，事已至此没办法了，只能看看源码调试一下了。

### 排查include配置不生效

![image-20250329184238689](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20250329184238689.png)

插件的目录很清晰，我们可以看到入口文件是lib文件夹下的index.js

```javascript
    css.walkRules(rule => {
        // Add exclude option to ignore some files like 'node_modules'
        const file = rule.source?.input.file || '';
        if (opts.exclude && file) {
          if (Object.prototype.toString.call(opts.exclude) === '[object RegExp]') {
            if ((0, _utils.isExclude)(opts.exclude, file)) return;
          } else if (
            // Object.prototype.toString.call(opts.exclude) === '[object Array]' &&
            opts.exclude instanceof Array) {
            for (let i = 0; i < opts.exclude.length; i++) {
              if ((0, _utils.isExclude)(opts.exclude[i], file)) return;
            }
          } else {
            throw new Error('options.exclude should be RegExp or Array.');
          }
        }
      ....
```

可以看到exclude的配置如上所示，但是并没有include的配置，难不成这个配置不在index.js吗，但是没有找到，这里先暂且按下不表，先检查一下include的正则匹配有没有问题，打印上面的file以及正则匹配结果，发现无法匹配

```javascript
const reg = /\/src\/app\/mobile\//
```

有经验的应该一眼就能看出来，是因为windows系统的路径符号导致的，windows应该用下面的正则：

```javascript
const reg = /\\src\\app\\mobile\\/
```

现在是可以匹配了，但是打包产物依然不生效，我现在怀疑include配置根本就没有实现，于是我们去仓库看看他的源码。[👉传送门](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin/blob/master/src/index.ts)

找了一圈，发现确实没有实现include，然后我就想这么大的问题别人没有发现吗，看了下Issues是有的[https://github.com/lkxian888/postcss-px-to-viewport-8-plugin/issues/40](https://github.com/lkxian888/postcss-px-to-viewport-8-plugin/issues/40)

### 解决

最好的方式当然是提PR了，但是时间紧任务重啊，只能先改插件了。

### 1.直接修改插件

在项目的node_modules中找到**postcss-px-to-viewport-8-plugin**文件夹，然后在该文件夹下的lib文件夹下的index.js中的css.walkRules的参数方法中(也就是第60行)添加下面的代码：

```javascript
 if (opts.include && file) {
          if (Object.prototype.toString.call(opts.include) === '[object RegExp]') {
            if (!(0, _utils.isExclude)(opts.include, file)) return;
          } else if (opts.include instanceof Array) {
            let included = false;
            for (let i = 0; i < opts.include.length; i++) {
              if ((0, _utils.isExclude)(opts.include[i], file)) {
                included = true;
                break;
              }
            }
            if (!included) return;
          } else {
            throw new Error('options.include should be RegExp or Array.');
          }
        }
```

其实就是和exclude反着来就行。

#### 2. 使用exclude

因为我们打包部署用的是容器，所以改本地文件是不行嘞，那就只能退而求其次选择使用exclude了

```javascript
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375, // 设计稿的视口宽度，假设设计稿宽度为 375px
      unitPrecision: 5, // 转换后的单位精度
      viewportUnit: 'vw', // 转换后的单位
      selectorBlackList: [], // 忽略的选择器
      minPixelValue: 1, // 最小的转换值
      mediaQuery: false, // 是否转换媒体查询中的 px
      // exclude: /node_modules/, // 忽略的文件或文件夹
      exclude: /^(?:(?!mobile).)*$/, 
    },
  },
};
```

这下路径有mobile的文件都不会被插件应用。