---
title: TypeScript基础
author: ming
date: '2021-11-12'
---


### 环境搭建

#### 安装和配置环境

```bash
$ npm i -g typescript
```

全局安装TS没啥好说的，这里说一下

安装好以后可以用下面的命令看一下安装成功没

```bash
$ tsc -v
```

如果出现下面的样子就说明安装成功

![image-20210929193550162](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20210929193550162.png)

这个时候再使用下面的命令生成一个ts的配置文件*tsconfg.json*

```bash
$ tsc --init
```

这个配置项有很多版本，网上有很多详细解释的，这里只给出一个参考

```json
{

  "compilerOptions": {

    /* Strict Type-Checking Options */

    "strict": true,                           /* Enable all strict type-checking options. */

    "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */

    "strictNullChecks": true,              /* Enable strict null checks. */

    "strictFunctionTypes": true,           /* Enable strict checking of function types. */

    "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */

    "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */

    "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */

    "alwaysStrict": false,                  /* Parse in strict mode and emit "use strict" for each source file. */

  }

}

```

准备就绪后就可以开始写TS了，下面用一个最简单的helloWorld来举个栗子

```typescript
function sayHello(word:string){
  console.log('hello ' + word);
  
}

sayHello("world")
```

写完了之后就需要编译了，这里有两种方法，一种是转译成js文件还有一种是之间编译出来

* 使用 tsc命令将 .ts 文件转译为 .js 文件

**指定转译的目标文件后，tsc 将忽略当前应用路径下的 tsconfig.json 配置，因此我们需要通过显式设定如下所示的参数，让 tsc 以严格模式检测并转译 TypeScript 代码**

```bash
$ tsc HelloWorld.ts --strict --alwaysStrict false
```

* 直接使用 ts-node 运行

```bash
$ ts-node helloWorld.ts
```

输出如下：

![](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20211220232122388.png)

根据我的发现，这里的文件名好像是忽略大小写的。





### 数据类型

#### 1.基础类型

在 JavaScript 中，原始类型指的是非对象且没有方法的数据类型，它包括 string、number、bigint、boolean、undefined 和 symbol 这六种  *（null 是一个伪原始类型，它在 JavaScript 中实际上是一个对象，且所有的结构化类型都是通过 null 原型链派生而来）*

