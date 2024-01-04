## Unicode、Utf-8以及js的字符串与十六进制互转

最近给认识的人帮忙的时候遇到了一个小问题，他们的接口需要加密，其实这个加密可以说是很常见了，比如MD5加密什么的，但是他们这次用的是十六进制转码，这我还是第一次见。不过既然又需求那我照做便是，但是在实现过程中发现了一些知识点，虽然不是很常用，但是还是很有用的，这里就记录一下。

### String.prototype.charCodeAt和String.fromCharCode

首先我们理清一下思路，字符串如何转成十六进制。我们都知道十六进制是数字的表示方法，那我们首先就得将字符串转成数字。那字符串如何转成数字呢？这里就得请**`charCodeAt`**和**`fromCharCode`**隆重登场了。上次遇到这俩个方法还是大学看红宝书的时候，那个时候学习字符串的方法的时候对此稍有印象，但是平时工作中如果没有遇到这种需求基本上是用不到他们的。那我们先简单看看这两个方法是怎么用的以及用处是什么。

#### 用法及作用

首先是`charCodeAt`方法，这个方法返回一个整数，表示给定索引处的 UTF-16 码元，其值介于 `0` 和 `65535` 之间。如果要获取给定索引处的完整 Unicode 码位，则应该使用 [`String.prototype.codePointAt()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt) 方法。

```js
'测试'.charCodeAt(0) //27979
```

简单来说就是这个字符串原型上的方法需要传入一个索引，然后它会返回这个指定字符的**Unicode**编码的十进制数字，这里需要注意的是Unicode码是使用**十六进制**表示的，如果我们需要知道`测`字的Unicode码则需要进行转换一下：

```js
'测试'.charCodeAt(0).toString(16) //'6d4b'
```

所以我们就知道`测`字的Unicode编码为**0x6d4b**。相对应的我们可以使用String.fromCharCode来根据Unicode码得到这个字符：

```js
String.fromCharCode(parseInt('6d4b',16)) //测
```

到这里好像都挺不错的，编码解码都完成了，接下来就是封装方法使用了。

#### 方法封装

首先是字符串转十六进制的编码方法：

```javascript
export const strToHex = (str) => {
 let val = "";
 for (var i = 0; i < str.length; i++) {
   val += str.charCodeAt(i).toString(16);
 }
 return val;
};
```

接下来就是解码方法了：

```javascript
export const hexToStr = (hexStr) => {
   let val = "";
   for (var i = 0; i < hexStr.length; i += 2) {
     val += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
   }
   return val;
};
```

到这里就封装好了可以使用了，但是在使用的时候我发现后端发来的一长串十六进制字符串在解码后出现了乱码。一说到乱码我想都不用想肯定是中文解析失败，事实上也只有中文解码失败了，英文符号、数字、字母都是正常的。然后我就查了下文档，其实看了半天还是有点迷糊，于是为了排查问题找了两个在线十六进制和字符串转换的网站分别是[16进制转换，16进制转换文本字符串，在线16进制转换 | 在线工具 (sojson.com)](https://www.sojson.com/hexadecimal.html)和[在线16进制字符串转换工具 - 在线工具网 (hiofd.com)](https://tool.hiofd.com/hex-convert-string-online/#:~:text=在线16进制字符,码成原始字符串。)其中第一个的结果和我是一样的，第二个网站是可以正常解码出来的，这说明还是解码处理的有问题，但是我百思不得其解。因为从逻辑上来说是没有问题的，我们得到字符编码数字然后转成十六进制，那么是哪一步出了问题呢？又或者说我缺失了什么步骤？

#### 问题排查

既然返回的数据可以被正常解析就说明还是处理的有问题，所以我就开始查看API的文档，然后我发现文档中提到了Unicode和utf-16。说实话这两个我不是很熟悉于是我就开始查询相关的文档，其中js的字符串标识为utf-16的序列，单个码元只有十六位长，所以单个utf-16的范围是2的十六次方也就是**65536**，但是Unicode 字符集的编码范围是 **0x0000 - 0x10FFFF**，这个范围是远大于65536的，所以部分超过单个码元长度的字符会使用两个码元去标识。

当然上面只是比较简单的理解，不过这也足以说明问题了，因为我的解码方法是每次都取得两位16进制字符。我们如果以上面的例子为例，假设我的数据中有一个中文`测`字，那么它编码得到的十六进制字符串是四位，但是我们解码使用的是固定二位，那么结果就应该如下：

```js
hexToStr('6d4b') // 'mK'
```

虽然这里没有乱码但是结果可以说是相差甚远，但是知道原因了该如何去处理。

#### 问题解决思路

从上面知道我们可以知道是我们解码的时候获取十六进制字符串不完整导致的错误，那我们既然想知道完整的十六进制该如何处理呢，按这种思路来说我们需要将十六进制字符串进行分割，但是我们没有分割的依据所以这肯定是不行的，但是前面的测试网站是可以正确解析问题的，所以问题肯定不止在这里出现了。既然这个网站是正确的解析那我就试试转码的结果是不是也是一样，在我给传递的数据加入中文后我发现中文部分的转码结果是不一样的，这就说明不仅仅是解码的问题，转码的方法也有问题。

还记得我上面说的**charCodeAt**方法获取的是什么吗——Unicode码，那会不会是这个网站并不是使用的Unicode码呢，于是我查了查Unicode和ut-8的关系，然后我就明白了。我们可以把Unicode理解成一个字典，任何字符都存在里面，但是如何写(在计算机中等同于存储这个字符)它并没有告诉你，我们可以使用行书、草书(utf-8、utf-16、utf-32等字符编码)等自己喜欢的方式去写这个字符(使用某一种规则去存储这种字符)。

> **字符编码是 字符集的一种实现方式，把字符集中的字符映射为特定的字节或字节序列，它是一种规则**
>
> 比如：Unicode 只是字符集，UTF-8、UTF-16、UTF-32 才是真正的字符编码规则

经过测试发现使用的是utf-8来对字符编码解码的。

#### 更改方法

看到一位前辈有分享关于js的utf-8编码，因为js没有内置Unicode转utf-8编码的方法，所以我们要转utf-8只能自己造轮子，但是Web要求URL的查询字符串采用UTF-8编码，而js提供了**encodeURIComponent**与**decodeURIComponent**方法组合来对查询字符串进行编码与解码。为了验证是否可行我们可以进行验证，在可以正常转码的网站中`测`的结果是**E6B58B**，那我们看看**encodeURIComponent**的转码结果：

```js
encodeURIComponent('测') //'%E6%B5%8B'
```

去掉`%`岂不是结果一样？理论可行，那么接下来就是方法的修改了：

```js
export const strToHex = (str) => {
  const code = encodeURIComponent(str);
  let val = "";
  for (var i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === "%") {
      const hex = code.charAt(i + 1) + code.charAt(i + 2);
      val += hex;
      i += 2;
    } else val += code.charCodeAt(i).toString(16);
  }
  return val;
};
```

上面编码的方法没问题，那解码呢？直接方向操作每隔两位加上一个百分号是否可行呢？我们知道中文是没问题的，那么数字英文等等是否可以呢？

答案是可以的，因为对于单字节的符号，字节的第一位设为 **0**，后面 7 位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的, 所以 UTF-8 能兼容 ASCII 编码。另外utf-16对于 Unicode 码小于 **0x10000** 的字符， 使用 **2** 个字节存储，并且是直接存储 Unicode 码，也是不用进行编码转换的。当然了，有人会问这里也只是说了数字英文前面加%可以被正常解码，但是没说为啥固定取两位啊，假设有的字符一位十六进制数字就能表示那咋办呢。关于这个下面我会说明。

```js
export const hexToStr = (hexStr) => {
  let val = "";
  for (var i = 0; i < hexStr.length; i += 2) {
    val += "%" + hexStr.substr(i, 2);
  }
  return decodeURIComponent(val);
};
```

那我们验证一下方法是否可行：

```js
let userInfo = {
  name: "张三",
  age: 18,
};

