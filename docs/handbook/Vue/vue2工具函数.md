---
title: vue2工具函数浅读
author: ming
date: '2022-03-06'
---

# 第24期 | vue2工具函数

这是第一期源码共读，因为我还是一个小菜鸟刚好用的也是vue2所以这次就从vue2的工具函数开始入手。

这些工具函数是shared文件夹util.js提供的，下面就列举一些vue2提供的工具。

### 1.emptyObject 冻结对象

```javascript
const emptyObject = Object.freeze({})
```

Object.freeze这个API我并不陌生，虽然工作中我并没有用到它。这个API会冻结对象，禁止用户对对象进行属性的添加、删除以及修改，这一点也可以使用Object.defineproperty()API来完成。[对于freeze具体可以看一下MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

### 2.isUndef 是否未定义

```javascript
function isUndef () {
  return v === undefined || v === null
}
```

这个也不必多说，强等于在js中的作用应该都很清楚，除了判断值还会判断类型。不过我不理解的是为什么要将`null`也包含在范围内。

### 3.isDef 是否已定义

```javascript
function isDef ()  {
  return v !== undefined && v !== null
}
```

这个和上面的`isUndef`方法正好相反。

### 4.isTrue 是否为 true

```javascript
function isTrue () {
  return v === true
}
```

### 5.isFalse 是否为 false

```javascript
function isFalse () {
  return v === false
}
```

2、3、4、5都是利用强等于去判断值和类型，算是JS的基础了。

### 6.isPrimitive 判断值是否是原始值

```javascript
function isPrimitive () {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

js的基础类型有`string`、`number`、`boolean`、`undefined`、`null`、`Symbol`、`BigInt(数字后面添加n)`。

这里使用了typeof检测类型，只要基本上只要是基本数据类型(null除外)就可以使用typeof检测，不过这里我不知道为什么没有把`undefined`加进去。

另外这里说一下为什么使用typeof检测null是object,**因为JS在存储数据的时候使用的是二进制存储，而数据的前三位是存储的类型，恰好对象的前三位和null的前三位都是`000`所以使用typeof去检测的时候null的检测结果就是object**

这个bug是第一版Javascript留下来的。在这个版本，数值是以32字节存储的，由标志位（1~3个字节）和数值组成。标志位存储的是低位的数据。这里有五种标志位：

- 000：对象，数据是对象的应用。
- 1：整型，数据是31位带符号整数。
- 010：双精度类型，数据是双精度数字。
- 100：字符串，数据是字符串。
- 110：布尔类型，数据是布尔值。

### 7.isObject 判断是否为对象

```javascript
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
```

这里就是将我上面说的typeof检测null的现象排除了。

### 8.toRawType 获取值的类型字符串

```javascript
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}
```

其实上面的代码可以总结为

```javascript
Object.prototype.toString.call(value)
```

`Object.prototype.toString`本来是对象原型上的toString方法，这个时候得到的值是`'[object Object]'`，但是如果这时候使用call来改变调用者，就会得到调用者的值的类型字符串，如下

```javascript
Object.prototype.toString.call(undefined) //'[object Undefined]'
Object.prototype.toString.call(null) //'[object Null]'
Object.prototype.toString.call(123) //'[object Number]'
Object.prototype.toString.call('123') //'[object String]'
Object.prototype.toString.call(()=>{}) //'[object Function]'
Object.prototype.toString.call([]) //'[object Array]'
```

### 9.isPlainObject 是否是普通对象(object)

~~~javascript
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}
~~~

跟据上面的注释和第八个方法我们不难看出这个方法是为了判断一个对象是否为一个普通的对象，因为严格来说js里的方法、数组、包装对象等都是对象，而这个方法就是为了判断对象是否为一个普通的对象(object)

### 10.isRegExp 是否是正则表达式

```javascript
function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}
```

### 11.isValidArrayIndex 判断值是否是有效的数组索引

```javascript
function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```

数组的索引可以是数字也可以是数字字符串，这是前提。

首先是将值转字符串再转数字，使用parseFloat方法将字符串转为数字，除了数字字符串外得到的都是`NAN`。然后判断值是否大于等于零，然后使用`Math.floor(n) === n`来判断是否为整数，最后还使用了`isFinite`方法来判断是否无穷大，这个方法我第一次见，学到了。

### 12.isPromise 判断是否是 promise

```javascript
function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
```

第一个判断值是否定义(也可以判断是否为对象)，第二个判断是判断是否有then方法，第三个判断是是判断是否有catch方法，其实这种判断并不严谨，具体可以看下面的例子：

```javascript
let a={
    then:()=>{},
    catch:()=>{},
}