![](https://cdn.jsdelivr.net/gh/mingaaaaa/image/img/image-20210929193726089.png)

```typescript
let firstname: string = 'Captain'; // 字符串字面量
let familyname: string = String('S'); // 显式类型转换
let fullname: string = `my name is ${firstname}.${familyname}`; // 模板字符串
/** 十进制整数 */
let integer: number = 6;
/** 十进制整数 */
let integer2: number = Number(42);
let big: bigint =  100n;
/** TypeScript 真香 为 真 */
let TypeScriptIsGreat: boolean = true;
 /** TypeScript 太糟糕了 为 否 */
let TypeScriptIsBad: boolean = false;
let sym1: symbol = Symbol();
let sym2: symbol = Symbol('42');
```

#### 2.复杂基础类型

##### 1).数组类型(Array)

我们可以直接使用 [] 的形式定义数组类型,也可以使用 Array 泛型定义数组类型.

```typescript
/** 子元素是数字类型的数组 */
let arrayOfNumber: number[] = [1, 2, 3];
/** 子元素是字符串类型的数组 */
let arrayOfString: string[] = ['x', 'y', 'z'];

//泛型
/** 子元素是数字类型的数组 */
let arrayOfNumber: Array<number> = [1, 2, 3];
/** 子元素是字符串类型的数组 */
let arrayOfString: Array<string> = ['x', 'y', 'z'];
```

如果我们明确指定了数组元素的类型，以下所有操作都将因为不符合类型约定而提示错误。

```typescript
let arrayOfNumber: number[] = ['x', 'y', 'z']; // 提示 ts(2322)
arrayOfNumber[3] = 'a'; // 提示 ts(2322)
arrayOfNumber.push('b'); // 提示 ts(2345)
let arrayOfString: string[] = [1, 2, 3]; // 提示 ts(2322)
arrayOfString[3] = 1; // 提示 ts(2322)
arrayOfString.push(2); // 提示 ts(2345)
```

##### 2)元组类型(Tuple)

**元组最重要的特性是可以限制数组元素的个数和类型**，这里的例子是[React Hooks](https://reactjs.org/docs/hooks-intro.html?fileGuid=xxQTRXtVcqtHK6j8).

```typescript
import { useState } from 'react';
function useCount() {
  const [count, setCount] = useState(0);
  return ....;
}
```

添加了不同元组类型注解的数组后，在 TypeScript 静态类型检测层面就变成了两个不相同的元组，如下代码所示:

```typescript
const x: [State, SetState] = [state, setState];
const y: [SetState, State] = [setState, state];
```

#### 3.特殊类型

##### 1.any

any 指的是一个任意类型，我们可以对被注解为 any 类型的变量进行任何操作，包括获取事实上并不存在的属性、方法，并且 TypeScript 还无法检测其属性是否存在、类型是否正确。我们可以把任何类型的值赋值给 any 类型的变量，也可以把 any 类型的值赋值给任意类型（除 never 以外）的变量。

```typescript
let anything: any = {};
anything.doAnything(); // 不会提示错误
anything = 1; // 不会提示错误
anything = 'x'; // 不会提示错误
let num: number = anything; // 不会提示错误
let str: string = anything; // 不会提示错误
```

<font color="red" size="5">**Any is Hell（Any 是地狱）**</font>应该尽量避免使用any.

##### 2.unknown

unknown 是 TypeScript 3.0 中添加的一个类型，它主要用来描述类型并不确定的变量。

比如在多个 if else 条件分支场景下，它可以用来接收不同条件下类型各异的返回值的临时变量，如下代码所示：

```typescript
let result: unknown;
if (x) {
  result = x();
} else if (y) {
  result = y();
} ...
```

与 any 不同的是，unknown 在类型上更安全。比如我们可以将任意类型的值赋值给 unknown，但 unknown 类型的值只能赋值给 unknown 或 any。

使用 unknown 后，TypeScript 会对它做类型检测。但是，如果不缩小类型（Type Narrowing），我们对 unknown 执行的任何操作都会出现如下所示错误：

```typescript
let result: unknown;
result.toFixed(); // 提示 ts(2571)
```

**而所有的类型缩小手段对 unknown 都有效**，如下代码所示：

```typescript
let result: unknown;
if (typeof result === 'number') {
  result.toFixed(); // 此处 hover result 提示类型是 number，不会提示错误
}
```

##### 3.void、undefined、null

1. void 类型，它仅适用于表示没有返回值的函数。即如果该函数没有返回值，那它的类型就是 void。
2. undefined类型同JS，用处不大，undefined 的最大价值主要体现在接口类型上，它表示一个可缺省、未定义的属性。
3. null 的价值我认为主要体现在接口制定上，它表明对象或属性可能是空值

**我们可以把 undefined 值或类型是 undefined 的变量赋值给 void 类型变量，反过来，类型是 void 但值是 undefined 的变量不能赋值给 undefined 类型。**

```typescript
const userInfo: {
  id?: number;
} = {};
let undeclared: undefined = undefined;
let unusable: void = undefined;
unusable = undeclared; // ok
undeclared = unusable; // ts(2322)
```

我们需要类型守卫（Type Guard）在操作之前判断值的类型是否支持当前的操作。类型守卫既能通过类型缩小影响 TypeScript 的类型检测，也能保障 JavaScript 运行时的安全性，如下代码所示：

```typescript
const userInfo: {
  id?: number;
  name?: null | string
} = { id: 1, name: 'Captain' };
if (userInfo.id !== undefined) { // Type Guard
  userInfo.id.toFixed(); // id 的类型缩小成 number
}
```

我们不建议随意使用非空断言来排除值可能为 null 或 undefined 的情况，因为这样很不安全。

```typescript
userInfo.id!.toFixed(); // ok，但不建议
userInfo.name!.toLowerCase() // ok，但不建议
```

而比非空断言更安全、类型守卫更方便的做法是使用单问号（Optional Chain）、双问号（空值合并），我们可以使用它们来保障代码的安全性，如下代码所示：

```typescript
userInfo.id?.toFixed(); // Optional Chain
const myName = userInfo.name?? `my name is ${info.name}`; // 空值合并
```

##### 4.never

never 表示永远不会发生值的类型。

定义一个统一抛出错误的函数，代码示例如下（圆括号后 : + 类型注解 表示函数返回值的类型）：

```typescript
function ThrowError(msg: string): never {			
  throw Error(msg);
}
```

以上函数因为永远不会有返回值，所以它的返回值类型就是 never。

同样，如果函数代码中是一个死循环，那么这个函数的返回值类型也是 never，如下代码所示。

```typescript
function InfiniteLoop(): never {
  while (true) {}
}
```

never 是所有类型的子类型，它可以给所有类型赋值,但是反过来，除了 never 自身以外，其他类型（包括 any 在内的类型）都不能为 never 类型赋值。

```typescript
let Unreachable: never = 1; // ts(2322)
Unreachable = 'string'; // ts(2322)
Unreachable = true; // ts(2322)
let num: number = Unreachable; // ok
let str: string = Unreachable; // ok
let bool: boolean = Unreachable; // ok
```

##### 5.object

object 类型表示非原始类型的类型，即非 number、string、boolean、bigint、symbol、null、undefined 的类型.如下所示的一个应用场景是用来表示 Object.create 的类型.

```typescript
declare function create(o: object | null): any;
create({}); // ok
create(() => null); // ok
create(2); // ts(2345)
create('string'); // ts(2345)
```

#### 4.类型断言（Type Assertion）

我们可以使用一种笃定的方式——**类型断言**（类似仅作用在类型层面的强制类型转换）告诉 TypeScript 按照我们的方式做类型检查。

比如，我们可以使用 `as` 语法做类型断言:

```typescript
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
```

又或者是使用尖括号 + 类型的格式做类型断言，如下代码所示：

```typescript
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = <number>arrayNumber.find(num => num > 2);
```

以上两种方式虽然没有任何区别，但是尖括号格式会与 JSX 产生语法冲突，因此更推荐使用 as 语法。

**类型断言的约束条件：父子、子父类型之间可以使用类型断言进行转换。**

> **注意**：这个结论完全适用于复杂类型，但是对于 number、string、boolean 原始类型来说，不仅父子类型可以相互断言，父类型相同的类型也可以相互断言，比如 1 as 2、'a' as 'b'、true as false（这里的 2、'b'、false 被称之为字面量类型），反过来 2 as 1、'b' as 'a'、false as true 也是被允许的（这里的 1、'a'、true 是字面量类型），尽管这样的断言没有任何意义。

any 和 unknown 这两个特殊类型属于万金油，因为它们既可以被断言成任何类型，反过来任何类型也都可以被断言成 any 或 unknown。

我们除了可以把特定类型断言成符合约束添加的其他类型之外，还可以使用“字面量值 + as const”语法结构进行`常量断言`，具体示例如下所示：

```typescript
/** str 类型是 '"str"' */
let str = 'str' as const;
/** readOnlyArr 类型是 'readonly [0, 1]' */
const readOnlyArr = [0, 1] as const;
```

此外还有一种特殊非空断言，即在值（变量、属性）的后边添加 '!' 断言操作符，它可以用来排除值为 null、undefined 的情况，具体示例如下：

```typescript
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString(); // ok
mayNullOrUndefinedOrString.toString(); // ts(2531)
```

对于非空断言来说，我们同样应该把它视作和 any 一样危险的选择。

在复杂应用场景中，如果我们使用非空断言，就无法保证之前一定非空的值，比如页面中一定存在 id 为 feedback 的元素，数组中一定有满足 > 2 条件的数字，这些都不会被其他人改变。而一旦保证被改变，错误只会在运行环境中抛出，而静态类型检测是发现不了这些错误的。

所以，我们建议使用类型守卫来代替非空断言，比如如下所示的条件判断：

```typescript
let mayNullOrUndefinedOrString: null | undefined | string;
if (typeof mayNullOrUndefinedOrString === 'string') {
  mayNullOrUndefinedOrString.toString(); // ok
}
```

#### 类型推断

我们把 TypeScript 基于赋值表达式推断类型的能力称之为“类型推断”。

在 TypeScript 中，类型标注声明是在变量之后（即类型后置），它不像 Java 语言一样，先声明变量的类型，再声明变量的名称。

使用类型标注后置的好处是编译器可以通过代码所在的上下文推导其对应的类型，无须再声明变量类型，具体示例如下：

```typescript
{
  let x1 = 42; // 推断出 x1 的类型是 number
  let x2: number = x1; // ok
}
```

在 TypeScript 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型，都可以根据上下文推断出来。比如我们能根据 return 语句推断函数返回的类型，如下代码所示：

```typescript
{
  /** 根据参数的类型，推断出返回值的类型也是 number */
  function add1(a: number, b: number) {
    return a + b;
  }
  const x1= add1(1, 1); // 推断出 x1 的类型也是 number

  /** 推断参数 b 的类型是数字或者 undefined，返回值的类型也是数字 */
  function add2(a: number, b = 1) {
    return a + b;
  }
  const x2 = add2(1);
  const x3 = add2(1, '1'); // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number | undefined
}
```

#### 上下文推断

通过类型推断的例子，我们发现变量的类型可以通过被赋值的值进行推断。除此之外，在某些特定的情况下，我们也可以通过变量所在的上下文环境推断变量的类型，具体示例如下：

```typescript
{
  type Adder = (a: number, b: number) => number;
  const add: Adder = (a, b) => {
    return a + b;
  }
  const x1 = add(1, 1); // 推断出 x1 类型是 number
  const x2 = add(1, '1');  // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number
}
```

这些缺省类型注解的变量还可以通过类型推断出类型。

```typescript
{
  let str = 'this is string'; // str: string
  let num = 1; // num: number
  let bool = true; // bool: boolean
}
{
  const str = 'this is string'; // str: 'this is string'
  const num = 1; // num: 1
  const bool = true; // bool: true
}
```

如上述代码中注释说明，通过 let 和 const 定义的赋予了相同值的变量，其推断出来的类型不一样。比如同样是 'this is string'（这里表示一个字符串值），通过 let 定义的变量类型是 string，而通过 const 定义的变量类型是 'this is string'（这里表示一个字符串字面量类型）。

#### 字面量类型

在 TypeScript 中，字面量不仅可以表示值，还可以表示类型，即所谓的字面量类型。

目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型，具体示例如下：

```typescript
{
  let specifiedStr: 'this is string' = 'this is string';
  let specifiedNum: 1 = 1;
  let specifiedBoolean: true = true;
}
```

字面量类型是集合类型的子类型，它是集合类型的一种更具体的表达。比如 'this is string' （这里表示一个字符串字面量类型）类型是 string 类型（确切地说是 string 类型的子类型），而 string 类型不一定是 'this is string'（这里表示一个字符串字面量类型）类型，如下具体示例：

```typescript
{
  let specifiedStr: 'this is string' = 'this is string';
  let str: string = 'any string';
  specifiedStr = str; // ts(2322) 类型 '"string"' 不能赋值给类型 'this is string'
  str = specifiedStr; // ok 
}
```

#### 字符串字面量类型

实际上，定义单个的字面量类型并没有太大的用处，它真正的应用场景是可以把多个字面量类型组合成一个联合类型，用来描述拥有明确成员的实用的集合。

如下代码所示，我们使用字面量联合类型描述了一个明确、可 'up' 可 'down' 的集合，这样就能清楚地知道需要的数据结构了。

```typescript
type Direction = 'up' | 'down';
function move(dir: Direction) {
  // ...
}
move('up'); // ok
move('right'); // ts(2345) Argument of type '"right"' is not assignable to parameter of type 'Direction'
```

通过使用字面量类型组合的联合类型，我们可以限制函数的参数为指定的字面量类型集合，然后编译器会检查参数是否是指定的字面量类型集合里的成员。

#### 数字字面量类型及布尔字面量类型

数字字面量类型和布尔字面量类型的使用与字符串字面量类型的使用类似，我们可以使用字面量组合的联合类型将函数的参数限定为更具体的类型，比如声明如下所示的一个类型 Config：

```typescript
interface Config {
    size: 'small' | 'big';
    isEnable:  true | false;
    margin: 0 | 2 | 4;
}
```

#### Literal Widening（字面量类型的拓宽）

所有通过 let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽。

```typescript
{
  let str = 'this is string'; // 类型是 string
  let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
  const specifiedStr = 'this is string'; // 类型是 'this is string'
  let str2 = specifiedStr; // 类型是 'string'
  let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
}
```

#### Type Widening（类型拓宽）

TypeScript 对某些特定类型值也有类似 "Type Widening" （类型拓宽）的设计。比如对 null 和 undefined 的类型进行拓宽，通过 let、var 定义的变量如果满足未显式声明类型注解且被赋予了 null 或 undefined 值，则推断出这些变量的类型是 any：

```typescript
{
  let x = null; // 类型拓宽成 any
  let y = undefined; // 类型拓宽成 any
  /** -----分界线------- */
  const z = null; // 类型是 null
  /** -----分界线------- */
  let anyFun = (param = null) => param; // 形参类型是 null
  let z2 = z; // 类型是 null
  let x2 = x; // 类型是 null
  let y2 = y; // 类型是 undefined
}
```

#### Type Narrowing（类型缩小）

在 TypeScript 中，我们可以通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合，这就是 "Type Narrowing"。

比如，我们可以使用类型守卫将函数参数的类型从 any 缩小到明确的类型，具体示例如下：

```typescript
{
  let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else if (typeof anything === 'number') {
      return anything; // 类型是 number
    }
    return null;
  };
}
```

当然，我们也可以通过字面量类型等值判断（===）或其他控制流语句（包括但不限于 if、三目运算符、switch 分支）将联合类型收敛为更具体的类型，如下代码所示：

```typescript
{
  type Goods = 'pen' | 'pencil' |'ruler';
  const getPenCost = (item: 'pen') => 2;
  const getPencilCost = (item: 'pencil') => 4;
  const getRulerCost = (item: 'ruler') => 6;
  const getCost = (item: Goods) =>  {
    if (item === 'pen') {
      return getPenCost(item); // item => 'pen'
    } else if (item === 'pencil') {
      return getPencilCost(item); // item => 'pencil'
    } else {
      return getRulerCost(item); // item => 'ruler'
    }
  }
}
```

### 函数类型

在 TypeScript 中，虽然有类、命名空间、模块，但是函数同样是最基本、最重要的元素之一。我们可以显式指定函数参数和返回值的类型，示例如下。

```typescript
const add = (a: number, b: number): number => {
     return a + b;
}
```

如上述示例中，参数名后的 ':number' 表示参数类型都是数字类型，圆括号后的 ': number' 则表示返回值类型也是数字类型。

#### 返回值类型

在 JavaScript 中，我们知道一个函数可以没有显式 return，此时函数的返回值应该是 undefined。**需要注意的是，在 TypeScript 中，如果我们显式声明函数的返回值类型为 undfined，将会得到如下所示的错误提醒**

````typescript
function fn(): undefined { // ts(2355) A function whose declared type is neither 'void' nor 'any' must return a value
  // TODO
}
````

此时，正确的做法是使用 void 类型来表示函数没有返回值的类型（这是“废柴” void 类型唯一有用的场景）

```typescript
function fn1(): void {
}
fn1().doSomething(); // ts(2339) Property 'doSomething' does not exist on type 'void'.
```



我们可以使用类似定义箭头函数的语法来表示函数类型的参数和返回值类型，此时=> 类型仅仅用来定义一个函数类型而不用实现这个函数。

**需要注意的是，这里的=>与 ES6 中箭头函数的=>有所不同。TypeScript 函数类型中的=>用来表示函数的定义，其左侧是函数的参数类型，右侧是函数的返回值类型；而 ES6 中的=>是函数的实现。**

```typescript
type Adder = (a: number, b: number) => number; // TypeScript 函数类型定义
const add: Adder = (a, b) => a + b; // ES6 箭头函数
```

在对象中，除了使用这种声明语法，我们还可以使用类似对象属性的简写语法来声明函数类型的属性，如下代码所示：

```typescript
interface Entity {
    add: (a: number, b: number) => number;
    del(a: number, b: number): number;
}
const entity: Entity = {
    add: (a, b) => a + b,
    del(a, b) {
      return a - b;
    },
};
```

在某种意义上来说，这两种形式都是等价的。但是很多时候，我们不必或者不能显式地指明返回值的类型，这就涉及可缺省和可推断的返回值类型的讲解。

#### 可缺省和可推断的返回值类型

函数返回值的类型可以在 TypeScript 中被推断出来，即可缺省。

函数内是一个相对独立的上下文环境，我们可以根据入参对值加工计算，并返回新的值。从类型层面看，我们也可以通过类型推断（类型推断、上下文类型推断）加工计算入参的类型，并返回新的类型，示例如下：

```typescript
function computeTypes(one: string, two: number) {
  const nums = [two];
  const strs = [one]
  return {
    nums,
    strs
  } // 返回 { nums: number[]; strs: string[] } 的类型 
}
```

**请记住：这是一个很重要也很有意思的特性，函数返回值的类型推断结合泛型可以实现特别复杂的类型计算（本质是复杂的类型推断，这里称之为计算是为了表明其复杂性），比如 Redux Model 中 State、Reducer、Effect 类型的关联。**

一般情况下，TypeScript 中的函数返回值类型是可以缺省和推断出来的，但是有些特例需要我们显式声明返回值类型，比如 Generator 函数的返回值。

#### Generator 函数的返回值

Generator 函数返回的是一个 Iterator 迭代器对象，我们可以使用 Generator 的同名接口泛型或者 Iterator 的同名接口泛型表示返回值的类型（Generator 类型继承了 Iterator 类型），示例如下：

```typescript
type AnyType = boolean;
type AnyReturnType = string;
type AnyNextType = number;
function *gen(): Generator<AnyType, AnyReturnType, AnyNextType> {
  const nextValue = yield true; // nextValue 类型是 number，yield 后必须是 boolean 类型
  return `${nextValue}`; // 必须返回 string 类型
}
```

#### 参数类型

在实际工作中，我们可能经常碰到函数参数可传可不传的情况，当然 TypeScript 也支持这种函数类型表达，如下代码所示:

```typescript
function log(x?: string) {
  return x;
}
log(); // => undefined
log('hello world'); // => hello world
```

在上述代码中，我们在类型标注的:前添加?表示 log 函数的参数 x 就是可缺省的。

也就是说参数 x 的类型可能是 undefined类型或者是 string 类型，那是不是意味着可缺省和类型是 undefined 等价呢？我们来看看以下的示例：

```typescript
function log(x?: string) {
  console.log(x);
}
function log1(x: string | undefined) {
  console.log(x);
}
log();
log(undefined);
log1(); // ts(2554) Expected 1 arguments, but got 0
log1(undefined);
```

**答案显而易见：这里的 ?: 表示参数可以缺省、可以不传，也就是说调用函数时，我们可以不显式传入参数。但是，如果我们声明了参数类型为 xxx | undefined（这里使用了联合类型 |），就表示函数参数是不可缺省且类型必须是 xxx 或者 undefined。**

在 ES6 中支持函数默认参数的功能，而 TypeScript 会根据函数的默认参数的类型来推断函数参数的类型，示例如下：

```typescript
function log(x = 'hello') {
    console.log(x);
}
log(); // => 'hello'
log('hi'); // => 'hi'
log(1); // ts(2345) Argument of type '1' is not assignable to parameter of type 'string | undefined'
```

在上述示例中，根据函数的默认参数 'hello' ，TypeScript 推断出了 x 的类型为 string | undefined。

当然，对于默认参数，TypeScript 也可以显式声明参数的类型（一般默认参数的类型是参数类型的子集时，我们才需要这么做）。不过，此时的默认参数只起到参数默认值的作用，如下代码所示：

```typescript
function log1(x: string = 'hello') {
    console.log(x);
}
function log2(x: number = 'hello') {// ts(2322) Type 'string' is not assignable to type 'number'
    console.log(x);
}
log2();
log2(1);
log2('1'); // ts(2345) Argument of type '"1"' is not assignable to parameter of type 'number | undefined'
```

**这里请注意：函数的默认参数类型必须是参数类型的子类型**

```typescript
function log3(x: number | string = 'hello') {
    console.log(x);
}
```

在上述代码中，函数 log3 的函数参数 x 的类型为可选的联合类型 number | string，但是因为默认参数字符串类型是联合类型 number | string 的子类型，所以 TypeScript 也会检查通过。

#### 剩余参数

在 ES6 中，JavaScript 支持函数参数的剩余参数，它可以把多个参数收集到一个变量中。同样，在TypeScript 中也支持这样的参数类型定义，如下代码所示：

```typescript
function sum(...nums: number[]) {
    return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2); // => 3
sum(1, 2, 3); // => 6
sum(1, '2'); // ts(2345) Argument of type 'string' is not assignable to parameter of type 'number'
```

在上述代码中，sum 是一个求和的函数，...nums将函数的所有参数收集到了变量 nums 中，而 nums 的类型应该是 number[]，表示所有被求和的参数是数字类型。因此，sum(1, '2') 抛出了一个 ts(2345) 的错误，因为参数 '2' 并不是 number 类型。

如果想让上述的代码可行应该更改为一下的形式：

```typescript
function sum(...nums: (number | string)[]): number {
    return nums.reduce<number>((a, b) => a + Number(b), 0);
}
sum(1, '2', 3); // 6
```

这里可能会有人问，为什么只能规定返回值是数字，因为如果这里你不设置返回值和参数是数字(其实就相当于是设置方法参数类型为数字)就会报一个`Operator '+' cannot be applied to types 'string | number' and 'string | number'`的错误。按理来说javascript是支持数字和字符串或者字符串和字符串之间的相加，但是在这里就会报错，但是如果指定了返回值的类型就不会报错，所以我推论`+`有一边的类型一定是确定的，这里应该是泛型的一种规定。

上面的例子的字符串版如下：

```typescript
function sum(...nums: (number | string)[]) {
  return nums.reduce<string>((a, b) => a + b.toString(), "1");
}
sum(1, '5') //'115'
```

如果想实现返回结果为数字或者字符串应该按如下的方式：

```typescript

function sum1(...nums: (any)[]) {
  return nums.reduce<number | string>((a, b) => a + b, 0);
}
console.log(sum1(1, 5, 6));
```

#### this

this 的值需要等到函数被调用时才能被确定，更别说通过一些方法还可以改变 this 的指向。也就是说 this 的类型不固定，它取决于执行时的上下文。使用了 TypeScript 后，我们就不用担心这个问题了。通过指定 this 的类型（严格模式下，必须显式指定 this 的类型），当我们错误使用了 this，TypeScript 就会提示我们，如下代码所示：

```typescript
function say() {
    console.log(this.name); // ts(2683) 'this' implicitly has type 'any' because it does not have a type annotation
}
say();
```

如果我们直接调用 say 函数，this 应该指向全局 window 或 global（Node 中）。但是，在 strict 模式下的 TypeScript 中，它会提示 this 的类型是 any，此时就需要我们手动显式指定类型了。

在 TypeScript 中，我们只需要在函数的第一个参数中声明 this 指代的对象（即函数被调用的方式）即可，比如最简单的作为对象的方法的 this 指向，如下代码所示：

```typescript
function say(this: Window, name: string) {
    console.log(this.name);
}
window.say = say;
window.say('hi');
const obj = {
    say
};
obj.say('hi'); // ts(2684) The 'this' context of type '{ say: (this: Window, name: string) => void; }' is not assignable to method's 'this' of type 'Window'.
```

**需要注意的是，如果我们直接调用 say()，this 实际上应该指向全局变量 window，但是因为 TypeScript 无法确定 say 函数被谁调用，所以将 this 的指向默认为 void，也就提示了一个 ts(2684) 错误。**

```typescript
say('captain'); // ts(2684) The 'this' context of type 'void' is not assignable to method's 'this' of type 'Window'
```

此时，我们可以通过调用 window.say() 来避免这个错误，这也是一个安全的设计。因为在 JavaScript 的严格模式下，全局作用域函数中 this 的指向是 undefined。

**同样，定义对象的函数属性时，只要实际调用中 this 的指向与指定的 this 指向不同，TypeScript 就能发现 this 指向的错误，示例代码如下：**

```typescript
interface Person {
    name: string;
    say(this: Person): void;
}
const person: Person = {
    name: 'captain',
    say() {
        console.log(this.name);
    },
};
const fn = person.say;
fn(); // ts(2684) The 'this' context of type 'void' is not assignable to method's 'this' of type 'Person'
```

**注意：显式注解函数中的 this 类型，它表面上占据了第一个形参的位置，但并不意味着函数真的多了一个参数，因为 TypeScript 转译为 JavaScript 后，“伪形参” this 会被抹掉，这算是 TypeScript 为数不多的特有语法。**

同样，我们也可以显式限定类函数属性中的 this 类型，TypeScript 也能检查出错误的使用方式，如下代码所示：

```typescript
class Component {
  onClick(this: Component) {}
}
const component = new Component();
interface UI {
  addClickListener(onClick: (this: void) => void): void;
}
const ui: UI = {
  addClickListener() {}
};
ui.addClickListener(new Component().onClick); // ts(2345)
```

上面示例中，我们定义的 Component 类的 onClick 函数属性（方法）显式指定了 this 类型是 Component，在第6行作为入参传递给 ui 的 addClickListener 方法中，它指定的 this 类型是 void，两个 this 类型不匹配，所以抛出了一个 ts(2345) 错误。

此外，在链式调用风格的库中，使用 this 也可以很方便地表达出其类型，如下代码所示：

```typescript
class Container {
  private val: number;
  constructor(val: number) {
    this.val = val;
  }
  map(cb: (x: number) => number): this {
    this.val = cb(this.val);
    return this;
  }
  log(): this {
    console.log(this.val);
    return this;
  }
}
const instance = new Container(1)
  .map((x) => x + 1)
  .log() // => 2
  .map((x) => x * 3)
  .log(); // => 6  
```

因为 Container 类中 map、log 等函数属性（方法）未显式指定 this 类型，默认类型是 Container，所以以上方法在被调用时返回的类型也是 Container，this 指向一直是类的实例，它可以一直无限地被链式调用。

#### 函数重载

JavaScript 是一门动态语言，针对同一个函数，它可以有多种不同类型的参数与返回值，这就是函数的多态。

而在 TypeScript 中，也可以相应地表达不同类型的参数和返回值的函数，如下代码所示：

```typescript
function convert(x: string | number | null): string | number | -1 {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => string | number
const x2 = convert(1); // => string | number
const x3 = convert(null); // => string | number
```

在上述代码中，我们把 convert 函数的 string 类型的值转换为 number 类型，number 类型转换为 string 类型，而将 null 类型转换为数字 -1。此时， x1、x2、x3 的返回值类型都会被推断成 string | number 。

那么，有没有一种办法可以更精确地描述参数与返回值类型约束关系的函数类型呢？有，这就是函数重载（Function Overload），如下示例中 1~3 行定义了三种各不相同的函数类型列表，并描述了不同的参数类型对应不同的返回值类型，而从第 4 行开始才是函数的实现。

```typescript
function convert(x: string): number;
function convert(x: number): string;
function convert(x: null): -1;
function convert(x: string | number | null): any {
    if (typeof x === 'string') {
        return Number(x);
    }
    if (typeof x === 'number') {
        return String(x);
    }
    return -1;
}
const x1 = convert('1'); // => number
const x2 = convert(1); // => string
const x3 = convert(null); // -1
```

> 注意：函数重载列表的各个成员（即示例中的 1 ~ 3 行）必须是函数实现（即示例中的第 4 行）的子集，例如 “function convert(x: string): number”是“function convert(x: string | number | null): any”的子集。

在 convert 函数被调用时，TypeScript 会从上到下查找函数重载列表中与入参类型匹配的类型，并优先使用第一个匹配的重载定义。因此，我们需要把最精确的函数重载放到前面。例如我们在第 14 行传入了字符串 '1'，查找到第 1 行即匹配，而第 15 行传入了数字 1，则查找到第 2 行匹配。

下面通过以下一个示例进行具体说明。

```typescript
interface P1 {
    name: string;
}
interface P2 extends P1 {
    age: number;
}
function convert(x: P1): number;
function convert(x: P2): string;
function convert(x: P1 | P2): any {}
const x1 = convert({ name: "" } as P1); // => number
const x2 = convert({ name: "", age: 18 } as P2); // number
```

因为 P2 继承自 P1，所以类型为 P2 的参数会和类型为 P1 的参数一样匹配到第一个函数重载，此时 x1、x2 的返回值都是 number。

```typescript
function convert(x: P2): string;
function convert(x: P1): number;
function convert(x: P1 | P2): any { }
const x1 = convert({ name: '' } as P1); // => number
const x2 = convert({ name: '', age: 18 } as P2); // => string
```

而我们只需要将函数重载列表的顺序调换一下，类型为 P2 和 P1 的参数就可以分别匹配到正确的函数重载了，例如第 5 行匹配到第 2 行，第 6 行匹配到第 1 行。

#### 类型谓词（is）

在 TypeScript 中，函数还支持另外一种特殊的类型描述，如下示例 

```typescript
function isString(s): s is string { // 类型谓词
  return typeof s === 'string';
}
function isNumber(n: number) {
  return typeof n === 'number';
}
function operator(x: unknown) {
  if(isString(x)) { // ok x 类型缩小为 string
  }
  if (isNumber(x)) { // ts(2345) unknown 不能赋值给 number
  }
}
```

上述代码中，在添加返回值类型的地方，我们通过“参数名 + is + 类型”的格式明确表明了参数的类型，进而引起类型缩小，所以类型谓词函数的一个重要的应用场景是实现自定义类型守卫。

### 类类型

在实际业务中，任何实体都可以被抽象为一个使用类表达的类似对象的数据结构，且这个数据结构既包含属性，又包含方法。

#### 继承

在 TypeScript 中，使用 extends 关键字就能很方便地定义类继承的抽象模式。

这里TypeScript的类的继承和JavaScript中的类的继承一样，例如

```typescript
class Animal {
  weight: number;
  type = 'Animal';
  constructor(weight: number) {
    this.weight = weight;
  }
  say(name: string) {
    console.log(`I'm ${name}!`);
  }
}