let hexStr = strToHex(JSON.stringify(userInfo)); //'7B226e616d65223A22E5BCA0E4B889222C22616765223A31387D'
let res = hexToStr(hexStr); // '{"name":"张三","age":18}'
JSON.parse(hexToStr(hexStr)) //{name: '张三', age: 18}
```

可以看到结果是正确的。

#### 使用TextDecoder 和 TextEncoder优化

其实上面的操作我们已经将字符串转换成二进制数据了，而在js中，如果二进制数据实际上是一个字符串，我们可以使用js内置的**TextDecoder **对象将值读取为js的字符串也可以使用**TextEncoder(TextEncoder仅支持utf-8)**将js的字符串转换成二进制数据的*视图*。至于什么是二进制数据的缓冲什么是数据的视图简单理解就是js对象的堆地址以及引用地址，虽然查的有点远但是可以这么模糊理解，这里就不详细展开了。

首先我们改造一下编码方法：

```js
export const strToHex = (str) => {
  let value = "";
  const textEncoder = new TextEncoder();
  let unit8Arr = textEncoder.encode(str);
  unit8Arr.forEach((item) => {
    value += item.toString(16);
  });
  return value;
};
```

可以看到执行过**TextDecoder 的encode**方法的字符串会被转换为一个**unit8Array**，每一个类型数组的成员都是一个字节，如果字符不是中文或者说是属于ASCII码里的字符它们的返回索引就和这个数组成员是一样的，我们做个简单的测试：

```js
let test = "abc123";
new TextEncoder().encode(test); //Uint8Array(6) [97, 98, 99, 49, 50, 51, buffer: ArrayBuffer(6),......]
[...test].map((item) => item.charCodeAt(0)); // [97, 98, 99, 49, 50, 51]
```

那么如果是中文结果如何呢：

```js
let test = "abc测试123";
new TextEncoder().encode(test); //Uint8Array(12) [97, 98, 99, 230, 181, 139, 232, 175, 149, 49, 50, 51, buffer: ArrayBuffer(6),......]
[...test].map((item) => item.charCodeAt(0)); // [97, 98, 99, 27979, 35797, 49, 50, 51]