isPromise(a) //true
```

当然这种现象很少见，几乎不会有这样的对象存在，这里只是鸡蛋里挑骨头，另外就是若川哥说规范就是这么判断的，这里有机会可以查查看。

### 13.toString 转字符串

```javascript
function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

toString(123); //'123'
toString([1,23,4]); //'[\n  1,\n  23,\n  4\n]'
toString({a:1}); //'{\n  "a": 1\n}'
```

如果是null返回空字符串，如果是数组或者是普通对象，并且对象的toString()方法和对象上的原型方法相同，这里的意思就是对象的toString()方法没有被改写，如果满足条件就用JSON.stringify去转变，否则就用String（）去转字符串。个人认为这个判断是为了排除`JSON.stringify`不能转变的`undefined`以及转`NaN`会变成`null`的问题。

这里说一下`JSON.string`的三个参数：

> JSON.stringify(value[, replacer [, space]])

`value`

将要序列化成 一个 JSON 字符串的值。

`replacer` 可选

如果该参数是一个函数，则在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；如果该参数是一个数组，则只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中；如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。

`space` 可选

指定缩进用的空白字符串，用于美化输出（pretty-print）；如果参数是个数字，它代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；如果该参数为字符串（当字符串长度超过10个字母，取其前10个字母），该字符串将被作为空格；如果该参数没有提供（或者为 null），将没有空格。

### 14. toNumber 转数字

```javascript
function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}
```

参数接受类型只能是`string`，使用parseFloat去转数字除了得到转变后的数字外还可能得到`NaN`，这里用`isNaN`排除了一下，如果转成NaN证明该字符串不能转数字，直接返回原字符串，如果可以转换为数字则返回转换后的数字。

### 15.makeMap 生成一个 map （实际上还是使用的对象）

```javascript
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
makeMap('1,2,3,4,5')(1) //true
makeMap('1,2,3,4,5')("1") //true
makeMap('1,2,3,4,5')(6) //false


/**
 * Check if a tag is a built-in tag.
 检查标签是否为内置标签。
 */
const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 检查一个属性是否是保留属性。
 */
const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')
```

传入的第一个参数是一个以`,`分割的字符串作为map的键，然后创建一个对象，然后将键组成的数组遍历，并将每一个键都添加到创建的对象上，值为true。

该方法会返回一个方法，返回的方法会形成一个闭包拿到创建的map对象，然后你可以传入参数来判断该值是否在创建的map对象上，如过在会返回true，否则会返回undefined。

这里顺便说一下为什么使用`为什么用Object.create(null)而不使用{}`

![image-20220301230407076](https://gitee.com/zhang_yang_ming/image/raw/master/image-20220301230407076.png)

因为`Object.create(null)`创建的对象是不继承Object原型链上的属性，它没有任何属性，我们可以把它当作一个非常纯净的map来使用。如果需要一个非常干净且高度可定制的对象当做数据字典的时候以及减少`hasOwnProperty`造成的性能损失的时候我们可以使用`Object.create(null)`。

> 随便再提一下。对象的属性如果是数字或者字符串，那么只能用 **[]** 去取值，另外当使用数字作为对象的属性时会被转成字符串

```javascript
let a={
    '1':123
}

let b={
    1:123,
    '1':456
};


a.1 //Uncaught SyntaxError: Unexpected number
a.'1' //Uncaught SyntaxError: Unexpected string
a[1] //123
a['1'] //123

b //{1:456} 这里的1其实是字符串
Object.keys(b) //['1']
```

### 16.remove 删除数组中的某一项

```javascript
function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