class Dog extends Animal {
  name: string;
  constructor(name: string) {
    super(); // ts(2554) Expected 1 arguments, but got 0.
    this.name = name;
  }

  bark() {
    console.log('Woof! Woof!');
  }
}
```

上面的Dog类就继承了Animal类，所以Dog类也会有say方法。不过要注意，子类在使用构造函数时一定要使用super()方法。在上面的例子中，虽然子类使用了super，但是并没有传weight参数进去，所以会报错。如果这是JavaScript代码，这里并不会报错，只是在取值的时候为undefined。具体使用可见下方例子:

```javascript
class Dog {
	constructor(name) {
		this.name = name;
	}
}
class hashiqi extends Dog {
	constructor(name,sex) {
		super(name)
		this.sex = sex;
	}
	sayHello() {
		console.log(this.name)
	}
}
let a = new hashiqi("erha","xiong");
a.sayHello()
```

#### 公共、私有与受保护的修饰符

类属性和方法除了可以通过 extends 被继承之外，还可以通过修饰符控制可访问性。

在 TypeScript 中就支持 3 种访问修饰符，分别是 public、private、protected。

- public 修饰的是在任何地方可见、公有的属性或方法；

- private 修饰的是仅在同一类中可见、私有的属性或方法；

- protected 修饰的是仅在类自身及子类中可见、受保护的属性或方法。

在缺省情况下，类的属性或方法默认都是 public。如果想让有些属性对外不可见，那么我们可以使用`private`进行设置，如下所示：

```typescript
class Son {
  public firstName: string;
  private lastName: string = 'Stark';
  constructor(firstName: string) {
    this.firstName = firstName;
    this.lastName; // ok
  }
}