```

根据上面的测试我们可以知道*测试*二字的Unicode码的十进制分别为`27979`和`35797`，而unit8Array的范围是0-255，很明显是不符合要求的，这时候该怎么办呢？还记得上面说到utf-8的时候utf-8表示字符的时候有单字符和多字符吗，这个时候就派上用场了。好吧，看了下我没写，不过下面的文档里面是有提到这部分的内容的。utf-8将码点编码为1-4个直接，而unit8Array一个成员代表一个字节，所以一个字符转换成unit8Array可能是1-4个。由此我们可以根据字符的取值范围得到字符转utf-8的个数

> 1. **Unicode码值在U+0000至U+007F（十进制：0-127）之间的字符，转换成UTF-8后只需要1个字节。**
> 2. **Unicode码值在U+0080至U+07FF（十进制：128-2047）之间的字符，转换成UTF-8后需要2个字节。**
> 3. **Unicode码值在U+0800至U+FFFF（十进制：2048-65535）之间的字符，转换成UTF-8后需要3个字节。**
> 4. **Unicode码值在U+10000至U+10FFFF（十进制：65536-1114111）之间的字符，转换成UTF-8后需要4个字节。**

如果对这个取值范围感兴趣的可以再下面第一篇文档中根据UTF-8 的编码规则自己进行换算。

所以根据上面的取值范围我们可以知道`测试`二字都占用三个字节，这里我们以*测*字为例，这里的`27979`是Unicode码的十进制展示，一般Unicode码是十六进制展示，那么我们知道unit8Array其实是表示二进制数据的，所以这里的换算是根据二进制来进行的：

```javascript
Number(27979).toString(2); //'110 110101 001011'
// 与之对应的在unit8Array中表示‘测’的三个数字
Number(230).toString(2); //'11100110'
Number(181).toString(2); //'10110101'
Number(139).toString(2); //'10001011'
```

看起来好像对不上啊？这拼接的位数都不对，其实这里不能简单的直接拼接，要根据utf-8的编码规则来进行处理：

>1. 对于单字节的符号，字节的第一位设为 **0**，后面 7 位为这个符号的 Unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的, 所以 UTF-8 能兼容 ASCII 编码，这也是互联网普遍采用 UTF-8 的原因之一
>2. 对于 **n** 字节的符号（ **n > 1**），第一个字节的前 **n** 位都设为 **1**，第 **n + 1** 位设为 **0**，后面字节的前两位一律设为 **10** 。剩下的没有提及的二进制位，全部为这个符号的 Unicode 码

我们已经知道`测`是三字节的字符，那么第一个直接的前缀就是**1110**，第二个前缀应该是**10**，第三个前缀是是**10**。然后我们`测`的Unicode码转二进制的字符串定义为str，我们从尾部开始取值，第三个字节的剩余位就需要从str尾部开始截取六位那么第三个字符就是**10001011**，第二个字符依然是从str截取剩下的六位，那么第二个字符就是**10110101**，依次类推第一个应该拼接的是**110**，但是第一个字节的前缀是**1110**所以拼接的应该是四个字符，所以我们需要补0，所以最后第一个字节就是**11000110**，结果完全一致。

当然了，这么推是很麻烦的，也就是我上面提到的转UTF-8得造轮子，但是**TextEncoder.encode()**已经帮我们完成了，这个和**encodeURIComponent**有异曲同工之妙，不过使用**TextEncoder.encode()**会更方便一些，我们只需要进行类型转换即可。

最后就是解码的方法重写了：

```js
export const hexToStr = (hexStr) => {
  let unit8Arr = new Uint8Array(hexStr.length / 2);
  for (var i = 0; i < hexStr.length; i += 2) {
    unit8Arr[i / 2] = parseInt(hexStr.substr(i, 2), 16);
  }

  let textDecoder = new TextDecoder();
  let str = textDecoder.decode(unit8Arr);
  return str;
};
```

因为**TextDecoder.decode()**的第一个参数是`ArrayBuffer`或者`TypedArray`或者`DataView`，所以我们需要将字符串处理成其中的一种，这里我将字符串转变成了unit8Array。这里为什么要将字符串每两个截取一次呢，因为unit8Array单个字节范围为**0-255**，转成十六进制就是**[0x00-0xff)**，如果按十六进制来说在Unicode为0-16的字符只需要一位就可以表示，除开0-7的无效字符，哪还有8-16呢，其中8-16还包含一些换行符制表符等特殊符号，如果字符中包含这些特殊符号又该如何呢？

```js
// 20为空字符串， 0-7都是无效字符，这里以1号无效字符为例  '\x01'
let str = '\x01'
let hexStr = strToHex(str);//打印为空
console.log(hexToStr(hexStr));//其中的unit8Array为Uint8Array [buffer: ArrayBuffer(0),...]

