### 从一个简单异步打印时间手写题到thunk和generator

一切都要从一个很简单的面试题说起，笔者最近在找工作，然后复习的时候看到了一道编程题：**每隔一秒打印一次数字**，这个题没有很多限制条件，能实现的方式简直不要太多，我相信这道题就是刚入门的前端都能很轻易的写出来。这里随便举三个例子吧。

```js
// 第一种
for (let index = 0; index < 6; index++) {
  setTimeout(() => {
    console.log(index);
  },index*1000);
}

// 第二种
function sleep(time, val) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(val);
      resolve();
    }, time);
  });
}

(async () => {
  for (let index = 1; index < 6; index++) {
    await sleep(1000, index);
  }
})();


// 第三种
let num = 1;
(function test() {
  let timeId = setTimeout(() => {
    clearTimeout(timeId);
    console.log(num);
    if (num < 5) {
      num++;
      test();
    } else return;
  }, 1000);
})();
```

其实我们可以很明显的看到这道题期望考察的问题，即js的异步处理机制在同步操作中的表现。这其实算是一个老生常谈的问题了，每个步入前端之门的人都会走的路径之一。如果是面试的话能写出这两个基本已经可以结束了，但是笔者最近在看**generator**和**thunk**函数，在我写出第二个方法以后我突然想到了async和await的实现原理，所以我在想自己能不能用thunk函数和generator函数去重写一下。

#### 一、什么是thunk函数和generator

##### 1.generator函数

generator函数是ES6推出的新特性之一，在三年前我刚入门前端的时候，在看到generator的时候还是很迷糊，工作已经三年了用到的次数指可数，更多的时候只是看一下基础用法还有属性方法等。简单来说generator就是一个可以暂停函数内部执行的一个方法，这个方法返回一个迭代器对象，在函数内部有很多yield表达式，只有当调用了这个生成器方法返回的迭代器对象的next方法，生成器内部才会将指针指向下一个yield表达式。本文重点不是generator所以不过多展开了。

##### 2.thunk方法