const son = new Son('Tony');
console.log(son.firstName); //  => "Tony"
son.firstName = 'Jack';
console.log(son.firstName); //  => "Jack"
console.log(son.lastName); // ts(2341) Property 'lastName' is private and only accessible within class 'Son'.
```

#### 只读修饰符

如果我们不希望类的属性被更改，则可以使用 readonly 只读修饰符声明类的属性，如下代码所示：

```typescript
class Son {
  public readonly firstName: string;
  constructor(firstName: string) {
    this.firstName = firstName;
  }
}
const son = new Son('Tony');
son.firstName = 'Jack'; // ts(2540) Cannot assign to 'firstName' because it is a read-only property.
```

> 注意：如果只读修饰符和可见性修饰符同时出现，我们需要将只读修饰符写在可见修饰符后面。

#### 存取器

在 TypeScript 中可以通过`getter`、`setter`截取对类成员的读写访问。通过对类属性访问的截取，我们可以实现一些特定的访问控制逻辑。

```typescript
class Son {
  public firstName: string;
  protected lastName: string = 'Stark';
  constructor(firstName: string) {
    this.firstName = firstName;
  }
}
class GrandSon extends Son {
  constructor(firstName: string) {
    super(firstName);
  }
  get myLastName() {
    return this.lastName;
  }
  set myLastName(name: string) {
    if (this.firstName === 'Tony') {
      this.lastName = name;
    } else {
      console.error('Unable to change myLastName');
    }
  }
}
const grandSon = new GrandSon('Tony');
console.log(grandSon.myLastName); // => "Stark"
grandSon.myLastName = 'Rogers';
console.log(grandSon.myLastName); // => "Rogers"
const grandSon1 = new GrandSon('Tony1');
grandSon1.myLastName = 'Rogers'; // => "Unable to change myLastName"
```

#### 静态属性

以上介绍的关于类的所有属性和方法，只有类在实例化时才会被初始化。实际上，我们也可以给类定义静态属性和方法。因为这些属性存在于类这个特殊的对象上，而不是类的实例上，所以我们可以直接通过类访问静态属性，如下代码所示：

```typescript
class MyArray {
  static displayName = 'MyArray';
  static isArray(obj: unknown) {
    return Object.prototype.toString.call(obj).slice(8, -1) === 'Array';
  }
}
console.log(MyArray.displayName); // => "MyArray"
console.log(MyArray.isArray([])); // => true
console.log(MyArray.isArray({})); // => false
```



基于静态属性的特性，我们往往会把与类相关的常量、不依赖实例 this 上下文的属性和方法定义为静态属性，从而避免数据冗余，进而提升运行性能。

> **注意：上边我们提到了不依赖实例 this 上下文的方法就可以定义成静态方法，这就意味着需要显式注解 this 类型才可以在静态方法中使用 this；非静态方法则不需要显式注解 this 类型，因为 this 的指向默认是类的实例。**

#### 抽象类

接下来我们看看关于类的另外一个特性——抽象类，它是一种不能被实例化仅能被子类继承的特殊类。

我们可以使用抽象类定义派生类需要实现的属性和方法（使用`abstract `关键字），同时也可以定义其他被继承的默认属性和方法，如下代码所示：

```typescript
abstract class Adder {
  abstract x: number;
  abstract y: number;
  abstract add(): number;
  displayName = 'Adder';
  addTwice(): number {
    return (this.x + this.y) * 2;
  }
}
class NumAdder extends Adder {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
  add(): number {
    return this.x + this.y;
  }
}
const numAdder = new NumAdder(1, 2);
console.log(numAdder.displayName); // => "Adder"
console.log(numAdder.add()); // => 3
console.log(numAdder.addTwice()); // => 6
```

通过 abstract 关键字，我们定义了一个抽象类 Adder，并通过`abstract`关键字定义了抽象属性`x`、`y`及方法`add`，而且任何继承 Adder 的派生类都需要实现这些抽象属性和方法。我们还在抽象类 Adder 中定义了可以被派生类继承的非抽象属性`displayName`和方法`addTwice`。

如果派生类中缺少对 x、y、add 这三者中任意一个抽象成员的实现，那么就会提示一个 ts(2515) 错误

抽象类中的其他非抽象成员则可以直接通过实例获取

因为抽象类不能被实例化，并且派生类必须实现继承自抽象类上的抽象属性和方法定义，所以抽象类的作用其实就是对基础逻辑的封装和抽象。

实际上，我们也可以定义一个描述对象结构的接口类型抽象类的结构，并通过 implements 关键字约束类的实现。使用接口与使用抽象类相比，区别在于接口只能定义类成员的类型，如下代码所示：

```typescript
interface IAdder {
  x: number;
  y: number;
  add: () => number;
}
class NumAdder implements IAdder {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add() {
    return this.x + this.y;
  }
  addTwice() {
    return (this.x + this.y) * 2;
  }
}
```

#### 类的类型

类的最后一个特性——类的类型和函数类似，即在声明类的时候，其实也同时声明了一个特殊的类型（确切地讲是一个接口类型），这个类型的名字就是类名，表示类实例的类型；**在定义类的时候，我们声明的除构造函数外所有属性、方法的类型就是这个特殊类型的成员。**如下代码所示：

```typescript
class A {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const a1: A = {}; // ts(2741) Property 'name' is missing in type '{}' but required in type 'A'.
const a2: A = { name: 'a2' }; // ok
```

### 接口类型与类型别名

#### Interface 接口类型

TypeScript 对对象的类型检测遵循一种被称之为“鸭子类型”（duck typing）或者“结构化类型（structural subtyping）”的准则，即只要两个对象的结构一致，属性和方法的类型一致，则它们的类型就是一致的。

```typescript
function Study(language: { name: string; age: () => number }) {
  console.log(`ProgramLanguage ${language.name} created ${language.age()} years ago.`);
}
Study({
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012
});
```

在上述代码中，我们定义了一个拥有 string 类型属性name、函数类型属性age的对象 language 作为参数（形参 Parameter）的函数。同时，我们还使用类似定义 JavaScript 对象字面量的语法定义了一个内联接口类型来约束参数对象的类型。

然后，我们传递了一个 name 属性为 'TypeScript' 的字符串、age 属性为计算年份差函数的对象字面量作为参数（argument）来调用这个函数。

如果我们传入一个 name 属性是 number 类型或者缺少age属性的对象字面量，如下代码所示：

```typescript
Study({
  name: 2,
  age: () => new Date().getFullYear() - 2012
});
Study({
  name: 'TypeScript'
});
```

这时，第 2 行会提示错误： ts(2322) number 不能赋值给 string，第 7 行也会提示错误： ts(2345) 实参(Argument)与形参(Parameter)类型不兼容，缺少必需的属性 age。

同样，如果我们传入一个包含了形参类型定义里没有的 id 属性的对象字面量作为实参，也会得到一个类型错误 ts(2345)，实参（Argument）与形参（Parameter）类型不兼容，不存在的属性 id，如下代码所示：

```typescript
/** ts(2345) 实参(Argument)与形参(Parameter)类型不兼容，不存在的属性 id */
Study({
  id: 2,
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012
});
```

有意思的是，在上边的示例中，如果我们先把这个对象字面量赋值给一个变量，然后再把变量传递给函数进行调用，那么 TypeScript 静态类型检测就会仅仅检测形参类型中定义过的属性类型，而包容地忽略任何多余的属性，此时也不会抛出一个 ts(2345) 类型错误。

如下代码所示，第 6 行不会提示错误:

```typescript
let ts = {
  id: 2,
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012
};
Study(ts); // ok
```

这并非一个疏忽或 bug，而是有意为之地将对象字面量和变量进行区别对待，我们把这种情况称之为对象字面量的 freshness。

因为这种内联形式的接口类型定义在语法层面与熟知的 JavaScript 解构颇为神似，所以很容易让我们产生混淆。下面我们通过如下示例对比一下解构语法与内联接口类型混用的效果。

```typescript
/** 纯 JavaScript 解构语法 */
function StudyJavaScript({name, age}) {
  console.log(name, age);
}
/** TypeScript 里解构与内联类型混用 */
function StudyTypeScript({name, age}: {name: string, age: () => number}) {
    console.log(name, age);
}
/** 纯 JavaScript 解构语法，定义别名 */
function StudyJavaScript({name: aliasName}) { // 定义name的别名
  console.log(aliasName);
}
/** TypeScript */
function StudyTypeScript(language: {name: string}) {
  // console.log(name); // 不能直接打印name
  console.log(language.name);  
}
```

实际上，定义内联的接口类型是不可复用的，所以我们应该更多地使用interface关键字来抽离可复用的接口类型。

在 TypeScript 中，接口的语法和其他类型的语言并没有太大区别，我们通过如下所示代码一起看看接口是如何定义的：

```typescript
/ ** 关键字 接口名称 */
interface ProgramLanguage {
  /** 语言名称 */
  name: string;
  /** 使用年限 */
  age: () => number;
}
```

在前边示例中，通过内联参数类型定义的 Study 函数就可以直接使用 ProgramLanguage 接口来定义参数 language 的类型了。

```typescript
function NewStudy(language: ProgramLanguage) {
  console.log(`ProgramLanguage ${language.name} created ${language.age()} years ago.`);
}
```

我们还可以通过复用接口类型定义来约束其他逻辑。比如，我们通过如下所示代码定义了一个类型为 ProgramLanguage 的变量 TypeScript 。

```typescript
let TypeScript: ProgramLanguage;
```

接着，我们把满足接口类型约定的一个对象字面量赋值给了这个变量，如下代码所示，此时也不会提示类型错误。

```typescript
TypeScript = {
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012
}
```

而任何不符合约定的情况，都会提示类型错误。比如我们通过如下所示代码输入了一个空对象字面量，此时也会提示一个对象字面量类型 {} 缺少 name 和 age 属性的 ts(2739) 错误。

```typescript
TypeScript = {
}
```

按照如下所示代码添加 name 属性后，还是会提示一个对象字面量类型 { name: string; } 缺少必需的 age 属性的 ts( 2741) 错误。

```typescript
TypeScript = {
  name: 'TypeScript'
}
```

此外，如下代码所示，如果我们把一个 name 属性是 2、age 属性是 'Wrong Type' 的对象赋值给 TypeScript ，在第 2 行会提示错误：ts(2322) number 类型不能赋值给 string，第 3 行会提示错误：ts(2322)string 不能赋值给函数类型。

```typescript
TypeScript = {
  name: 2,
  age: 'Wrong Type'
}
```

又或者如以下示例中额外多出了一个接口并未定义的属性 id，也会提示一个 ts(2322) 错误：对象字面量不能赋值给 ProgramLanguage 类型的变量 TypeScript。

```typescript
TypeScript = {
  name: 'TypeScript',
  age: () => new Date().getFullYear() - 2012,
  id: 1
}
```

#### 可缺省属性

在前边的例子中，如果我们希望缺少 age 属性的对象字面量也能符合约定且不抛出类型错误，确切地说在接口类型中 age 属性可缺省，那么我们可以在属性名之后通过添加如下所示的? 语法来标注可缺省的属性或方法。如以下示例中，OptionalProgramLanguage 接口就拥有一个可缺省的函数类型的 age 属性。

```typescript
/** 关键字 接口名称 */
interface OptionalProgramLanguage {
  /** 语言名称 */
  name: string;
  /** 使用年限 */
  age?: () => number;
}
let OptionalTypeScript: OptionalProgramLanguage = {
  name: 'TypeScript'
}; // ok
```

当属性被标注为可缺省后，它的类型就变成了显式指定的类型与 undefined 类型组成的联合类型，比如示例中 OptionalTypeScript 的 age 属性类型就变成了如下所示内容：

```typescript
(() => number) | undefined;
```

如下所示的接口类型 OptionalTypeScript2 和 OptionalTypeScript 等价吗？

```typescript
/** 关键字 接口名称 */
interface OptionalProgramLanguage2 {
  /** 语言名称 */
  name: string;
  /** 使用年限 */
  age: (() => number) | undefined;
}
```

答案当然是不等价，这与 05 讲中提到函数可缺省参数和参数类型可以是 undefined 一样，可缺省意味着可以不设置属性键名，类型是 undefined 意味着属性键名不可缺省。

既然值可能是 undefined ，如果我们需要对该对象的属性或方法进行操作，就可以使用类型守卫或 Optional Chain（在第 4 行的属性名后加 ? ），如下代码所示：

```typescript
if (typeof OptionalTypeScript.age === 'function') {
  OptionalTypeScript.age();
}
OptionalTypeScript.age?.();
```

通过第 1 行所示的 typeof 条件判断，在确保了 age 属性是函数的情况下我们才会调用，这样就避免了运行时提示 age 不是函数的错误。

#### 只读属性

我们可以在属性名前通过添加 readonly 修饰符的语法来标注 name 为只读属性。

```typescript
interface ReadOnlyProgramLanguage {
  /** 语言名称 */
  readonly name: string;
  /** 使用年限 */
  readonly age: (() => number) | undefined;
}
 
let ReadOnlyTypeScript: ReadOnlyProgramLanguage = {
  name: 'TypeScript',
  age: undefined
}
/** ts(2540)错误，name 只读 */
ReadOnlyTypeScript.name = 'JavaScript';
```

> 需要注意的是，这仅仅是静态类型检测层面的只读，实际上并不能阻止对对象的篡改。因为在转译为 JavaScript 之后，readonly 修饰符会被抹除。因此，任何时候与其直接修改一个对象，不如返回一个新的对象，这会是一种比较安全的实践。

#### 定义函数类型

接口类型除了能用来定义对象的类型，还可以用来定义函数的类型 （备注：仅仅是定义函数的类型，而不包含函数的实现），毕竟函数也是对象的一种，具体示例如下。

```typescript
interface StudyLanguage {
  (language: ProgramLanguage): void
}
/** 单独的函数实践 */
let StudyInterface: StudyLanguage 
  = language => console.log(`${language.name} ${language.age()}`);
```

在示例第 1~3 行，我们定义了一个接口类型 StudyLanguage，它有一个函数类型的匿名成员，函数参数类型 ProgramLanguage，返回值的类型是 void，通过这样的格式定义的接口类型又被称之为可执行类型，也就是一个函数类型。

在第 6 行中，我们声明了一个 StudyLanguage 类型的变量，并赋给它一个箭头函数作为值。回想一下 04 讲中提到的上下文类型推断，赋值操作左侧的 StudyLanguage 类型是可以约束箭头函数的类型，所以即便我们没有显式指定函数参数 language 的类型，TypeScript 也能推断出它的类型就是 ProgramLanguage。

实际上，我们很少使用接口类型来定义函数的类型，更多使用内联类型或类型别名（本讲后半部分讲解）配合箭头函数语法来定义函数类型，具体示例如下：

```typescript
type StudyLanguageType = (language: ProgramLanguage) => void
```

#### 索引签名

实际上，我们经常会把对象当 Map 映射使用，比如下边代码示例中定义了索引是任意数字的对象 LanguageRankMap 和索引是任意字符串的对象 LanguageMap。

```typescript
let LanguageRankMap = {
  1: 'TypeScript',
  2: 'JavaScript',
  ...
};
let LanguageMap = {
  TypeScript: 2012,
  JavaScript: 1995,
  ...
};
```

这个时候，我们需要使用索引签名来定义上边提到的对象映射结构，并通过 “[索引名: 类型]”的格式约束索引的类型。

索引名称的类型分为 string 和 number 两种，通过如下定义的 LanguageRankInterface 和 LanguageYearInterface 两个接口，我们可以用来描述索引是任意数字或任意字符串的对象。

```typescript
interface LanguageRankInterface {
  [rank: number]: string;
}
interface LanguageYearInterface {
  [name: string]: number;
}
{
  let LanguageRankMap: LanguageRankInterface = {
    1: 'TypeScript', // ok
    2: 'JavaScript', // ok
    'WrongINdex': '2012' // ts(2322) 不存在的属性名
  };
  
  let LanguageMap: LanguageYearInterface = {
    TypeScript: 2012, // ok
    JavaScript: 1995, // ok
    1: 1970 // ok
  };
}
```

**注意：在上述示例中，数字作为对象索引时，它的类型既可以与数字兼容，也可以与字符串兼容，这与 JavaScript 的行为一致。因此，使用 0 或 '0' 索引对象时，这两者等价。**

同样，我们可以使用 readonly 注解索引签名，此时将对应属性设置为只读就行，如下代码所示：

~~~typescript
{
  interface LanguageRankInterface {
    readonly [rank: number]: string;
  }
  
  interface LanguageYearInterface {
    readonly [name: string]: number;
  }
} 
~~~

在上述示例中，LanguageRankInterface 和 LanguageYearInterface 任意的数字或者字符串类型的属性都是只读的。

**注意：虽然属性可以与索引签名进行混用，但是属性的类型必须是对应的数字索引或字符串索引的类型的子集，否则会出现错误提示。**

下面我们通过如下所示的示例具体来看一下。

~~~typescript
{
  interface StringMap {
    [prop: string]: number;
    age: number; // ok
    name: string; // ts(2411) name 属性的 string 类型不能赋值给字符串索引类型 number
  }
  interface NumberMap {
    [rank: number]: string;
    1: string; // ok
    0: number; // ts(2412) 0 属性的 number 类型不能赋值给数字索引类型 string
  }
  interface LanguageRankInterface {
    name: string; // ok
    0: number; // ok
    [rank: number]: string;
    [name: string]: number;
  } //实际测试的时候其实会报错的，我猜是配置的问题
}
~~~

在上述示例中，因为接口 StringMap 属性 name 的类型 string 不是它所对应的字符串索引（第 3 行定义的 prop: string）类型 number 的子集，所以会提示一个错误。同理，因为接口 NumberMap 属性 0 的类型 number 不是它所对应的数字索引（第 8 行定义的 rank: number）类型 string 的子集，所以也会提示一个错误。

另外，由于上边提到了数字类型索引的特殊性，所以我们不能约束数字索引属性与字符串索引属性拥有截然不同的类型，具体示例如下：

~~~typescript
{
  interface LanguageRankInterface {
    [rank: number]: string; // ts(2413) 数字索引类型 string 类型不能赋值给字符串索引类型 number
    [prop: string]: number;
  }
}
~~~

#### 继承与实现

在 TypeScript 中，接口类型可以继承和被继承，比如我们可以使用如下所示的 extends 关键字实现接口的继承。

~~~typescript
{
  interface DynamicLanguage extends ProgramLanguage {
    rank: number; // 定义新属性
  }
  
  interface TypeSafeLanguage extends ProgramLanguage {
    typeChecker: string; // 定义新的属性
  }
  /** 继承多个 */
  interface TypeScriptLanguage extends DynamicLanguage, TypeSafeLanguage {
    name: 'TypeScript'; // 用原属性类型的兼容的类型(比如子集)重新定义属性
  }
}
~~~

在上述示例中，从第 2~8 行我们定义了两个继承了 ProgramLanguage 的接口 DynamicLanguage 和 TypeSafeLanguage，它们会继承 ProgramLanguage 所有的属性定义。第 11 行我们定义了同时继承了 DynamicLanguage 和 TypeSafeLanguage 的接口 TypeScriptLanguage，它会继承 DynamicLanguage 和 TypeSafeLanguage 所有的属性定义，并且使用同名的 name 属性定义覆盖了继承过来的 name 属性定义。

**注意：我们仅能使用兼容的类型覆盖继承的属性**，如下代码所示：

```typescript
{
  /** ts(6196) 错误的继承，name 属性不兼容 */
  interface WrongTypeLanguage extends ProgramLanguage {
    name: number;
  }
}
```

在上述代码中，因为 ProgramLanguage 的 name 属性是 string 类型，WrongTypeLanguage 的 name 属性是 number，二者不兼容，所以不能继承，也会提示一个 ts(6196) 错误。

我们既可以使用接口类型来约束类，反过来也可以使用类实现接口，那两者之间的关系到底是什么呢？这里，我们通过使用如下所示的 implements 关键字描述一下类和接口之间的关系

~~~typescript
/** 类实现接口 */
{
  class LanguageClass implements ProgramLanguage {
    name: string = '';
    age = () => new Date().getFullYear() - 2012
  }
}
~~~

在上述代码中，类 LanguageClass 实现了 ProgramLanguage 接口约定的 name、age 等属性和方法，如果我们移除 name 或者 age 的实现，将会提示一个类型错误。

#### Type 类型别名

接口类型的一个作用是将内联类型抽离出来，从而实现类型可复用。其实，我们也可以使用类型别名接收抽离出来的内联类型实现复用。

此时，我们可以通过如下所示“type别名名字 = 类型定义”的格式来定义类型别名。

~~~typescript
/** 类型别名 */
{
  type LanguageType = {
    /** 以下是接口属性 */
    /** 语言名称 */
    name: string;
    /** 使用年限 */
    age: () => number;
  }
}
~~~

此外，针对接口类型无法覆盖的场景，比如组合类型、交叉类型，我们只能使用类型别名来接收，如下代码所示:

~~~typescript
{
  /** 联合 */
  type MixedType = string | number;
  /** 交叉 */
  type IntersectionType = { id: number; name: string; } 
    & { age: number; name: string };
  /** 提取接口属性类型 */
  type AgeType = ProgramLanguage['age'];  
}
~~~

在上述代码中，我们定义了一个 IntersectionType 类型别名，表示两个匿名接口类型交叉出的类型；同时定义了一个 AgeType 类型别名，表示抽取的 ProgramLanguage age 属性的类型

> 注意：类型别名，诚如其名，即我们仅仅是给类型取了一个新的名字，并不是创建了一个新的类型。

#### Interface 与 Type 的区别

通过以上介绍，我们已经知道适用接口类型标注的地方大都可以使用类型别名进行替代，这是否意味着在相应的场景中这两者等价呢？

实际上，在大多数的情况下使用接口类型和类型别名的效果等价，但是在某些特定的场景下这两者还是存在很大区别。比如，重复定义的接口类型，它的属性会叠加，这个特性使得我们可以极其方便地对全局变量、第三方库的类型做扩展，如下代码所示：

```typescript
{
  interface Language {
    id: number;
  }
  
  interface Language {
    name: string;
  }
  let lang: Language = {
    id: 1, // ok
    name: 'name' // ok
  }
}
```

在上述代码中，先后定义的两个 Language 接口属性被叠加在了一起，此时我们可以赋值给 lang 变量一个同时包含 id 和 name 属性的对象。

不过，如果我们重复定义类型别名，如下代码所示，则会提示一个 ts(2300) 错误。

~~~typescript
{
  /** ts(2300) 重复的标志 */
  type Language = {
    id: number;
  }
  
  /** ts(2300) 重复的标志 */
  type Language = {
    name: string;
  }
  let lang: Language = {
    id: 1,
    name: 'name'
  }
}
~~~

### 高级类型

#### 联合类型

联合类型（Unions）用来表示变量、参数的类型不是单一原子类型，而可能是多种不同的类型的组合

我们主要通过“|”操作符分隔类型的语法来表示联合类型。这里，我们可以把“|”类比为 JavaScript 中的逻辑或 “||”，只不过前者表示可能的类型。

举个例子，我们封装了一个将 string 或者 number 类型的输入值转换成 '数字 + "px" 格式的函数，如下代码所示：

```typescript
function formatPX(size: unknown) {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  if (typeof size === 'string') {
    return `${parseInt(size) || 0}px`;
  }
  throw Error(` 仅支持 number 或者 string`);
}
formatPX(13);
formatPX('13px');
```

**说明：在学习联合类型之前，我们可能免不了使用 any 或 unknown 类型来表示参数的类型（为了让大家养成好习惯，推荐使用 unknown）。**

通过这样的方式带来的问题是，在调用 formatPX 时，我们可以传递任意的值，并且可以通过静态类型检测（使用 any 亦如是），但是运行时还是会抛出一个错误，例如：

```typescript
formatPX(true);
formatPX(null);
```

这显然不符合我们的预期，因为 size 应该是更明确的，即可能也只可能是 number 或 string 这两种可选类型的类型。

所幸有联合类型，我们可以使用一个更明确表示可能是 number 或 string 的联合类型来注解 size 参数，如下代码所示：

```typescript
function formatPX(size: number | string) {
  // ...
}
formatPX(13); // ok
formatPX('13px'); // ok
formatPX(true); // ts(2345) 'true' 类型不能赋予 'number | string' 类型
formatPX(null); // ts(2345) 'null' 类型不能赋予 'number | string' 类型
```

当然，我们可以组合任意个、任意类型来构造更满足我们诉求的类型。比如，我们希望给前边的示例再加一个 unit 参数表示可能单位，这个时候就可以声明一个字符串字面类型组成的联合类型，如下代码所示：

```typescript
function formatUnit(size: number | string, unit: 'px' | 'em' | 'rem' | '%' = 'px') {
  // ...
}
formatUnit(1, 'em'); // ok
formatUnit('1px', 'rem'); // ok
formatUnit('1px', 'bem'); // ts(2345)
```

我们定义了 formatPX 函数的第二个参数 unit，它的类型是由 'px'、'em'、'rem'、'%' 字符串字面类型组成的类型集合。因此，我们可以在第 5 行和第 6 行传入字符串字面量 'em' 和 'rem' 作为第二个实参。如果在第 8 行我们传入一个不在类型集合中的字符串字面量 'bem' ，就会提示一个 ts(2345) 错误。

我们也可以使用类型别名抽离上边的联合类型，然后再将其进一步地联合，如下代码所示：

```typescript
type ModernUnit = 'vh' | 'vw';
type Unit = 'px' | 'em' | 'rem';
type MessedUp = ModernUnit | Unit; // 类型是 'vh' | 'vw' | 'px' | 'em' | 'rem'
```

这里我们定义了 ModernUnit 别名表示 'vh' 和 'vw' 这两个字面量类型的组合，且定义了 Unit 别名表示 'px' 和 'em' 和 'rem' 字面量类型组合，同时又定义了 MessedUp 别名表示 ModernUnit 和 Unit 两个类型别名的组合。

我们也可以把接口类型联合起来表示更复杂的结构，如下所示示例（援引官方示例，顺带复习一下类型断言 as）：

~~~typescript
interface Bird {
  fly(): void;
  layEggs(): void;
}
interface Fish {
  swim(): void;
  layEggs(): void;
}
const getPet: () => Bird | Fish = () => {
  return {
   // ...
  } as Bird | Fish;
};
const Pet = getPet();
Pet.layEggs(); // ok
Pet.fly(); // ts(2339) 'Fish' 没有 'fly' 属性; 'Bird | Fish' 没有 'fly' 属性
~~~

从上边的示例可以看到，在联合类型中，我们可以直接访问各个接口成员都拥有的属性、方法，且不会提示类型错误。但是，如果是个别成员特有的属性、方法，我们就需要区分对待了，此时又要引入类型守卫来区分不同的成员类型。

只不过，在这种情况下，我们还需要使用基于 in 操作符判断的类型守卫，如下代码所示：

~~~typescript
if (typeof Pet.fly === 'function') { // ts(2339)
  Pet.fly(); // ts(2339)
}
if ('fly' in Pet) {
  Pet.fly(); // ok
}
~~~

因为 Pet 的类型既可能是 Bird 也可能是 Fish，这就意味着在第 1 行可能会通过 Fish 类型获取 fly 属性，但 Fish 类型没有 fly 属性定义，所以会提示一个 ts(2339) 错误。

#### 交叉类型

在 TypeScript 中，确实还存在一种类似逻辑与行为的类型——交叉类型（Intersection Type），它可以把多个类型合并成一个类型，合并后的类型将拥有所有成员类型的特性。

在 TypeScript 中，我们可以使用“&”操作符来声明交叉类型，如下代码所示：

~~~typescript
{
  type Useless = string & number;
}
~~~

很显然，如果我们仅仅把原始类型、字面量类型、函数类型等原子类型合并成交叉类型，是没有任何用处的，因为任何类型都不能满足同时属于多种原子类型，比如既是 string 类型又是 number 类型。因此，在上述的代码中，类型别名 Useless 的类型就是个 never。

#### 合并接口类型

联合类型真正的用武之地就是将多个接口类型合并成一个类型，从而实现等同接口继承的效果，也就是所谓的合并接口类型，如下代码所示：

~~~typescript
  type IntersectionType = { id: number; name: string; } 
    & { age: number };
  const mixed: IntersectionType = {
    id: 1,
    name: 'name',
    age: 18
  }
~~~

在上述示例中，我们通过交叉类型，使得 IntersectionType 同时拥有了 id、name、age 所有属性，这里我们可以试着将合并接口类型理解为求并集。

如果同名属性的类型不兼容，比如下面示例中两个接口类型同名的 name 属性类型一个是 number，另一个是 string，合并后，name 属性的类型就是 number 和 string 两个原子类型的交叉类型，即 never，如下代码所示：

~~~typescript
  type IntersectionTypeConfict = { id: number; name: string; } 
    & { age: number; name: number; };
  const mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ts(2322) 错误，'number' 类型不能赋给 'never' 类型
    age: 2
  };
~~~

此时，我们赋予 mixedConflict 任意类型的 name 属性值都会提示类型错误。而如果我们不设置 name 属性，又会提示一个缺少必选的 name 属性的错误。在这种情况下，就意味着上述代码中交叉出来的 IntersectionTypeConfict 类型是一个无用类型。

如果同名属性的类型兼容，比如一个是 number，另一个是 number 的子类型、数字字面量类型，合并后 name 属性的类型就是两者中的子类型。

如下所示示例中 name 属性的类型就是数字字面量类型 2，因此，我们不能把任何非 2 之外的值赋予 name 属性。

~~~typescript
  type IntersectionTypeConfict = { id: number; name: 2; } 
  & { age: number; name: number; };
  let mixedConflict: IntersectionTypeConfict = {
    id: 1,
    name: 2, // ok
    age: 2
  };
  mixedConflict = {
    id: 1,
    name: 22, // '22' 类型不能赋给 '2' 类型
    age: 2
  };
~~~

#### 合并联合类型

另外，我们可以合并联合类型为一个交叉类型，这个交叉类型需要同时满足不同的联合类型限制，也就是提取了所有联合类型的相同类型成员。这里，我们也可以将合并联合类型理解为求交集。

在如下示例中，两个联合类型交叉出来的类型 IntersectionUnion 其实等价于 'em' | 'rem'，所以我们只能把 'em' 或者 'rem' 字符串赋值给 IntersectionUnion 类型的变量。

~~~typescript
 type UnionA = 'px' | 'em' | 'rem' | '%';
 type UnionB = 'vh' | 'em' | 'rem' | 'pt';
 type IntersectionUnion = UnionA & UnionB;
 const intersectionA: IntersectionUnion = 'em'; // ok
 const intersectionB: IntersectionUnion = 'rem'; // ok
 const intersectionC: IntersectionUnion = 'px'; // ts(2322)
 const intersectionD: IntersectionUnion = 'pt'; // ts(2322)
~~~

既然是求交集，如果多个联合类型中没有相同的类型成员，交叉出来的类型自然就是 never 了，如下代码所示：

~~~typescript
type UnionC = 'em' | 'rem';
type UnionD = 'px' | 'pt';
type IntersectionUnionE = UnionC & UnionD;
const intersectionE: IntersectionUnionE = 'any' as any; // ts(2322) 不能赋予 'never' 类型
~~~

#### 联合、交叉组合

在前面的示例中，我们把一些联合、交叉类型抽离成了类型别名，再把它作为原子类型进行进一步的联合、交叉。其实，联合、交叉类型本身就可以直接组合使用，这就涉及 |、& 操作符的优先级问题。实际上，联合、交叉运算符不仅在行为上表现一致，还在运算的优先级和 JavaScript 的逻辑或 ||、逻辑与 && 运算符上表现一致 。

联合操作符 | 的优先级低于交叉操作符 &，同样，我们可以通过使用小括弧 () 来调整操作符的优先级。

~~~typescript
type UnionIntersectionA = { id: number; } & { name: string; } | { id: string; } & { name: number; }; 
// 交叉操作符优先级高于联合操作符
type UnionIntersectionB = ('px' | 'em' | 'rem' | '%') | ('vh' | 'em' | 'rem' | 'pt'); // 调整优先级
~~~

进而，我们也可以把分配率、交换律等基本规则引入类型组合中，然后优化出更简洁、清晰的类型，如下代码所示：

~~~typescript
type UnionIntersectionC = ({ id: number; } & { name: string; } | { id: string; }) & { name: number; };
type UnionIntersectionD = { id: number; } & { name: string; } & { name: number; } | { id: string; } & { name: number; }; 
// 满足分配率
type UnionIntersectionE = ({ id: string; } | { id: number; } & { name: string; }) & { name: number; }; // 满足交换律
~~~

在上述代码中，第 2 行是在第 1 行的基础上进行展开，说明 & 满足分配率；第 3 行则是在第 1 行的基础上调整了成员的顺序，说明 | 操作满足交换律。

#### 类型缩减

如果将 string 原始类型和“string字面量类型”组合成联合类型，效果就是类型缩减成 string 了，对于 number、boolean（其实还有枚举类型）也是一样的缩减逻辑，如下所示示例：

~~~typescript
  type URStr = 'string' | string; // 类型是 string
  type URNum = 2 | number; // 类型是 number
  type URBoolen = true | boolean; // 类型是 boolean
  enum EnumUR {
    ONE,
    TWO
  }
  type URE = EnumUR.ONE | EnumUR; // 类型是 EnumUR
~~~

TypeScript 对这样的场景做了缩减，它把字面量类型、枚举成员类型缩减掉，只保留原始类型、枚举类型等父类型，这是合理的“优化”。

可是这个缩减，却极大地削弱了 IDE 自动提示的能力，如下代码所示：

~~~typescript
 type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string; // 类型缩减成 string
~~~

在上述代码中，我们希望 IDE 能自动提示显示注解的字符串字面量，但是因为类型被缩减成 string，所有的字符串字面量 black、red 等都无法自动提示出来了。
不要慌，TypeScript 官方其实还提供了一个黑魔法，它可以让类型缩减被控制。如下代码所示，我们只需要给父类型添加“& {}”即可。

~~~typescript
  type BorderColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | string & {}; // 字面类型都被保留
~~~

此外，当联合类型的成员是接口类型，如果满足其中一个接口的属性是另外一个接口属性的子集，这个属性也会类型缩减，如下代码所示：

~~~typescript
  type UnionInterce =
  | {
      age: '1';
    }
  | ({
      age: '1' | '2';
      [key: string]: string;
    });
~~~

这里因为 '1' 是 '1' | '2' 的子集，所以 age 的属性变成 '1' | '2'。

如何定义如下所示 age 属性是数字类型，而其他不确定的属性是字符串类型的数据结构的对象？

~~~typescript
{
  age: 1, // 数字类型
  anyProperty: 'str', // 其他不确定的属性都是字符串类型
  ...
}
~~~

我们肯定要用到两个接口的联合类型及类型缩减，这个问题的核心在于找到一个既是 number 的子类型，这样 age 类型缩减之后的类型就是 number；同时也是 string 的子类型，这样才能满足属性和 string 索引类型的约束关系。

never 有一个特性是它是所有类型的子类型，自然也是 number 和 string 的子类型，所以答案如下代码所示：

~~~typescript
  type UnionInterce =
  | {
      age: number;
    }
  | ({
      age: never;
      [key: string]: string;
    });
  const O: UnionInterce = {
    age: 2,
    string: 'string'
  };
~~~

在上述代码中，我们在第 3 行定义了 number 类型的 age 属性，第 6 行定义了 never 类型的 age 属性，等价于 age 属性的类型是由 number 和 never 类型组成的联合类型，所以我们可以把 number 类型的值（比如说数字字面量 1）赋予 age 属性；但是不能把其他任何类型的值（比如说字符串字面量 'string' ）赋予 age。

同时，我们在第 5 行~第 8 行定义的接口类型中，还额外定义了 string 类型的字符串索引签名。因为 never 同时又是 string 类型的子类型，所以 age 属性的类型和字符串索引签名类型不冲突。如第 9 行~第 12 行所示，我们可以把一个 age 属性是 2、string 属性是 'string' 的对象字面量赋值给 UnionInterce 类型的变量 O。

### 枚举类型

枚举（Enums），用来表示一个被命名的整型常数的集合。

#### 枚举类型

在 TypeScript 中，我们可以使用枚举定义包含被命名的常量的集合，比如 TypeScript 支持数字、字符两种常量值的枚举类型。

我们也可以使用 enum 关键字定义枚举类型，格式是 enum + 枚举名字 + 一对花括弧，花括弧里则是被命名了的常量成员。

下面是使用枚举类型实现表示星期的联合类型的示例，如下代码所示：

```typescript
 enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
  } 
