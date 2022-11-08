### 一个Vue3数字框区间指令及其衍生的一个知识点

大家在实际使用过程中一定会有一个这样的场景，就是一个数字输入框，它的取值范围会被限制。假设我们设置这个数字输入框的取值范围为`0~10`，那么我们应该在原生的数字输入框这样写：

```html
<input v-model="value" min='0' max='10' step='1' />
```

但是这样其实并不能符合我们的期望，因为数字输入框的值的更改是有两种方式的，一种是通过输入，还有一种是点击数字输入框内部的箭头去加减`step`的大小来完成数字的更改，但是`min`和`max`这两个属性只能控制箭头的方式而不能控制用户输入的方式，所以我们需要针对用户输入的方式去做更改，具体的实现我们可以参考[`elementPlus`](https://element-plus.gitee.io/zh-CN/component/input-number.html)的实现。

#### 实现方式

要实现对用用户输入值的控制，我们肯定是需要通过`input`或者`change`事件来控制`event.target.value`，所以我首先就想到的是使用指令的方式去实现。大致的思路如下：

1. 定义一个全局的指令，该指令接受一个存放最小值和最大值的数组，当数字输入框使用该指令时，用户的输入就会收到限制
2. 在通过修饰符我们可以判断用户希望的是通过`input`事件触发还是`change`事件触发，然后给输入框绑定不同的事件同时限制用户输入的值
3. 通过修饰符判断用户是否希望消除空字符串更改为0

大致的实现方式就上面的形式，实现并不困难。

#### 指令的实现

我们在**main.js**中定义一个全局指令，如下所示：

```javascript
app.directive("limitRangeOfNumber", {
  mounted(el, binding, vnode, prevVnode) {
    let [min, max] = binding.value;
    let modifiersObj = binding.modifiers;
    let eventName = binding.modifiers.input ? "input" : "change";
    el.min = min;
    el.max = max;
    el.addEventListener(eventName, (e) => {
      let currentValue = +e.target.value;
      console.log(currentValue);
      if (currentValue >= max) {
        currentValue = max;
      }
      if (currentValue <= min) {
        currentValue = min;
      }
      e.target.value = currentValue;
    });
  },
});
```

#### 一个小问题

上面的代码比较简单这里就不再赘述了，这里要说的一点是，如果是这样设置，假设用户使用如下：

```html
<input v-model="value" min='0' max='10' step='1' v-limitRangeOfNumber.input="[0, 10]" />
```

此时会出现这个现象：

![1667888713453](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/1667888713453.gif)

当我输入大于最大限制的数字例如<span style="color:red;font-weight:bold;font-size:20px">13</span>时，输入时的值确实更改为<span style="color:red;font-weight:bold;font-size:20px">10</span>，但是在失焦状态后值又更改为了<span style="color:red;font-weight:bold;font-size:20px">13</span>，这一点在`change`事件时更为明显。最开始我设想的是失焦事件的问题，最起码问题的表面现象就是如此，但是失焦事件的值确实是**10**，很明显问题不在事件上，于是我将目光转向了**Vue**上。

#### 问题分析

我们都知道v-model其实就是一个双向绑定，在Vue2中V-model是`input`事件和`v-bind`的一个语法糖，但在Vue3中，如果你对表单元素或者一个组件绑定了一个v-model其实相当于传递了一个`modelValue的prop`，并绑定了一个`update:modelValue`事件，虽然方式不一样但是其实和Vue2的区别不是很大。为什么我要分析v-model呢？原因很简单，除了我通过指令更改输入框的值外只有v-model这一个地方更改了元素的值。

另外还有一点，大家都知道Vue使用的是虚拟dom，Vue内部会将虚拟的`Vnode`处理后再渲染到页面上，而Vue对虚拟dom是有处理的，一般情况下已经创建的虚拟DOM是会缓存下来供后面操作更新后使用。

终上所述所以我们可以猜想，我们确实更新了元素了value，但是虚拟dom缓存了元素的初始target，而不是更改后的value，在我们更改了元素的value后触发了diff算法，这个时候Vnode会更新，但是这个时候VNode更新的是之前缓存的值，因为我们是直接更改的DOM元素而不是虚拟dom，所以虚拟dom更新后会将缓存的值更新为dom的value，这也能解释为什么输入**13**值会变为**10**然后再变为**13**。

#### 解决问题

##### 第一种：去掉v-model

经过上面的分析我们知道是因为使用v-model的时候给虚拟DOM添加了一个`update:modelValue`事件，并在虚拟dom更新的时候会触发该事件将元素的value更改为之前的缓存值，所以我们简单粗暴的去掉v-model就能解决问题，但是这种办法治标不治本，并且v-model不可能再使用表单元素的时候不使用，所以这种办法不具有通用性。

##### 第二种：更新Vnode

很幸运的的是，Vue在指令的方法中开放了Vnode的操作权限。在用户使用了v-model的情况下我们可以再Vnode的props属性下拿到一个名为<span style="font-weight:bold;color:skyblue;font-size:20px">onUpdate:modelValue</span>的方法。

![image-20221108155345395](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20221108155345395.png)

只看名字我们就能明白这个方法的意思，也就是更新v-model的方法，我们也能看到这个方法接受一个参数，并将该参数赋值为v-model的值，那么我只需要将处理好的值传给这个方法并调用就可以。

```javascript
vnode.props["onUpdate:modelValue"]
        ? vnode.props["onUpdate:modelValue"](currentValue)
        : (e.target.value = currentValue);
```

#### 完整代码

```javascript
app.directive("limitRangeOfNumber", {
  mounted(el, binding, vnode, prevVnode) {
    let [min, max] = binding.value;
    let modifiersObj = binding.modifiers;
    let eventName = binding.modifiers.input ? "input" : "change";
    el.min = min;
    el.max = max;
    el.addEventListener(eventName, (e) => {
      let currentValue = +e.target.value;
      if (currentValue >= max) {
        currentValue = max;
      }
      if (currentValue <= min) {
        currentValue = min;
      }
      vnode.props["onUpdate:modelValue"]
        ? vnode.props["onUpdate:modelValue"](currentValue)
        : (e.target.value = currentValue);
    });
    if (modifiersObj.zero) {
      el.addEventListener("focus", (e) => {
        let currentValue = e.target.value;
        if (currentValue === "0") {
          currentValue = "";
        }
        vnode.props["onUpdate:modelValue"]
        ? vnode.props["onUpdate:modelValue"](currentValue)
        : (e.target.value = currentValue);
      });
      el.addEventListener("blur", (e) => {
        let currentValue = e.target.value;
        if (currentValue === "") {
          currentValue = 0;
        }
        vnode.props["onUpdate:modelValue"]
        ? vnode.props["onUpdate:modelValue"](currentValue)
        : (e.target.value = currentValue);
      });
    }
  },
});
```

#### 使用方式

```html
<input v-model="value" min='0' max='10' step='1' v-limitRangeOfNumber.input.zero="[0, 10]" />
```

传给指令的一定是一个由两个数字或者数字字符串组成的数组，按升序排列，我这里懒得写其他处理情况，就不能惯着，就得按标准方式去使用！

如果传给指令一个`input`修饰符事件监听会更改为`input`事件，否则默认为`change`事件

如果需要**将空字符串更改为0**则需要给指令传一个`zero`修饰符。