// 换行符 \n 的Unicode码位为 10 即 0xa
let str2 = '123\n456'
let hexStr = strToHex(str2);//313233a343536
console.log(hexToStr(hexStr));//123�CS
```

在上面str2进行测试的时候我们可以发现解码得到的字符串对于换行符虽然解码了但是得到的是单个十六进制字符串，但是我们解码是每两位取一次，所以在后面进行解码的时候就乱码了。

所以我们针对这些特殊符号进行编码的时候应该在前面进行补0：

```javascript
export const strToHex = (str) => {
  let value = "";
  const textEncoder = new TextEncoder();
  let unit8Arr = textEncoder.encode(str);
  unit8Arr.forEach((item) => {
    let tempStr = item.toString(16);
    if (tempStr.length === 1) {
      value += tempStr.padStart(2, "0");
    } else {
      value += item.toString(16);
    }
  });
  return value;
};
```

我们测试一下上面的字符串转码结果：

```javascript
let str2 = '123\n456'
let hexStr = strToHex(str2);//3132330a343536
console.log(hexToStr(hexStr));//unit8Array为Uint8Array(7) [49, 50, 51, 10, 52, 53, 54, buffer: ArrayBuffer(7),...]
//123
//456
```

到这里就大功告成了。

最后完成的方法使用结果应该如下所示：

```js
strToHex(JSON.stringify(userInfo)); //7b226e616d65223a22e5bca0e4b889222c22616765223a31387d
hexToStr(hexStr); //'{"name":"张三","age":18}'
```



### 相关文档及网站

1. [Unicode、UTF-8、UTF-16 终于懂了 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/427488961)
2. [String - JavaScript -utf-16_字符、unicode_码位和字素簇 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#utf-16_字符、unicode_码位和字素簇)
3. [String.fromCharCode() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)
4. [String.fromCodePoint() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint)
5. [String.prototype.charCodeAt() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
6. [String.prototype.codePointAt() - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
7. [TextEncoder.encode() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/TextEncoder/encode)
8. [TextDecoder.decode() - Web API 接口参考 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/API/TextDecoder/decode)
9. [TextDecoder 和 TextEncoder (javascript.info)](https://zh.javascript.info/text-decoder)
10. [javascript UTF-8的编码与解码 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/228344073)
11. [Unicode - MDN Web 文档术语表：Web 相关术语的定义 | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Glossary/Unicode)
12. [JavaScript 类型化数组 - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Typed_arrays)