这个方法是对indexOf和splice两个方法的封装，这里需要注意的是indexOf的返回值，有可能是`-1`，这个情况是需要考虑到的。然后这里也顺便提一下ES6提供的新的数组方法`find和findIndex`，find方法是找到数组中合乎条件的第一项，否则返回undefined，而findIndex方法方法返回数组中满足提供的测试函数的第一个元素的下标，否则返回-1。详见[find](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find)和[findIndex](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)

### 17.hasOwn 判断对象本身是否有某属性(排除原型)

```javascript
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}
```

这个方法主要是对对象原型方法`hasOwnProperty`的封装，其实我觉得这个封装是没有必要的，因为是利用的对象原型上的方法，所以可以直接使用对象实例去调用`hasOwnProperty`，可能这里是为了利用Ts完成类型检测确保调用者必定是对象吧。

```javascript
const object1 = {};
object1.property1 = 42;

console.log(object1.hasOwnProperty('property1'));
// expected output: true

console.log(object1.hasOwnProperty('toString'));
// expected output: false

console.log(object1.hasOwnProperty('hasOwnProperty'));
// expected output: false
```

### 18.cached 创建一个纯函数的缓存版本

```javascript
/**
 * Create a cached version of a pure function.
 */

function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}

let test=(str)=>{
  return str;
}
let aaa=cached(test)('tt')  //aaa=tt
```

感觉就是生成一个方法，暂时没看出有用途o(╯□╰)o。

### 19.camelize 清除字符串`-`

```javascript
const camelizeRE = /-(\w)/g;
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

camelize('1 2-3 4-56'); //'1 23 456'
camelize('1234------56'); //'1234-----56'
```

这个方法借助了`cached`方法创建了一个方法，这个方法接受一个字符串作为参数，这个字符串会在连续的字符串中进行匹配想出一个`-`。

### 20.capitalize 字符串首字母大写

```javascript
const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

capitalize('abc'); //'Abc'
```

### 21.hyphenate 驼峰字符串改为`-`连接

```javascript
hyphenateRE = /\B([A-Z])/g;
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

hyphenate('bgColor'); //'bg-color'
hyphenate('ABC'); //'a-b-c'
```

### 22.bind方法的兼容改写

```javascript
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

let name='法外狂徒';

let obj={
  name:'张三'
};

function callMeName(){
  console.log(this.name)
};


polyfillBind(callMeName,obj)(); //张三

//最后挂载到原型上
const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

```

### 23.toArray  字符串或者类数组转数组

```javascript
function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}
```

这里虽然list形参虽然没有设置类型限制，但是应该是字符串、类数组、nodeList，其实这里可以用ES6的方法去改写。如果是字符串可以用`split`,如果是类数组可以用数组原型方法`Arra.from`或者用拓展运算符`[...variable]`。

### 24.extend  将一个对象的属性添加到目标对象上

```javascript
function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}
```

