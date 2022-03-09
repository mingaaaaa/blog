## 基本用法

echarts的配置是通过option来的，echarts 的使用者，使用 `option` 来描述其对图表的各种需求，包括：有什么数据、要画什么图表、图表长什么样子、含有什么组件、组件能操作什么事情等等。简而言之，`option` 表述了：`数据`、`数据如何映射成图形`、`交互行为`。一个最基本的图表如下所示：

```javascript
// 创建 echarts 实例。
var dom = document.getElementById('dom-id');
var chart = echarts.init(dom);

// 用 option 描述 `数据`、`数据如何映射成图形`、`交互行为` 等。
// option 是个大的 JavaScript 对象。
var option = {
    // option 每个属性是一类组件。
    legend: {...},
    grid: {...},
    tooltip: {...},
    toolbox: {...},
    dataZoom: {...},
    visualMap: {...},
    // 如果有多个同类组件，那么就是个数组。例如这里有三个 X 轴。
    xAxis: [
        // 数组每项表示一个组件实例，用 type 描述“子类型”。
        {type: 'category', ...},
        {type: 'category', ...},
        {type: 'value', ...}
    ],
    yAxis: [{...}, {...}],
    // 这里有多个系列，也是构成一个数组。
    series: [
        // 每个系列，也有 type 描述“子类型”，即“图表类型”。
        {type: 'line', data: [['AA', 332], ['CC', 124], ['FF', 412], ... ]},
        {type: 'line', data: [2231, 1234, 552, ... ]},
        {type: 'line', data: [[4, 51], [8, 12], ... ]}
    }]
};

// 调用 setOption 将 option 输入 echarts，然后 echarts 渲染图表。
chart.setOption(option);
```



### 1.系列(series)

series在echarts中指的是：一组数值以及他们映射成的图，所以一个系列包含的要素至少有：一组数值、图表类型（`series.type`）、以及其他的关于这些数据如何映射成图的参数。

#### series.type(图表类型)

1. `line`折线图
2. `bar`柱状图
3. `pie`饼状图
4. `scatter`散点图
5. `graph`关系图
6. `tree`树状图

 #### series.data(图表数据)

series的data属性用于存放图表数据，参数形式是数组`Array` 。

除此之外，图表数据还可以通过`dataset`属性的形式来设置。可以参考下面两种方式

| 方式一                                                       | 方式二                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![image-20210413234046545](C:\Users\明\AppData\Roaming\Typora\typora-user-images\image-20210413234046545.png) | ![image-20210413234111851](C:\Users\明\AppData\Roaming\Typora\typora-user-images\image-20210413234111851.png) |

注：因为系列是一种特殊的组件，所以有时候也会出现 “组件和系列” 这样的描述，这种语境下的 “组件” 是指：除了 “系列” 以外的其他组件。

 ### 2.类css的绝对定位(grid)

多数组件和系列，都能够基于 `top` / `right` / `down` / `left` / `width` / `height` 绝对定位。 这种绝对定位的方式，类似于 `CSS` 的绝对定位（`position: absolute`）。绝对定位基于的是 echarts 容器 DOM 节点。

其中，他们每个值都可以是：

- 绝对数值（例如 `bottom: 54` 表示：距离 echarts 容器底边界 `54` 像素）。
- 或者基于 echarts 容器高宽的百分比（例如 `right: '20%'` 表示：距离 echarts 容器右边界的距离是 echarts 容器宽度的 `20%`）。

这里数值的参考可以看下面的图：

![image-20210413234859568](C:\Users\明\AppData\Roaming\Typora\typora-user-images\image-20210413234859568.png)

少数圆形的组件或系列，可以使用“中心半径定位”，例如，[pie](https://echarts.apache.org/zh/option.html#series-pie)（饼图）、[sunburst](https://echarts.apache.org/zh/option.html#series-sunburst)（旭日图）、[polar](https://echarts.apache.org/zh/option.html#polar)（极坐标系）。

中心半径定位，往往依据 [center](https://echarts.apache.org/zh/option.html#series-pie.center)（中心）、[radius](https://echarts.apache.org/zh/option.html#series-pie.radius)（半径）来决定位置。

### 3.坐标系

一个坐标系，可能由多个组件协作而成。我们以最常见的直角坐标系来举例。直角坐标系中，包括有 [xAxis](https://echarts.apache.org/zh/option.html#xAxis)（直角坐标系 X 轴）、[yAxis](https://echarts.apache.org/zh/option.html#yAxis)（直角坐标系 Y 轴）、[grid](https://echarts.apache.org/zh/option.html#grid)（直角坐标系底板）三种组件

#### xAxis(X轴)、yAxis(y轴)、grid(定位)

x轴和y轴是可以共享的，例如一个option中只有一个xAxis配置，但是有两个yAxis配置，这时候两个yAxis都共用这个xAxis,只需要在series中使用的时候使用`yAixsIndex`也就是y轴配置的索引来使用不同的y轴配置，其余两个组件也是如此

![image-20210414091206220](C:\Users\明\AppData\Roaming\Typora\typora-user-images\image-20210414091206220.png)

