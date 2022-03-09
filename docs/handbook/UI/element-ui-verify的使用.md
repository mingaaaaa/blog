---
title: element-ui表单验证插件element-ui-verify
author: ming
date: '2021-06-06'
---

### 1.下载使用

```bash
$ npm i element-ui-verify -S
```

下载后在`main.js`中导入并使用

```javascript
import Vue from 'vue'
import elementUI from 'element-ui'
import elementUIVerify from 'element-ui-verify'

// 这里注意必须得先use elementUI
Vue.use(elementUI)
Vue.use(elementUIVerify)
```

### 2.基本使用

如果要校验某个表单只需在该表单组件上添加校验规则即可，如下所示是一个验证大于零的整数的规则的使用：

```vue
<template>
  <el-form label-width="100px" :model="model">
    <el-form-item label="年龄" prop="age" verify int :gt="0">
      <el-input v-model="model.age"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        model: {
          age: '',
        },
      }
    },
  }
</script>
```

#### 默认的校验规则如下：

- `length`: 校验文本长度
- `minLength`: 校验文本最短长度
- `gt`: 校验数字要大于某数
- `gte`: 校验数字要大于等于某数
- `lt`: 校验数字要小于某数
- `lte`: 校验数字要小于等于某数
- `maxDecimalLength`: 校验数字最大小数位
- `number`: 校验是否为数字
- `int`: 校验是否为整数
- `phone`: 校验是否为手机号（随着号段的增加，未来可能需要更新）
- `email`: 校验是否为电子邮件地址
- `verifyCode`: 校验是否为 6 位数字验证码

以上的校验规则都支持设置属性值

#### canBeEmpty

> 插件默认开启输入内容不为空校验，如果开启该选项，一旦该输入项为空则会忽略该输入项之后所有的校验

该选项一般用于如下情况，比如邀请码这种一般可以为空，不为空又需要校验的输入项

如下：

```vue
<!--当邀请码不为空时才校验长度是否等于6-->
<el-form-item
  prop="invitationCode"
  verify
  can-be-empty
  :length="6"
  error-message="邀请码不正确"
></el-form-item>
```

#### space

插件执行空检测时默认忽略空格，也就是说某个输入框中如果只输入了空格是过不了空检测的，除非设置该选项

```vue
<el-form-item prop="test" verify space></el-form-item>
```

### emptyMessage

空检测错误提示

```vue
<el-form-item prop="head" verify empty-message="请上传头像"></el-form-item>
```

### errorMessage

用于自定义校验不通过提示(**空检测和自定义校验方法的错误提示不受该值影响**)

```vue
<el-form-item
  prop="numberProp"
  verify
  number
  error-message="请输入正确的数字"
></el-form-item>
```

#### alias

懒人的福音，用于复用错误提示，默认值：”该输入项”。使用场景：

假设你的空检测错误提示模板为：

```
复制{empty: '{alias}不能为空'}
```

表单内容为：

```
复制<el-form-item prop="unknown" verify></el-form-item>
<el-form-item alias="姓名" prop="name" verify></el-form-item>
<el-form-item label="地址" prop="address" verify></el-form-item>
```

- 当`unknown`输入框为空时，会提示”该输入项不能为空”（alias 值默认为”该输入项”）

- 当`姓名`输入框为空时，会提示”姓名不能为空”（显式设置了 alias 值时，提示内容自然会以该值去替换模板)

- 当`地址`输入框为空时，会提示”地址不能为空”（大部分 el-form-item 都需要设置一个 label 项，而 label 项往往就代表该输入项的 alias，因此插件会取该值直接作为 alias，很贴心有木有

  #### watch

  监听其他变量，触发自身校验

  一个常见例子：密码一致性校验，pass1 的变化会触发 pass2 的校验

  ```
  复制<template>
    <el-form :model="model">
      <el-form-item label="密码" prop="pass1" verify>
        <el-input v-model="model.pass1"></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="pass2"
        :verify="verifyPassword"
        :watch="model.pass1"
      >
        <el-input v-model="model.pass2"></el-input>
      </el-form-item>
    </el-form>
  </template>
  <script>
    export default {
      data() {
        return {
          model: {
            pass1: '',
            pass2: '',
          },
        }
      },
      methods: {
        verifyPassword(rule, val, callback) {
          if (val !== this.model.pass1) callback(Error('两次输入密码不一致!'))
          else callback()
        },
      },
    }
  </script>
  ```

