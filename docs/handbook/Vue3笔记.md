### Vue2和Vue3的区别

`Vue3`由于完全由`TS`进行重写，在应用中对类型判断的定义和使用有很强的表现。同一对象的多个键返回值必须通过定义对应的接口（`interface`）来进行类型定义。要不然在 ESLint 时都会报错。

#### 1、创建实例的区别

vue2和vue3创建实例的方式也是有区别的，vue2采用`new`关键字来创建实例

```vue
var vm = new Vue({
  // 选项
})
```

反观vue3这边，创建实例的方法是通过`createApp`方法来实现的

```vue
const app = Vue.createApp({
  /* 选项 */
})
```

同时vue3的实例的暴露方法大部分都返回实例本身，所以可以很方便的采用链式语法，这一点和jQuery很相像。

~~~javascript
Vue.createApp({})
  .component('SearchInput', SearchInputComponent)
  .directive('focus', FocusDirective)
  .use(LocalePlugin)
~~~

#### 2、数据响应式的区别

`vue2` 的双向数据绑定是利用 `ES5` 的一个 `API Object.definePropert()`对数据进行劫持 结合 `发布订阅`模式的方式来实现的。`Vue3` 中使用了 `es6` 的 `ProxyAPI` 对数据代理。

- 不需要遍历并修改原始对象
- 可以完全覆盖对象/数组操作
- 可以覆盖更多的数据类型
- 观察更加精准，消耗更少
- 原生 API，速度超快
- **内存减半，速度加倍**

#### 3.Vue3支持碎片(Fragments)

在Vue中，如果你创建一个组件，那么这个组件只能有一个根节点，所以下面的组件创建方式是错误的：

```vue
<template>
  <div>Hello</div>
  <div>World</div>
</template>
```

原因是代表任何Vue组件的Vue实例需要绑定到一个单一的DOM元素中。唯一可以创建一个具有多个DOM节点的组件的方法就是创建一个没有底层Vue实例的功能组件。

上面的错误大家在初学Vue的时候已经知道了，但是有的时候我们确实有业务需要，这个时候`React`社区给出了一种解决方案就是一个名为`Fragments`的虚拟元素

```javascript
class Columns extends React.Component {
  render() {
       return (      <React.Fragment>        <td>Hello</td>        <td>World</td>      </React.Fragment>    );  
  }
}

```

尽管Fragment看起来像一个普通的DOM元素，但它是虚拟的，根本不会在DOM树中呈现。这样我们可以将组件功能绑定到一个单一的元素中，而不需要创建一个多余的DOM节点。

目前你可以在Vue 2中使用vue-fragments库来使用Fragments。

#### 4.Composition API

Vue2 与 Vue3 最大的区别: Vue2 使用`Options API`而 Vue3 使用的`Composition API`

##### Composition API

目前，我们使用的是“options”API 构建组件。为了将逻辑添加到Vue组件中，我们填充（options）属性，如data、methods、computed等。这种方法最大的缺点是，它本身不是一个工作的JavaScript代码。您需要确切地知道模板中可以访问哪些属性以及this关键字的行为。在底层，Vue编译器需要将此属性转换为工作代码。正因为如此，我们无法从自动建议或类型检查中获益。

Composition API的目的是通过将当前可用组件属性作为JavaScript函数暴露出来的机制来解决这个问题。Vue核心团队将Composition API描述为“一组基于功能的附加API，可以灵活地组合组件逻辑”。使用 Composition API 编写的代码更易读，而且没有任何幕后的魔力，更容易阅读和学习。

让我们来看看一个非常简单的例子，看看使用新的Composition API的组件是如何工作的。

```javascript
<template>
  <button @click="increment">
    Count is: {{ count }}, double is {{ double }}, click to increment.
  </button>
</template>
<script>
import { ref, computed, onMounted } from "vue";
export default {
  setup() {
    const count = ref(0);
    const double = computed(() => count.value * 2);
    function increment() {
      count.value++;
    }
    onMounted(() => console.log("component mounted!"));
    return {
      count,
      double,
      increment,
    };
  },
};
</script>
```