```

> **注意：**相对于其他类型，enum 也是一种比较特殊的类型，因为它兼具值和类型于一体，有点类似 class（在定义 class 结构时， 其实我们也自动定义了 class 实例的类型）。

在上述示例中，Day 既可以表示集合，也可以表示集合的类型，所有成员（enum member）的类型都是 Day 的子类型。

JavaScript 中其实并没有与枚举类型对应的原始实现，而 TypeScript 转译器会把枚举类型转译为一个属性为常量、命名值从 0 开始递增数字映射的对象，在功能层面达到与枚举一致的效果（然而不是所有的特性在 JavaScript 中都有对应的实现）。

下面我们通过如下所示示例看看将如上示例转译为 JavaScript 后的效果。

~~~typescript
    var Day = void 0;
    (function (Day) {
        Day[Day["SUNDAY"] = 0] = "SUNDAY";
        Day[Day["MONDAY"] = 1] = "MONDAY";
        Day[Day["TUESDAY"] = 2] = "TUESDAY";
        Day[Day["WEDNESDAY"] = 3] = "WEDNESDAY";
        Day[Day["THURSDAY"] = 4] = "THURSDAY";
        Day[Day["FRIDAY"] = 5] = "FRIDAY";
        Day[Day["SATURDAY"] = 6] = "SATURDAY";
    })(Day || (Day = {}));
~~~

在 TypeScript 中，我们可以通过“枚举名字.常量命名”的格式获取枚举集合里的成员，如下代码所示：

~~~typescript
  function work(d: Day) {
    switch (d) {
      case Day.SUNDAY:
      case Day.SATURDAY:
        return 'take a rest';
      case Day.MONDAY:
      case Day.TUESDAY:
      case Day.WEDNESDAY:
      case Day.THURSDAY:
      case Day.FRIDAY:
        return 'work hard';
    }
  }
~~~

示例中的第 3 行到第 10 行，我们通过 Day.SUNDAY 这样的格式就可以访问枚举的所有成员了。 上面示例中的 work 函数转译为 JavaScript 后，里面的 switch 分支运行时的效果实际上等价于如下所示代码：

~~~typescript
    switch (d) {
      case 0:
      case 1:
        return 'take a rest';
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        return 'work hard';
    }
~~~

这就意味着在 JavaScript 中调用 work 函数时，传递的参数无论是 enum 还是数值，逻辑上将没有区别，当然这也符合 TypeScript 静态类型检测规则，如下代码所示：

~~~typescript
work(Day.SUNDAY); // ok
work(0); // ok
~~~

**常见的7种枚举类型：数字类型、字符串类型、异构类型、常量成员和计算（值）成员、枚举成员类型和联合枚举、常量枚举、外部枚举。**

#### 1.数字类型

在仅仅指定常量命名的情况下，我们定义的就是一个默认从 0 开始递增的数字集合，称之为数字枚举。

如果我们希望枚举值从其他值开始递增，则可以通过“常量命名 = 数值” 的格式显示指定枚举成员的初始值，如下代码所示：

~~~typescript
  enum Day {
    SUNDAY = 1,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY
  }
~~~

事实上，我们可以给 SUNDAY 指定任意类型（比如整数、负数、小数等）、任意起始的数字，其后未显示指定值的成员会递增加 1。上边的示例转译为 JavaScript 之后，则是一个属性值从 1 开始递增的对象，如下代码所示：

~~~typescript
    var Day = void 0;
    (function (MyDay) {
        Day[Day["SUNDAY"] = 1] = "SUNDAY";
        Day[Day["MONDAY"] = 2] = "MONDAY";
        ...
        Day[Day["SATURDAY"] = 7] = "SATURDAY";
    })(Day || (Day = {}));
~~~

当然我们也可以给任意成员指定值:

~~~typescript
  enum Day {
    SUNDAY,
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY = 5
  }
~~~

这里我们给最后一个成员 SATURDAY 指定了初始值 5，但转译后的结果就比较尴尬了，如下代码所示：

~~~typescript
  ...
        Day[Day["FRIDAY"] = 5] = "FRIDAY";
        Day[Day["SATURDAY"] = 5] = "SATURDAY";
  ...
  
~~~

我们可以看到 MyDay.FRIDAY 和 MyDay.SATURDAY 的值都是数字 5，这就导致使用 Day 枚举作为 switch 分支条件的函数 work，在接收 MyDay.SATURDAY 作为入参时，也会进入 MyDay.FRIDAY 的分支，从而出现逻辑错误。

这个经验告诉我们，由于枚举默认的值自递增且完全无法保证稳定性，所以给部分数字类型的枚举成员显式指定数值或给函数传递数值而不是枚举类型作为入参都属于不明智的行为。

此外，常量命名、结构顺序都一致的两个枚举，即便转译为 JavaScript 后，同名成员的值仍然一样（满足恒等 === ）。但在 TypeScript 看来，它们不相同、不满足恒等，如下代码所示：

~~~typescript
  enum MyDay {
    SUNDAY,
    ...
  } 
  
  Day.SUNDAY === MyDay.SUNDAY; // ts(2367) 两个枚举值恒不相等
  work(MyDay.SUNDAY); // ts(2345) 'MyDay.SUNDAY' 不能赋予 'Day'
~~~

这里的 MyDay 和上边的 Day 看似一样，但是如果我们拿 MyDay 和 Day 的成员进行比较（第 6 行），或者把 MyDay 传值给形参是 Day 类型的 work 函数（第 7 行），就会发现都会提示错误。

不仅仅是数字类型枚举，所有其他枚举都仅和自身兼容，这就消除了由于枚举不稳定性可能造成的风险，所以这是一种极其安全的设计。不过，这可能会使得枚举变得不那么好用，因为不同枚举之间完全不兼容，所以不少 TypeScript 编程人员觉得枚举类型是一种十分鸡肋的类型。而两个结构完全一样的枚举类型如果互相兼容，则会更符合我们的预期，比如说基于 Swagger 自动生成的不同模块中结构相同且描述同一个常量集合的多个同名枚举。

不过，此时我们可能不得不使用类型断言（as）或者重构代码将“相同“的枚举类型抽离为同一个公共的枚举（我们更推荐后者）。

#### 2.字符串枚举

在 TypeScript 中，我们将定义值是字符串字面量的枚举称之为字符串枚举，字符串枚举转译为 JavaScript 之后也将保持这些值，我们来看下如下所示示例：

~~~typescript
  enum Day {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    ...
  }
~~~

这里我们定义了成员 SUNDAY 的值是 'SUNDAY'、MONDAY 的值是 'MONDAY'。

而上述示例转译为 JavaScript 后，Day.SUNDAY 的值依旧是 'SUNDAY'，Day.MONDAY 的值依旧是 'MONDAY'，如下代码所示：

~~~typescript
    var Day = void 0;
    (function (Day) {
        Day["SUNDAY"] = "SUNDAY";
        Day["MONDAY"] = "MONDAY";
    })(Day || (Day = {}));
~~~

相比于没有明确意义的递增值的数字枚举，字符串枚举的成员在运行和调试阶段，更具备明确的含义和可读性，枚举成员的值就是我们显式指定的字符串字面量。

#### 3.异构枚举（Heterogeneous enums）

从技术上来讲，TypeScript 支持枚举类型同时拥有数字和字符类型的成员，这样的枚举被称之为异构枚举。

当然，异构枚举也被认为是很“鸡肋”的类型。比如如下示例中，我们定义了成员 SUNDAY 是 'SUNDAY'、MONDAY 是 2，很抱歉，我也不知道这样的枚举能在哪些有用的场合进行使用。

~~~typescript
  enum Day {
    SUNDAY = 'SUNDAY',
    MONDAY = 2,
    ...
  }
~~~

枚举成员的值既可以是数字、字符串这样的常量，也可以是通过表达式所计算出来的值。这就涉及枚举里成员的一个分类，即常量成员和计算成员。

#### 4.常量成员和计算（值）成员

在前边示例中，涉及的枚举成员的值都是字符串、数字字面量和未指定初始值从 0 递增数字常量，都被称作常量成员。

另外，在转译时，通过被计算的常量枚举表达式定义值的成员，也被称作常量成员，比如如下几种情况：

* 引用来自预先定义的常量成员，比如来自当前枚举或其他枚举；

* 圆括弧 () 包裹的常量枚举表达式；

* 在常量枚举表达式上应用的一元操作符 +、 -、~ ；

* 操作常量枚举表达式的二元操作符 +、-、*、/、%、<<、>>、>>>、&、|、^。

除以上这些情况之外，其他都被认为是计算（值）成员。

如下所示示例（援引自官方示例）中，除了 G 是计算成员之外，其他都属于常量成员。

~~~typescript
  enum FileAccess {
    // 常量成员
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    // 计算成员
    G = "123".length,
  }
~~~

> **注意：**关于常量成员和计算成员的划分其实比较难理解，实际上它们也并没有太大的用处，只是告诉我们通过这些途径可以定义枚举成员的值。因此，我们只需记住缺省值（从 0 递增）、数字字面量、字符串字面量肯定是常量成员就够了。

#### 5.枚举成员类型和联合枚举

另外，对于不需要计算（值）的常量类型成员，即缺省值（从 0 递增）、数字字面量、字符串字面量这三种情况（这就是为什么我们只需记住这三种情况），被称之为字面量枚举成员。

前面我们提到枚举值和类型是一体的，枚举成员的类型是枚举类型的子类型。

枚举成员和枚举类型之间的关系分两种情况： 如果枚举的成员同时包含字面量和非字面量枚举值，枚举成员的类型就是枚举本身（枚举类型本身也是本身的子类型）；如果枚举成员全部是字面量枚举值，则所有枚举成员既是值又是类型，如下代码所示：

```typescript
 enum Day {
    SUNDAY,
    MONDAY,
  }
  enum MyDay {
    SUNDAY,
    MONDAY = Day.MONDAY
  }
  const mondayIsDay: Day.MONDAY = Day.MONDAY; // ok: 字面量枚举成员既是值，也是类型
  const mondayIsSunday = MyDay.SUNDAY; // ok: 类型是 MyDay，MyDay.SUNDAY 仅仅是值
  const mondayIsMyDay2: MyDay.MONDAY = MyDay.MONDAY; // ts(2535)，MyDay 包含非字面量值成员，所以 MyDay.MONDAY 不能作为类型