thunk方法其实出来很久了但是我才刚了解到。。。真的是非常惭愧了，针对thunk方法阮一峰老师有详细的介绍[Thunk 函数的含义和用法 - 阮一峰的网络日志 (ruanyifeng.com)](https://ruanyifeng.com/blog/2015/05/thunk.html)，这里我也不过多展开了。大致上来说thunk方法是一种函数柯里化，可以很好的解决函数嵌套的回调地狱的问题。这又让我想起来当初看红宝书的时候，当时觉得函数柯里化根本没啥用就是换了种写法，没想到三年前的回旋镖击中了自己。。。

#### 二、剖析函数

现在让我们将目光聚焦在上面的第二个函数上，首先是`sleep`方法，这个方法接受两个参数`time`和`val`，其中time是定时器的时间，val是用于打印的值，这个方法返回一个promise。重点在第二个匿名函数上，这个方法内部是一个for循环，循环调用了五次sleep，按理来说这五次sleep方法调用产生的定时器应该是同时开始计时，因为每次定时的时间都是一秒，所以正常的结果应该为***一秒后打印1、2、3、4、5***。但是<font style="color:red;font-weight:bold">实际的结果是每隔一秒依次打印1、2、3、4、5</font>。

这里的区别就在于有两个关键字**async和await**的存在。

#### 三、async和await

什么是async和await这里就不赘述了，这个并不是我们要讨论的重点，我们的重点在于为什么async和await能够具备上面的能力。所以我们需要明白async和await的原理是什么。

其实网上关于这方面的文章都很多，我也看了一些，但是总感觉有点不得劲。我们都知道async和await都是基于promise和generator的封装，而Promise也是基于回调的封装，那我们能不能用最基础的方式去实现上面的功能呢？想到这里我脑海就冒出来不久前看的thunk函数了，thunk函数本身没有多大的用处，但是和generator结合以后就是处理这种流程化方法的好手。

#### 四、重写

##### 1.thunk重写

第一步我们首先将执行方法重写成thunk函数，即将多参数的方法改写为单一参数的方法，那么sleep方法重写为：

```js
const asyncSleep = (time) => {
  return function (handle) {
    return new Promise((resolve) => {
      setTimeout(() => {
        handle();
        resolve();
      }, time);
    });
  };
};
```

asyncSleep就是一个典型的thunk方法，单看sleep函数进化成asyncSleep他们的功能也是变化了的，sleep负责定时和执行方法，而asyncSleep的作用是返回一个函数同时保存时间参数，供内部的方法去使用，但是整体来说这两个方法的用处是一样的，只是使用方式不一样。

```js
asyncSleep(1000)(() => {console.log(index);});
```

从这里也能很明显的看出函数的柯里化。

##### 2.生成器部分

为什么我们需要thunk函数呢，因为thunk函数还是要来服务于generator，所以这一步我们就需要写一个生成器部分用来控制函数流程化每一步的执行。

首先我们创建一个generator，因为我们的打印是需要间隔输出，这个很明显需要将打印的控制权交给生成器，所以我们可以得到下面的生成器函数：

```js
function* generatorFunc() {
  for (let index = 1; index < 6; index++) {
    yield asyncSleep(1000)(() => {
      console.log(index);
    });
  }
}
```

稍微优化点可以这么写：

```js
let sleepHandle = asyncSleep(1000)
function* generatorFunc() {
  for (let index = 0; index < 6; index++) {
    yield sleepHandle(() => {
      console.log(index);
    });
  }
}
```

##### 3.生成器启动器

第三步是最重要的一步，我们如何去启动生成器是最关键的。第一步的启动很简单，直接调用next就可以了，那如何在第一个任务执行完毕以后去调用next就成了最关键的地方了。那我们先拆解步骤一步一步来。

###### 1）第一步

第一步当然是首次调用定时器，只有生成iterator对象我们才能进行流程化的运行

```js
let iterator = generatorFunc();
let res = iterator.next();
```

这个时候的res的value是一个**promise**，同时会打印第一个值也就是1，于是我们可以顺理成章的写出如下代码：

```
res.value.then(() => {})
```

到这里我们就实现了生成器的第一步运行，与此同时第一个数字也会在间隔一秒后打印。

###### 2）第二步

还记得我们的难题吗——在上一次的任务执行完毕以后我们如何去调用next方法接着执行流程化。这个时候我们再看看第一步的返回值是什么？**Promise**。这说明什么，当Promise的状态改变的时候会调用then方法，这不正是我们想要的吗？所以我们可以在then方法中去调用next方法。

```js
res.value.then(() => {
  let res2 = iterator.next();
  if(res2.done) return;
  res2.value.then(()=>{})
});
```

这样一来在上一个任务完成以后我们就能立刻值调用next方法来执行下一个流程。

###### 3）第三步

上面的代码不知道大家看出啥来了么，很明显就是标准递归的例子。我个人的理解就是——<font style="color:red;font-weight:bold">递归实质上是函数的嵌套</font>。所以我们可以将上面的方法写成一个递归函数，而不是继续嵌套直到generator流程执行完毕。

```js
let iterator = generatorFunc();
function run() {
  let res = iterator.next();
  if (res.done) {
    return;
  } else {
    res.value.then(() => run());
  }
}
```

###### 4) 牛角开钻

到这里的我们的重写就完成了，我们使用thunk方法和generator实现了对async和await关键字的替换。但是到了这里我其实并不满意，为什么呢，这里我贴出一个例子就知道了:

```js
var fs = require('fs');
var thunkify = require('thunkify');
var readFile = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFile('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFile('/etc/shells');
  console.log(r2.toString());
};

function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

run(gen);
```

我的代码其实和上面的代码大差不差，但是有一个很明显的特点不知道大家看出来没，阮一峰老师并没有使用Promise，文件的读取也是异步操作，但是阮一峰的例子使用的是递归回调的形式，我们都知道Promise其实只是针对回调的封装，所以正常来说不使用Promise也是可以完成上面的功能的，就像阮一峰老师提供的例子一样，所以这里我们还需要再进化一下。

#### 五、进化

因为说到底，我们期望的是generator和thunk的结合，而不希望有其他的帮助，所以我们这里会抛弃掉Promise去进行改进。

那么我们的thunk方法就得变动一下：

```js
function thunkSleepFunc(time) {
    return function (handle) {
      return setTimeout(() => {
        handle();
      }, time);
  };
}
```

然后我们再来看看generator函数，在之前我们是将处理函数作为参数传递给了之前的thunk函数的返回值，其实这里我们可以不作为参数，因为这里本质上函数的控制权还是generator内部，而不是外部传入的函数，处理函数放在这里唯一的作用就是generator可以去控制他的执行与否。所以我们的生成器函数应该改成：

```js
function* generatorFunc() {
  for (let index = 0; index < 6; index++) {
    yield thunkSleepFunc(1000);
    console.log(index);
  }
}
```

与之相对应的，generator的启动器也要改成如下样子：

```js
(function () {
  let iterator = generatorFunc();
  function next() {
    let res = iterator.next();
    if (res.done) return;
    res.value(next);
  }
  next();
})();
```

#### 六、控制权移交

生成器很大的特点就是执行控制权的移交，在我们的例子中生成器的启动器是一个方法，当生成器的执行控制权转移至外部即启动器方法的函数内部的时候，这个时候我们可以做一些其他的操作，例如任务方法的运行。

在本例中任务方法就是打印数字，但是在启动器方法里面是拿不到我们需要打印的值的，那怎么办呢？还记得thunk方法吗，thunk方法会将多参数转换成单一参数的方法，同时有一个参数是方法。我们在启动器里面拿不到参数而generator中有我们需要的值，所以我们将yield的表达式设置为一个thunk方法，这样我们就可以再启动器方法里通过传参的形式将操作逻辑传递到生成器内部，然后让生成器去执行这个逻辑。

首先我们改造一下thunk函数：

~~~js
function thunkSleepFunc(time) {
  return function (index) {
    return function (handle) {
      return setTimeout(() => {
        handle(index);
      }, time);
    };
  };
}
~~~

这里又再次包裹一层是因为我们并不希望在执行yield的时候就执行方法逻辑，而是返回一个方法，这让我们可以再generator的启动器方法里面去调用他，相当于将执行控制权移交给外部也就是启动器方法内部了。

紧接着我们改造一下生成器函数：

```js
function* generatorFunc() {
  for (let index = 1; index < 6; index++) {
    yield thunkSleepFunc(1000)(index);
  }
}
```

这样我们在执行next方法以后会得到一个对象，对象的value是一个方法，这个方法包含了time和需要打印的参数index，此时我们只需要在执行value属性的时候将待执行的逻辑方法作为参数传递进去就OK了。

```js
(function () {
  let iterator = generatorFunc();
  function next() {
    let res = iterator.next();
    if (res.done) return;
    else {
      res.value((index) => {
        console.log(index);
        next();
      });
    }
  }
  next();
})();
```

到这里我们就完成了最开始我们期望的目的，使用thunk方法和generator去代替第二种方法的async和await关键字实现功能。