这个方法对属性值是复杂类型的值来说是**浅拷贝**，这个方法几乎和[`object.assign`几乎一致](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

### 25.toObject 将对象数组合并为一个数组

```javascript
function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

toObject([{name:'张三'},{age:'18'},{sex:'男'}]) //{name: '张三', age: '18', sex: '男'}
```

### 26.genStaticKeys  获取对象数组成员的静态属性(staticKeys)值组成的字符串

```javascript
function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

genStaticKeys([{staticKeys:["1","a"]},{staticKeys:["2","b"]},{staticKeys:["3","c"]}]) //'1,a,2,b,3,c'
```

这里可能看不懂m.staticKeys，其实根据方法的参数的类型定义也能看出参数应该是`ModuleOptions`类型组成的数组，下面是类型`ModuleOptions`的定义:

```typescript
declare type ModuleOptions = {
  // transform an AST node before any attributes are processed
  // returning an ASTElement from pre/transforms replaces the element
  preTransformNode: (el: ASTElement) => ?ASTElement;
  // transform an AST node after built-ins like v-if, v-for are processed
  transformNode: (el: ASTElement) => ?ASTElement;
  // transform an AST node after its children have been processed
  // cannot return replacement in postTransform because tree is already finalized
  postTransformNode: (el: ASTElement) => void;
  genData: (el: ASTElement) => string; // generate extra data string for an element
  transformCode?: (el: ASTElement, code: string) => string; // further transform generated code for an element
  staticKeys?: Array<string>; // AST properties to be considered static
};
```

不难看出`staticKeys`属性是一个字符串数组

### 27.looseEqual 宽松相等

```javascript
function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

looseEqual({},{}) //true
looseEqual([1,2,3],[1,2,3])  //true
looseEqual('123','123') //true
```

在JS中`{}`和`{}`是不相等的，虽然他们看起来一样但是他们指针地址是不同的，所以`{}==={}`的值是false。

1. 这个方法首先会判断比较的两个值是不是对象，如果不是对象就转`string`用`===`去判断是否相等。
2. 如果是对象会进一步判断这两个值是否是数组，如果是数组则首先判断长度是否想等，然后再用数组的`every`方法去递归判断两个数组中的每个相同索引的值，在所有的结果中只要有一个错误则`every`方法就会返回`false`。
3. 如果这两个值不是数组则会继续判断这两个值是否是日期对象，如果是的话就根据日期获取时间戳去进行比较。
4. 如果这两个值是对象，则会用`Object.keys`拿到两个对象的key值，然后采用第二部的方式去判断两这的属性值。

其实这两个方法有两个问题，一个是如果不传值也会返回true,另一个就是函数了。

`isObject`方法的原理`typeof`检测方法时的返回值是`function`,所以如果比较值是两个方法，则会用String()将函数转变为字符串,这种比较我个人认为是不合理的，这里应该就是各抒己见了。

```javascript
String(()=>{}) //'()=>{}'


looseEqual(()=>{},()=>{}) //true
looseEqual(a=>a,b=>b) //false  我个人认为这两个方法是一个方法
```

### 28.looseIndexOf   宽松的 indexOf

```javascript
function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}

looseIndexOf([1,2,3],1); //0
looseIndexOf([1,2,3],"1"); //0
[1,2,3].indexOf(1); //0
[1,2,3].indexOf("1"); //-1
```

indexOf是严格相等判断的。

这里使用的是`looseEqual`方法进行判断的，所以这里对象的比较也是不严格的

```javascript
looseIndexOf([{},{},[]],{}) //0
```

### 29.once 确保函数只执行一次

```javascript
function once (fn: Function): Function {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
```

这里用到了闭包来储存函数的调用状态。

```javascript
let callMyName = (name)=>{
  console.log(name+'!!!')
}

let justOnce= once(callMyName);
justOnce("明");  //明！！！
justOnce("明");  //
justOnce("明");  //
```

## 总结
之前看源码的时候都是入口文件开始看，整个架构过于庞大所以看着晕晕的，看的也不是很明白。这次看Vue的工具函数也学到了一些东西，也有一些成就感哈哈哈毕竟大部分看起来没啥问题，不过也确实有很多我需要学习的地方，下面就做个简单的总结吧。

 1. 转字符串，这个印象比较深刻的就是方法转字符串的结果，例如`()=>{}`用** String() **转字符串的结果是`'()=>{}'`。
 2. 判断一个值是不是整数`Math.floor(n) === n`，很有意思。
 3. 学习了一下`Object.create(null)`创建对象和字面量创建对象的区别。
 4. 印象最深刻的就是闭包的使用了吧，应该是我水平还没有到框架开发者的水平，所以有一些方法的必要性还没有认识到。
 5. bind方法的兼容改写，我第一次看到apply、call、bind是在红宝书看到的，所以就没有觉得会考虑到bind方法需要兼容。
 6. 宽松相等这个方法很有意思，倒也不是说方法的写法很有意思，就是感觉这个用处还蛮特立独行哈哈哈，这个方法的every的递归妙用很不错，让我想起了之前学习JS的时候写的深拷贝。
 7. once这个方法也很有想法，只用一次的方法，挺有创意，特点就是闭包保存的状态。

>总的来说不是很难，确实是新手也能看懂，这次也算是一个好的开始，希望以后可以坚持下来，fighting！