现在，让我们把这段代码分解成几段，以了解发生了什么事

```javascript
import { ref, computed, onMounted } from 'vue'
```

正如我之前提到的Component API是以函数的形式展示组件属性，所以第一步就是导入我们需要的函数。在我们的例子中，我们需要用 `ref`创建reactive reference，用 `computed` 创建computed属性，用 `onMounted`访问mounted的挂载生命周期钩子。

这里的`ref`只是一个函数，它将属性和函数返回到模板。我们在这里声明所有的响应式属性、计算属性、观察者和生命周期钩子，然后返回它们，以便它们可以在模板中使用。我们没有在setup函数返回的内容将在模板中不可用。

~~~javascript
const count = ref(0)
~~~

根据上面的内容，我们将用ref函数声明称为count的响应式属性。它可以包装任何原始类型或对象，并返回它的响应式引用。传递元素的值将保留在创建引用的值属性中。例如，如果要访问count引用的值，则需要扩展请求`count.value`.

~~~javascript
const double = computed(() => count.value * 2);

function increment() {
  count.value++
}
~~~

这是我们在声明计算属性double和increment函数时所做的事。

```javascript
onMounted(() => console.log('component mounted!'))
```

在mounted钩子内，当组件装载时，你可以记录一些消息.

```javascript
return {
  count,
  double,
  increment
}
```

在最后，我们返回count和double属性与increment方法，使它们在模板中可用。

```vue
<template>
  <button @click="increment">
    Count is: {{ count }}, double is {{ double }}. Click to increment.
  </button>
</template>
```

现在，我们可以在template中访问setup返回的属性和函数，就像它们通过旧的options API声明的一样。

这是一个简单的例子，使用Options API也很容易实现这一点。新的Composition API的真正好处不仅在于以不同的方式编写代码，而且在重用我们的代码/逻辑时，这些好处也会显现出来。

##### **使用Composition API重用代码**

新的Composition API有更多的优点。想想代码重用， 目前，如果我们想在其他组件之间共享一些代码，有两个可用的选择`混入`和`范围插槽`(mixins和scoped slots)。两者都有其缺点。

假设我们想要提取count功能并在其他组件中重用它，下面您可以看到它如何与可用的API和Composition API一起使用。

让我们从mixins开始说起：

```javascript
import CounterMixin from './mixins/counter'
export default {
  mixins: [CounterMixin]
}
```

mixins最大的缺点是，我们对它究竟在我们的组件中加入了什么东西一无所知。这使得它不仅难以推理，而且还可能导致与现有的属性和函数的名称碰撞。

这时候就到了加scoped slots的时候了。

```vue
<template>
  <Counter v-slot="{ count, increment }">
    {{ count }}
    <button @click="increment">Increment</button>
  </Counter>
</template>
```

有了scoped slots，我们就可以通过v-slot属性准确地知道我们可以通过v-slot属性访问哪些属性，这样就更容易理解代码了。这种方法的缺点是，我们只能在模板中访问，而且只能在Counter组件作用域中使用。

现在是Composition API的出场时间了：

```javascript
function useCounter() {
  const count = ref(0);
  function increment() {
    count.value++;
  }
  return {
    count,
    incrememt,
  };
}
export default {
  setup() {
    const { count, increment } = useCounter();
    return {
      count,
      increment,
    };
  },
};
```

更优雅，不是吗？我们不受模板和组件范围的限制，并且确切地知道我们可以从计数器访问哪些属性。此外，我们可以从编译完成的代码中受益，因为useCounter只是一个返回某些属性的函数。所以编辑器可以帮助我们进行类型检查和建议。

这也是使用第三方库的一种更优雅的方式。例如，如果我们想使用vuex，我们可以扩展useStore函数而不是污染Vue原型(this.$store)。

```javascript
const { commit, dispatch } = useStore()
```

#### 5.生命周期函数的变化