```

这里因为 Day 的所有成员都是字面量枚举成员，所以 Day.MONDAY 可以同时作为值和类型使用（第 11 行）。但是 MyDay 的成员 MONDAY 是非字面量枚举成员（但是是常量枚举成员），所以 MyDay.MONDAY 仅能作为值使用（第 12 行 ok，第 13 行提示错误）。

另外，如果枚举仅有一个成员且是字面量成员，那么这个成员的类型等于枚举类型，如下代码所示：

~~~typescript
enum Day {
  MONDAY
}
export const mondayIsDay: Day = Day.MONDAY; // ok
export const mondayIsDay1: Day.MONDAY = mondayIsDay as Day; // ok
~~~

因为枚举 Day 仅包含一个字面量成员 MONDAY，所以类型 Day 和 Day.MONDAY 可以互相兼容。比如第 4 行和第 5 行，我们既能把 Day.MONDAY 类型赋值给 Day 类型，也能把 Day 类型赋值给 Day.MONDAY 类型。

纯字面量成员枚举类型也具有字面量类型的特性，也就等价于枚举的类型将变成各个成员类型组成的联合（枚举）类型。

联合类型使得 TypeScript 可以更清楚地枚举集合里的确切值，从而检测出一些永远不会成立的条件判断（俗称 Dead Code），如下所示示例（援引自官方恒为真的示例）：

~~~typescript
  enum Day {
    SUNDAY,
    MONDAY,
  }
  
  const work = (x: Day) => {
    if (x !== Day.SUNDAY || x !== Day.MONDAY) { // ts(2367)
    }
  }
~~~

在上边示例中，TypeScript 确定 x 的值要么是 Day.SUNDAY，要么是 Day.MONDAY。因为 Day 是纯字面量枚举类型，可以等价地看作联合类型 Day.SUNDAY | Day.MONDAY，所以我们判断出第 7 行的条件语句恒为真，于是提示了一个 ts(2367) 错误。

不过，如果枚举包含需要计算（值）的成员情况就不一样了。如下示例中，TypeScript 不能区分枚举 Day 中的每个成员。因为每个成员类型都是 Day，所以无法判断出第 7 行的条件语句恒为真，也就不会提示一个 ts(2367) 错误。

~~~typescript
  enum Day {
    SUNDAY = +'1',
    MONDAY = 'aa'.length,
  }
  
  const work = (x: Day) => {
    if (x !== Day.SUNDAY || x !== Day.MONDAY) { // ok
    }
  }
~~~

此外，字面量类型所具有的类型推断、类型缩小的特性，也同样适用于字面量枚举类型，如下代码所示：

~~~typescript
  enum Day {
    SUNDAY,
    MONDAY,
  }
  let SUNDAY = Day.SUNDAY; // 类型是 Day
  const SUNDAY2 = Day.SUNDAY; // 类型 Day.SUNDAY
  const work = (x: Day) => {
    if (x === Day.SUNDAY) {
      x; // 类型缩小为 Day.SUNDAY
    }
  }
~~~

在上述代码中，我们在第 5 行通过 let 定义了一个未显式声明类型的变量 SUNDAY，TypeScript 可推断其类型是 Day；在第 6 行通过 const 定义了一个未显式声明类型的变量 SUNDAY2，TypeScript 可推断其类型是 Day.SUNDAY；在第 8 行的 if 条件判断中，变量 x 类型也从 Day 缩小为 Day.SUNDAY。

#### 6.常量枚举（const enums）

枚举的作用在于定义被命名的常量集合，而 TypeScript 提供了一些途径让枚举更加易用，比如常量枚举。

我们可以通过添加 const 修饰符定义常量枚举，常量枚举定义转译为 JavaScript 之后会被移除，并在使用常量枚举成员的地方被替换为相应的内联值，因此常量枚举的成员都必须是常量成员（字面量 + 转译阶段可计算值的表达式），如下代码所示：

~~~ typescript
  const enum Day {
    SUNDAY,
    MONDAY
  }
  const work = (d: Day) => {
    switch (d) {
      case Day.SUNDAY:
        return 'take a rest';
      case Day.MONDAY:
        return 'work hard';
    }
  }
}
~~~

这里我们定义了常量枚举 Day，它的成员都是值自递增的常量成员，并且在 work 函数的 switch 分支里引用了 Day。

转译为成 JavaScript 后，Day 枚举的定义就被移除了，work 函数中对 Day 的引用也变成了常量值的引用（第 3 行内联了 0、第 5 行内联了 1），如下代码所示：

~~~ typescript
    var work = function (d) {
        switch (d) {
            case 0 /* SUNDAY */:
                return 'take a rest';
            case 1 /* MONDAY */:
                return 'work hard';
        }
    }; 
~~~

从以上示例我们可以看到，使用常量枚举不仅能减少转译后的 JavaScript 代码量（因为抹除了枚举定义），还不需要到上级作用域里查找枚举定义（因为直接内联了枚举值字面量）。

因此，通过定义常量枚举，我们可以以清晰、结构化的形式维护相关联的常量集合，比如 switch case分支，使得代码更具可读性和易维护性。而且因为转译后抹除了定义、内联成员值，所以在代码的体积和性能方面并不会比直接内联常量值差。

#### 7.外部枚举（Ambient enums）

在 TypeScript 中，我们可以通过 declare 描述一个在其他地方已经定义过的变量，如下代码所示：

~~~typescript
declare let $: any;
$('#id').addClass('show'); // ok
~~~

第 1 行我们使用 declare 描述类型是 any 的外部变量 $，在第 2 行则立即使用 $ ，此时并不会提示一个找不到 $ 变量的错误。

同样，我们也可以使用 declare 描述一个在其他地方已经定义过的枚举类型，通过这种方式定义出来的枚举类型，被称之为外部枚举，如下代码所示：

~~~typescript
declare enum Day {
  SUNDAY,
  MONDAY,
}
const work = (x: Day) => {
  if (x === Day.SUNDAY) {
    x; // 类型是 Day
  }
}
~~~

这里我们认定在其他地方已经定义了一个 Day 这种结构的枚举，且 work 函数中使用了它。

转译为 JavaScript 之后，外部枚举的定义也会像常量枚举一样被抹除，但是对枚举成员的引用会被保留（第 2 行保留了对 Day.SUNDAY 的引用），如下代码所示：

~~~typescript
var work = function (x) {
    if (x === Day.SUNDAY) {
        x;
    }
};
~~~

外部枚举和常规枚举的差异在于以下几点：

* 在外部枚举中，如果没有指定初始值的成员都被当作计算（值）成员，这跟常规枚举恰好相反；

* 即便外部枚举只包含字面量成员，这些成员的类型也不会是字面量成员类型，自然完全不具备字面量类型的各种特性。

我们可以一起使用 declare 和 const 定义外部常量枚举，使得它转译为 JavaScript 之后仍像常量枚举一样。在抹除枚举定义的同时，我们可以使用内联枚举值替换对枚举成员的引用。

外部枚举的作用在于为两个不同枚举（实际上是指向了同一个枚举类型）的成员进行兼容、比较、被复用提供了一种途径，这在一定程度上提升了枚举的可用性，让其显得不那么“鸡肋”。

### 泛型

#### 什么是泛型

我们可以借用 Java 中泛型的释义来回答这个问题：泛型指的是类型参数化，即将原来某种具体的类型进行参数化。和定义函数参数一样，我们可以给泛型定义若干个类型参数，并在调用时给泛型传入明确的类型参数。设计泛型的目的在于有效约束类型成员之间的关系，比如函数参数和返回值、类或者接口成员和方法之间的关系。

#### 泛型类型参数

泛型最常用的场景是用来约束函数参数的类型，我们可以给函数定义若干个被调用时才会传入明确类型的参数。

比如以下定义的一个 reflect 函数 ，它可以接收一个任意类型的参数，并原封不动地返回参数的值和类型，那我们该如何描述这个函数呢？好像得用上 unknown 了（其实我想说的是 any，因为 any is 魔鬼，所以还是用 unknown 吧）。

~~~typescript
function reflect(param: unknown) {
  return param;
}
const str = reflect('string'); // str 类型是 unknown
const num = reflect(1); // num 类型 unknown
~~~

此时，reflect 函数虽然可以接收一个任意类型的参数并原封不动地返回参数的值，不过返回值类型不符合我们的预期。因为我们希望返回值类型与入参类型一一对应（比如 number 对 number、string 对 string），而不是无论入参是什么类型，返回值一律是 unknown。

此时，泛型正好可以满足这样的诉求，那如何定义一个泛型参数呢？首先，我们把参数 param 的类型定义为一个（类型层面的）参数、变量，而不是一个明确的类型，等到函数调用时再传入明确的类型。

比如我们可以通过尖括号 <> 语法给函数定义一个泛型参数 P，并指定 param 参数的类型为 P ，如下代码所示：

~~~typescript
function reflect<P>(param: P) {
  return param;
}
~~~

我们也可以使用泛型显式地注解返回值的类型，虽然没有这个必要（因为返回值的类型可以基于上下文推断出来）。比如调用如下所示的 reflect 时，我们可以通过尖括号 <> 语法给泛型参数 P 显式地传入一个明确的类型。

~~~typescript
function reflect<P>(param: P):P {
  return param;
}
~~~

然后在调用函数时，我们也通过 <> 语法指定了如下所示的 string、number 类型入参，相应地，reflectStr 的类型是 string，reflectNum 的类型是 number。

~~~typescript
const reflectStr = reflect<string>('string'); // str 类型是 string
const reflectNum = reflect<number>(1); // num 类型 number
~~~

另外，如果调用泛型函数时受泛型约束的参数有传值，泛型参数的入参可以从参数的类型中进行推断，而无须再显式指定类型（可缺省），因此上边的示例可以简写为如下示例：

~~~typescript
const reflectStr2 = reflect('string'); // str 类型是 string
const reflectNum2 = reflect(1); // num 类型 number
~~~

泛型不仅可以约束函数整个参数的类型，还可以约束参数属性、成员的类型，比如参数的类型可以是数组、对象，如下示例：

~~~typescript
function reflectArray<P>(param: P[]) {
  return param;
}
const reflectArr = reflectArray([1, '1']); // reflectArr 是 (string | number)[]
~~~

这里我们约束了 param 的类型是数组，数组的元素类型是泛型入参。

通过泛型，我们可以约束函数参数和返回值的类型关系。举一个我们比较熟悉的实际场景 React Hooks useState 为例，如下示例中，第 2 行 return 的元组（因为 useState 返回的是长度为 2、元素类型固定的数组）的第一个元素的类型就是泛型 S，第二个函数类型元素的参数类型也是泛型 S。

~~~typescript
function useState<S>(state: S, initialValue?: S) {
  return [state, (s: S) => void 0] as unknown as [S, (s: S) => void];
}
~~~

**注意：函数的泛型入参必须和参数/参数成员建立有效的约束关系才有实际意义。** 比如在下面示例中，我们定义了一个仅约束返回值类型的泛型，它是没有任何意义的。

~~~typescript
function uselessGenerics<P>(): P {
  return void 0 as unknown as P;
}
~~~

我们可以给函数定义任何个数的泛型入参，如下代码所示：

~~~typescript
function reflectExtraParams<P, Q>(p1: P, p2: Q): [P, Q] {
  return [p1, p2];
}
~~~

在上述代码中，我们定义了一个拥有两个泛型入参（P 和 Q）的函数 reflectExtraParams，并通过 P 和 Q 约束函数参数 p1、p2 和返回值的类型。

#### 泛型类

在类的定义中，我们还可以使用泛型用来约束构造函数、属性、方法的类型，如下代码所示：

~~~typescript
class Memory<S> {
  store: S;
  constructor(store: S) {
    this.store = store;
  }
  set(store: S) {
    this.store = store;
  }
  get() {
    return this.store;
  }
}
const numMemory = new Memory<number>(1); // <number> 可缺省
const getNumMemory = numMemory.get(); // 类型是 number
numMemory.set(2); // 只能写入 number 类型
const strMemory = new Memory(''); // 缺省 <string>
const getStrMemory = strMemory.get(); // 类型是 string
strMemory.set('string'); // 只能写入 string 类型
~~~

首先，我们定义了一个支持读写的寄存器类 Memory，并使用泛型约束了 Memory 类的构造器函数、set 和 get 方法形参的类型，最后实例化了泛型入参分别是 number 和 string 类型的两种寄存器。

泛型类和泛型函数类似的地方在于，在创建类实例时，如果受泛型约束的参数传入了明确值，则泛型入参（确切地说是传入的类型）可缺省，比如第 14 行、第 18 行，`<number>`、`<string>` 泛型入参就是可以缺省的。

**Tips:对于 React 开发者而言，组件也支持泛型，如下代码所示。**

~~~typescript
function GenericCom<P>(props: { prop1: string }) {
  return <></>;
};
<GenericCom<{ name: string; }> prop1="1" ... />
~~~

在第 1 行~第 3 行，我们定义了一个泛型组件 GenericCom，它接收了一个类型入参 P。在第 4 行，通过 JSX 语法创建组件元素的同时，我们还显式指定了接口类型 { name: string } 作为入参。

#### 泛型类型

我们可以使用 Array<类型> 的语法来定义数组类型，这里的 Array 本身就是一种类型。在 TypeScript 中，类型本身就可以被定义为拥有不明确的类型参数的泛型，并且可以接收明确类型作为入参，从而衍生出更具体的类型，如下代码所示：

~~~ typescript
const reflectFn: <P>(param: P) => P = reflect; // ok
~~~

这里我们为变量 reflectFn 显式添加了泛型类型注解，并将 reflect 函数作为值赋给了它。

我们也可以把 reflectFn 的类型注解提取为一个能被复用的类型别名或者接口，如下代码所示：

~~~typescript
type ReflectFuncton = <P>(param: P) => P;
interface IReflectFuncton {
  <P>(param: P): P
}
const reflectFn2: ReflectFuncton = reflect;
const reflectFn3: IReflectFuncton = reflect;
~~~

将类型入参的定义移动到类型别名或接口名称后，此时定义的一个接收具体类型入参后返回一个新类型的类型就是泛型类型。

如下示例中，我们定义了两个可以接收入参 P 的泛型类型（GenericReflectFunction 和 IGenericReflectFunction ）。

~~~typescript
type GenericReflectFunction<P> = (param: P) => P;
interface IGenericReflectFunction<P> {
  (param: P): P;
}
const reflectFn4: GenericReflectFunction<string> = reflect; // 具象化泛型
const reflectFn5: IGenericReflectFunction<number> = reflect; // 具象化泛型
const reflectFn3Return = reflectFn4('string'); // 入参和返回值都必须是 string 类型
const reflectFn4Return = reflectFn5(1); //  入参和返回值都必须是 number 类型
~~~

在泛型定义中，我们甚至可以使用一些类型操作符进行运算表达，使得泛型可以根据入参的类型衍生出各异的类型，如下代码所示：

~~~typescript
type StringOrNumberArray<E> = E extends string | number ? E[] : E;
type StringArray = StringOrNumberArray<string>; // 类型是 string[]
type NumberArray = StringOrNumberArray<number>; // 类型是 number[]
type NeverGot = StringOrNumberArray<boolean>; // 类型是 boolean
~~~

这里我们定义了一个泛型，如果入参是 number | string 就会生成一个数组类型，否则就生成入参类型。而且，我们还使用了与 JavaScript 三元表达式完全一致的语法来表达类型运算的逻辑关系。
**发散一下，如果我们给上面这个泛型传入了一个 string | boolean 联合类型作为入参，将会得到什么类型呢？且看如下所示示例：**

~~~typescript
type BooleanOrString = string | boolean;
type WhatIsThis = StringOrNumberArray<BooleanOrString>; // 好像应该是 string | boolean ?
type BooleanOrStringGot = BooleanOrString extends string | number ? BooleanOrString[] : BooleanOrString; //  string | boolean
~~~

BooleanOrStringGot 和 WhatIsThis 这两个类型别名的类型居然不一样，这 TM 是什么逻辑？这个就是所谓的**分配条件类型（Distributive Conditional Types）**。

**关于分配条件类型这个概念，官方的释义：**在条件类型判断的情况下（比如上边示例中出现的 extends），如果入参是联合类型，则会被拆解成一个个独立的（原子）类型（成员）进行类型运算。

比如上边示例中的 string | boolean 入参，先被拆解成 string 和 boolean 这两个独立类型，再分别判断是否是 string | number 类型的子集。因为 string 是子集而 boolean 不是，所以最终我们得到的 WhatIsThis 的类型是 boolean | string[]。

能接受入参的泛型类型和函数一样，都可以对入参类型进行计算并返回新的类型，像是在做类型运算。

利用泛型，我们可以抽象封装出很多有用、复杂的类型约束。比如在 Redux Model 中约束 State 和 Reducers 的类型定义关系，我们可以通过如下所示代码定义了一个既能接受 State 类型入参，又包含 state 和 reducers 这两个属性的接口类型泛型，并通过 State 入参约束了泛型的 state 属性和 reducers 属性下 action 索引属性的类型关系。

~~~typescript
interface ReduxModel<State> {
  state: State,
  reducers: {
    [action: string]: (state: State, action: any) => State
  }
}
~~~

然后根据实际需要，我们传入了一个具体的 State 类型具象化 ReduxModel，并约束了一个实际的 model，如下代码所示：

~~~typescript
type ModelInterface = { id: number; name: string };
const model: ReduxModel<ModelInterface> = {
  state: { id: 1, name: '张三' }, //  ok 类型必须是 ModelInterface
  reducers: {
    setId: (state, action: { payload: number }) => ({
      ...state,
      id: action.payload // ok must be number
    }),
    setName: (state, action: { payload: string }) => ({
      ...state,
      name: action.payload // ok must be string
    })
  }
}
~~~

在上述示例中，model 对象的 state 属性、reducers 属性的 setId、setName 方法的第一个参数 state 的类型都受到 ReduxModel 泛型入参 ModelInterface 的约束。

> **注意：枚举类型不支持泛型。**

#### 泛型约束

前面提到了泛型就像是类型的函数，它可以抽象、封装并接收（类型）入参，而泛型的入参也拥有类似函数入参的特性。因此，我们可以把泛型入参限定在一个相对更明确的集合内，以便对入参进行约束。

比如最前边提到的原封不动返回参数的 reflect 函数，我们希望把接收参数的类型限定在几种原始类型的集合中，此时就可以使用“泛型入参名 extends 类型”语法达到这个目的，如下代码所示：

~~~typescript
function reflectSpecified<P extends number | string | boolean>(param: P):P {
  return param;
}
reflectSpecified('string'); // ok
reflectSpecified(1); // ok
reflectSpecified(true); // ok
reflectSpecified(null); // ts(2345) 'null' 不能赋予类型 'number | string | boolean'
~~~

在上述示例中，我们限定了泛型入参只能是 number | string | boolean 的子集。

同样，我们也可以把接口泛型入参约束在特定的范围内，如下代码所示：

~~~typescript
interface ReduxModelSpecified<State extends { id: number; name: string }> {
  state: State
}
type ComputedReduxModel1 = ReduxModelSpecified<{ id: number; name: string; }>; // ok
type ComputedReduxModel2 = ReduxModelSpecified<{ id: number; name: string; age: number; }>; // ok
type ComputedReduxModel3 = ReduxModelSpecified<{ id: string; name: number; }>; // ts(2344)
type ComputedReduxModel4 = ReduxModelSpecified<{ id: number;}>; // ts(2344)
~~~

在上述示例中，ReduxModelSpecified 泛型仅接收 { id: number; name: string } 接口类型的子类型作为入参。

我们还可以在多个不同的泛型入参之间设置约束关系，如下代码所示：

~~~typescript
interface ObjSetter {
  <O extends {}, K extends keyof O, V extends O[K]>(obj: O, key: K, value: V): V; 
}
const setValueOfObj: ObjSetter = (obj, key, value) => (obj[key] = value);
setValueOfObj({ id: 1, name: 'name' }, 'id', 2); // ok
setValueOfObj({ id: 1, name: 'name' }, 'name', 'new name'); // ok
setValueOfObj({ id: 1, name: 'name' }, 'age', 2); // ts(2345)
setValueOfObj({ id: 1, name: 'name' }, 'id', '2'); // ts(2345)
~~~

在设置对象属性值的函数类型时，它拥有 3 个泛型入参：第 1 个是对象，第 2 个是第 1 个入参属性名集合的子集，第 3 个是指定属性类型的子类型。

另外，泛型入参与函数入参还有一个相似的地方在于，它也可以给泛型入参指定默认值（默认类型），且语法和指定函数默认参数完全一致，如下代码所示：

~~~typescript
interface ReduxModelSpecified2<State = { id: number; name: string }> {
  state: State
}
type ComputedReduxModel5 = ReduxModelSpecified2; // ok
type ComputedReduxModel6 = ReduxModelSpecified2<{ id: number; name: string; }>; // ok
type ComputedReduxModel7 = ReduxModelSpecified; // ts(2314) 缺少一个类型参数
~~~

在上述示例中，我们定义了入参有默认类型的泛型 ReduxModelSpecified2，因此使用 ReduxModelSpecified2 时类型入参可缺省。而 ReduxModelSpecified 的入参没有默认值，所以缺省入参时会提示一个类型错误。

泛型入参的约束与默认值还可以组合使用，如下代码所示：

~~~typescript
interface ReduxModelMixed<State extends {} = { id: number; name: string }> {
  state: State
}
~~~

这里我们限定了泛型 ReduxModelMixed 入参 State 必须是 {} 类型的子类型，同时也指定了入参缺省时的默认类型是接口类型 { id: number; name: string; }。