### 3.自定义规则

之前在看文档学的时候一直出问题，而且感觉不规范，所以还是按项目结构来说明吧

1. 在`src`目录下新建新建一个`verifyRule`的文件夹，然后再该文件夹下新建一个`index.js`文件用于编写验证规则

2. 使用`export default`导出验证规则对象，如下所示：

   ```
   export default [{
     rule: {
       name: 'onlyChinese',
     },
     ruleMethod: () => ({
       validator(rule, val, callback) {
         if (!/^[\u4e00-\u9fa5]+$/.test(val)){
            // const errorMessage = elementUIVerify.getErrorMessage("onlyChinese");
            callback(Error("该字段只能是中文"));
          } else callback();
        },
     })
   },{
       rule: {
         name: 'maxLength',
         type: Number
       },
       ruleMethod: (maxLength) => ({
         max: maxLength,
         message: '该输入项长度在' + maxLength + '个字符内'
       })
     }]
   ```

3. 在`main.js`导入验证规则对象文件，然后再使用该插件

   ```javascript
   //导入验证规则对象
   import verifyrules from "@/verifyRule";
   //将verify挂载到Vue上
   Vue.use(elementUIVerify);
   ```

4. 调用`addRule`方法将规则添加到插件上

   ```javascript
   //在verify上新增验证规则
   verifyrules.forEach((item) => {
     elementUIVerify.addRule(item.rule, item.ruleMethod);
   });
   ```

这里要注意一个点，就是在组件的中使用校验规则是，不能使用驼峰，只能使用`-`进行连接，这点和自定义属性一样。

### 4.自定义方法

自定义方法和自定义规则的区别就是自定义规则适用于全局，自定义规则是在插件上进行拓展，而自定义方法是在已有的验证规则上进行拓展，不过自定义方法的编写更简单一点。这里以官方文档为例：

1. 将验证规则改写为属性绑定的形式，然后等于一个方法名

   ```vue
   <el-form-item
         label="卡号"
         prop="cardNumber"
         :verify="verifyCardNumber"
         :length="6"
       >
   ```

2. 在当前组件下的`method`中编写同名方法

   ```javascript
   verifyCardNumber(rule, val, callback) {
           // val: 待校验值
           // callback: 校验结果回调 具体可以点击上文的"校验方法"链接查看
           if (!['010', '011'].includes(val.substr(0, 3)))
             callback(Error('错误的卡号'))
           else callback()
         },
   ```

到这里就大功告成，是不是非常简单，这里我在将完整代码展示一遍，这样相比于碎片代码更容易理解

```javascript
<template>
  <el-form :model="model">
    <el-form-item
      label="卡号"
      prop="cardNumber"
      :verify="verifyCardNumber"
      :length="6"
    >
      <el-input v-model="model.cardNumber"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        model: {
          cardNumber: '',
        },
      }
    },
    methods: {
      // callback形式
      // 校验是否是010，011开头的卡号
      verifyCardNumber(rule, val, callback) {
        // rule: 这个参数很恶心，不经常用到还要放在第一位，不过为了保持async-validator的风格，还是留着它了
        // val: 待校验值
        // callback: 校验结果回调 具体可以点击上文的"校验方法"链接查看
        if (!['010', '011'].includes(val.substr(0, 3)))
          callback(Error('错误的卡号'))
        else callback()
      },
    },
  }
</script>
```



> 注：自定义校验方法在校验规则都通过后才会执行