```javascript
Vue2 ~~~~~~~~~~~ vue3
beforeCreate  -> setup()
created       -> setup()
beforeMount   -> onBeforeMount
mounted       -> onMounted
beforeUpdate  -> onBeforeUpdate
updated       -> onUpdated
beforeDestroy -> onBeforeUnmount
destroyed     -> onUnmounted
activated     -> onActivated
deactivated   -> onDeactivated
以上除setup外的更新后的生命周期函数都是指在setup函数中注册的方式，在setup方法外的生命周期函数可看下图
```

> 在 `setup` 中你应该避免使用 `this`，因为它不会找到组件实例。`setup` 的调用发生在 `data` property、`computed` property 或 `methods` 被解析之前，所以它们无法在 `setup` 中被获取。

![实例的生命周期](https://v3.cn.vuejs.org/images/lifecycle.svg)

#### 6.多个 v-models

v-model是一个指令，我们可以用它来实现对给定组件的双向绑定。我们可以在组件内部传递一个相应的属性，并在组件内部修改。

从表单元素中我们可以很好的了解v-model：

```vue
<input v-model="property />
```

但是你知道你可以在每个组件中使用 `v-model` 吗？在引擎盖下，`v-model` 只是传递值属性和监听输入事件的快捷方式**(语法糖)**。把上面的例子重写成下面的语法，就会有完全相同的效果：

```vue
<input 
  v-bind:value="property"
  v-on:input="property = $event.target.value"
/>
```

我们甚至可以用组件 `model` 属性改变默认属性和事件名称:

```javascript

model: {
  prop: 'checked',
  event: 'change'

```

通过利用以特定 prop 和事件为目标的能力，现在可以在单个组件实例上创建多个 v-model 绑定。
每个 v-model 将同步到不同的 prop，而不需要在组件中添加额外的选项：

* components/inputcmp.vue

~~~vue
<template>
  <input type="text" :value="name" @input="$emit('update:name', $event.target.value)">
  <input type="text" :value="title" @input="$emit('update:title', $event.target.value)">
  <input type="text" @input="$emit('otherev', $event.target.value)">
</template>

<script>
export default {
    props: {
        name: String,
        title: String
    },
    emits: ["update:name", 'update:title', 'otherev']
}

</script>
~~~

* demo.vue

```vue
<template>
    <p>name: {{ name }}</p>
    <p>title: {{ title }}</p>
  <inputcmp v-model:name="name" v-model:title="title" @otherev="otherevfun" />
</template>

<script>
import { reactive, toRefs } from "vue";
import inputcmp from "/@/components/inputcmp.vue";
export default {
  components: {
    inputcmp,
  },
  setup() {
    let value = reactive({ //reactive是定义响应式变量的API
      name: "zs",
      title: "ls",
    });
    //
    let otherevfun = (e)=>{
        console.log('e == ', e);
    }
    //
    return {
        ... toRefs(value),
        otherevfun
    }
  },
};
</script>
```

### 参考

1. [Vue2和Vue3的区别(简书)](https://www.jianshu.com/p/152862171edb)
2. [如何快速使用 `vue3.x`，`typeScript`， `vite` 搭建一套企业级的开发脚手架](https://www.zhihu.com/question/461689925/answer/2257646190)
3. [Vue 3中令人激动的新功能：Composition API](https://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA%3D%3D&chksm=83da6056b4ade940c29c5375cd8cefec948f98a99ddba09d04032b40d3cb06464da7b6b51d16&idx=1&mid=2650078515&scene=21&sn=1f58a9a55e3118209da838d94c67aa89#wechat_redirect)
4. [扶我起来，我还能学：迎接 Vue 3.0](https://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA==&mid=2650078464&idx=1&sn=69238fa2bc277019fc4e9e27c06054c7&chksm=83da6065b4ade973d554fec66556df8c2303fed5c535e8f3b1c50103a5587bed294d1a0983bd&scene=21#wechat_redirect)
5. [Vue3中ref的理解](https://blog.csdn.net/weixin_47886687/article/details/112919563)
6. [Vue 3中令人激动的新功能：Fragment+Suspense+多v-model](https://blog.csdn.net/lgno2/article/details/109446546)
7. [Vue3.0七大亮点](https://juejin.cn/post/6967570296677236743)
8. [Vue 3.0 中令人激动的新功能：Portals+新的自定义指令API](https://mp.weixin.qq.com/s?__biz=MzAxODE4MTEzMA%3D%3D&chksm=83da603fb4ade929761698f9ccc56aeb0b0fba5aaa367df5e177b17577a53dbb8d8372d8d6f2&idx=1&lang=zh_CN&mid=2650078554&scene=21&sn=856ed36db0d500ed3189059033d18566&token=1477027772#wechat_redirect)
9. [Vue3中的组合式 API 基础](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E7%BB%84%E5%90%88%E5%BC%8F-api-%E5%9F%BA%E7%A1%80)

### Vue3的一些特点

#### 1.setup

##### 1.1参数

使用 `setup` 函数时，它将接收两个参数：

1. `props`
2. `context`

让我们更深入地研究如何使用每个参数。

###### Props

`setup` 函数中的第一个参数是 `props`。正如在一个标准组件中所期望的那样，`setup` 函数中的 `props` 是响应式的，当传入新的 prop 时，它将被更新。

~~~javascript
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
~~~

> 但是，因为 `props` 是响应式的，你**不能使用 ES6 解构**，它会消除 prop 的响应性。

如果需要解构 prop，可以在 `setup` 函数中使用 [`toRefs`](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#响应式状态解构) 函数来完成此操作：

~~~javascript
import { toRefs } from 'vue'

setup(props) {
  const { title } = toRefs(props)

  console.log(title.value)
}
~~~

如果 `title` 是可选的 prop，则传入的 `props` 中可能没有 `title` 。在这种情况下，`toRefs` 将不会为 `title` 创建一个 ref 。你需要使用 `toRef` 替代它：

~~~javascript
import { toRef } from 'vue'
setup(props) {
  const title = toRef(props, 'title')
  console.log(title.value)
}
~~~

###### Context

传递给 `setup` 函数的第二个参数是 `context`。`context` 是一个普通 JavaScript 对象，暴露了其它可能在 `setup` 中有用的值：

~~~javascript
export default {
  setup(props, context) {
    // Attribute (非响应式对象，等同于 $attrs)
    console.log(context.attrs)

    // 插槽 (非响应式对象，等同于 $slots)
    console.log(context.slots)

    // 触发事件 (方法，等同于 $emit)
    console.log(context.emit)

    // 暴露公共 property (函数)
    console.log(context.expose)
  }
}
~~~

`context` 是一个普通的 JavaScript 对象，也就是说，它不是响应式的，这意味着你可以安全地对 `context` 使用 ES6 解构。

~~~javascript
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
~~~

`attrs` 和 `slots` 是有状态的对象，它们总是会随组件本身的更新而更新。这意味着你应该避免对它们进行解构，并始终以 `attrs.x` 或 `slots.x` 的方式引用 property。请注意，与 `props` 不同，`attrs` 和 `slots` 的 property 是**非**响应式的。如果你打算根据 `attrs` 或 `slots` 的更改应用副作用，那么应该在 `onBeforeUpdate` 生命周期钩子中执行此操作。

##### 1.2访问组件的 property

执行 `setup` 时，你只能访问以下 property：

- `props`
- `attrs`
- `slots`
- `emit`

换句话说，你**将无法访问**以下组件选项：

- `data`
- `computed`
- `methods`
- `refs` (模板 ref)

##### 1.3结合模板使用

如果 `setup` 返回一个对象，那么该对象的 property 以及传递给 `setup` 的 `props` 参数中的 property 就都可以在模板中访问到：

~~~vue
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // 暴露给 template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
~~~

##### 1.4使用渲染函数

`setup` 还可以返回一个渲染函数，该函数可以直接使用在同一作用域中声明的响应式状态：

~~~javascript
import { h, ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })
    // 请注意这里我们需要显式使用 ref 的 value
    return () => h('div', [readersNumber.value, book.title])
  }
}
~~~

返回一个渲染函数将阻止我们返回任何其它的东西。从内部来说这不应该成为一个问题，但当我们想要将这个组件的方法通过模板 ref 暴露给父组件时就不一样了。

我们可以通过调用 `expose` 来解决这个问题，给它传递一个对象，其中定义的 property 将可以被外部组件实例访问：

~~~javascript
import { h, ref } from 'vue'
export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
~~~

这个 `increment` 方法现在将可以通过父组件的模板 ref 访问。

##### 1.5 使用 `this`

**在 `setup()` 内部，`this` 不是该活跃实例的引用**，因为 `setup()` 是在解析其它组件选项之前被调用的，所以 `setup()` 内部的 `this` 的行为与其它选项中的 `this` 完全不同。这使得 `setup()` 在和其它选项式 API 一起使用时可能会导致混淆。

#### 2. 生命周期钩子

你可以通过在生命周期钩子前面加上 “on” 来访问组件的生命周期钩子。

下表包含如何在 [setup ()](https://v3.cn.vuejs.org/guide/composition-api-setup.html) 内部调用生命周期钩子：

| 选项式 API        | Hook inside `setup` |
| ----------------- | ------------------- |
| `beforeCreate`    | Not needed*         |
| `created`         | Not needed*         |
| `beforeMount`     | `onBeforeMount`     |
| `mounted`         | `onMounted`         |
| `beforeUpdate`    | `onBeforeUpdate`    |
| `updated`         | `onUpdated`         |
| `beforeUnmount`   | `onBeforeUnmount`   |
| `unmounted`       | `onUnmounted`       |
| `errorCaptured`   | `onErrorCaptured`   |
| `renderTracked`   | `onRenderTracked`   |
| `renderTriggered` | `onRenderTriggered` |
| `activated`       | `onActivated`       |
| `deactivated`     | `onDeactivated`     |

> 因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。

这些函数接受一个回调函数，当钩子被组件调用时将会被执行:

~~~javascript
export default {
  setup() {
    // mounted
    onMounted(() => {
      console.log('Component is mounted!')
    })
  }
}
~~~

#### 3.provide/inject

我们也可以在组合式 API 中使用 [provide/inject](https://v3.cn.vuejs.org/guide/component-provide-inject.html)。两者都只能在当前活动实例的 [`setup()`](https://v3.cn.vuejs.org/guide/composition-api-setup.html) 期间调用。

假设我们要重写以下代码，其中包含一个 `MyMap` 组件，该组件使用组合式 API 为 `MyMarker` 组件提供用户的位置。

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  provide: {
    location: 'North Pole',
    geolocation: {
      longitude: 90,
      latitude: 135
    }
  }
}
</script>
```

```vue
<!-- src/components/MyMarker.vue -->
<script>
export default {
  inject: ['location', 'geolocation']
}
</script>
```

##### 3.1.使用provide

在 `setup()` 中使用 `provide` 时，我们首先从 `vue` 显式导入 `provide` 方法。这使我们能够调用 `provide` 来定义每个 property。

`provide` 函数允许你通过两个参数定义 property：

1. name (`<String>` 类型)
2. value

使用 `MyMap` 组件后，provide 的值可以按如下方式重构：

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    provide('location', 'North Pole')
    provide('geolocation', {
      longitude: 90,
      latitude: 135
    })
  }
}
</script>
```

##### 3.2.使用 inject

在 `setup()` 中使用 `inject` 时，也需要从 `vue` 显式导入。导入以后，我们就可以调用它来定义暴露给我们的组件方式。

`inject` 函数有两个参数：

1. 要 inject 的 property 的 name
2. 默认值 (**可选**)

使用 `MyMarker` 组件，可以使用以下代码对其进行重构：

```vue
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')

    return {
      userLocation,
      userGeolocation
    }
  }
}
</script>
```

##### 3.3.响应性

###### 添加响应性

为了增加 provide 值和 inject 值之间的响应性，我们可以在 provide 值时使用 [ref](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#创建独立的响应式值作为-refs) 或 [reactive](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#声明响应式状态)。

使用 `MyMap` 组件，我们的代码可以更新如下：

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)
  }
}
</script>
```

现在，如果这两个 property 中有任何更改，`MyMarker` 组件也将自动更新

###### 修改响应式 property

当使用响应式 provide / inject 值时，**建议尽可能将对响应式 property 的所有修改限制在*定义 provide 的组件*内部**。

例如，在需要更改用户位置的情况下，我们最好在 `MyMap` 组件中执行此操作。

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    provide('location', location)
    provide('geolocation', geolocation)

    return {
      location
    }
  },
  methods: {
    updateLocation() {
      this.location = 'South Pole'
    }
  }
}
</script>
```

然而，有时我们需要在注入数据的组件内部更新 inject 的数据。在这种情况下，我们建议 provide 一个方法来负责改变响应式 property。

```vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', location)
    provide('geolocation', geolocation)
    provide('updateLocation', updateLocation)
  }
}
</script>
```

~~~vue
<!-- src/components/MyMarker.vue -->
<script>
import { inject } from 'vue'

export default {
  setup() {
    const userLocation = inject('location', 'The Universe')
    const userGeolocation = inject('geolocation')
    const updateUserLocation = inject('updateLocation')

    return {
      userLocation,
      userGeolocation,
      updateUserLocation
    }
  }
}
</script>
~~~

最后，如果要确保通过 `provide` 传递的数据不会被 inject 的组件更改，我们建议对提供者的 property 使用 `readonly`。

~~~vue
<!-- src/components/MyMap.vue -->
<template>
  <MyMarker />
</template>

<script>
import { provide, reactive, readonly, ref } from 'vue'
import MyMarker from './MyMarker.vue'

export default {
  components: {
    MyMarker
  },
  setup() {
    const location = ref('North Pole')
    const geolocation = reactive({
      longitude: 90,
      latitude: 135
    })

    const updateLocation = () => {
      location.value = 'South Pole'
    }

    provide('location', readonly(location))
    provide('geolocation', readonly(geolocation))
    provide('updateLocation', updateLocation)
  }
}
</script>
~~~

#### 4.模板引用

~~~vue
<template> 
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // DOM 元素将在初始渲染后分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
~~~

这里我们在渲染上下文中暴露 `root`，并通过 `ref="root"`，将其绑定到 div 作为其 ref。在虚拟 DOM 补丁算法中，如果 VNode 的 `ref` 键对应于渲染上下文中的 ref，则 VNode 的相应元素或组件实例将被分配给该 ref 的值。这是在虚拟 DOM 挂载/打补丁过程中执行的，因此模板引用只会在初始渲染之后获得赋值。

> 这里个人理解就是，如果组件的ref等于ref的键，则该ref的值就是当前组件实例

作为模板使用的 ref 的行为与任何其他 ref 一样：它们是响应式的，可以传递到 (或从中返回) 复合函数中。

##### 4.1.JSX 中的用法

```jsx
export default {
  setup() {
    const root = ref(null)

    return () =>
      h('div', {
        ref: root
      })

    // with JSX
    return () => <div ref={root} />
  }
}
```

##### 4.2.`v-for` 中的用法

组合式 API 模板引用在 `v-for` 内部使用时没有特殊处理。相反，请使用函数引用执行自定义处理：

```vue
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // 确保在每次更新之前重置ref
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```

##### 4.3侦听模板引用

侦听模板引用的变更可以替代前面例子中演示使用的生命周期钩子。

但与生命周期钩子的一个关键区别是，`watch()` 和 `watchEffect()` 在 DOM 挂载或更新*之前*运行副作用，所以当侦听器运行时，模板引用还未被更新。

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        // 这个副作用在 DOM 更新之前运行，因此，模板引用还没有持有对元素的引用。
        console.log(root.value) // => null
      })

      return {
        root
      }
    }
  }
</script>
```

因此，使用模板引用的侦听器应该用 `flush: 'post'` 选项来定义，这将在 DOM 更新*后*运行副作用，确保模板引用与 DOM 保持同步，并引用正确的元素。

```vue
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, watchEffect } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      watchEffect(() => {
        console.log(root.value) // => <div>This is a root element</div>
      }, 
      {
        flush: 'post'
      })

      return {
        root
      }
    }
  }
</script>
```

