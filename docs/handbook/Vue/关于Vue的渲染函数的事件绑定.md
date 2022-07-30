### 关于Vue的渲染函数绑定事件

最近在写一个页面的时候需要做成下面这个效果，因为不是很难所以并不准备找组件，准备手写一个，效果如下所示:

![](https://gitee.com/zhang_yang_ming/image/raw/master/QQ%E5%BD%95%E5%B1%8F20220313012144.gif)

因为之前都是用`template`去写，这次准备用render函数去写这个组件。

#### 关于绑定事件时自动触发的问题

在给元素添加点击事件的时候，我碰到一个问题，那就是这个绑定的方法在渲染后会直接触发，并且会报错。

<img src="https://gitee.com/zhang_yang_ming/image/raw/master/image-20220313012940252.png" alt="image-20220313012940252" style="zoom:67%;" />

方法如下：

```javascript
methods: {
    toggleRule(couponsItem, index) {
      console.log(index);
      const rulNum = couponsItem.ruleDetail.length;
      if (this.ruleListActiveArr[index]) {
        // 如果点击的是已打开的list
        // 只关闭当前的list
        this.ruleListHeight = "26px";
        this.ruleListActiveArr[index] = false;
      } else {
        // 如果点击的是未打开的list
        // 先移除所有状态
        this.ruleListActiveArr = this.ruleListActiveArr.map(() => false);
        // 给点击的添加状态
        this.ruleListHeight = 26 * rulNum + "px";
        this.ruleListActiveArr[index] = true;
      }
    },
  },
```

渲染函数如下:

```javascript
  createElement("div", {
    class: {
      iconfont: true,
      "icon-tishi1": true,
    },
    on: {
      click: this.toggleRule(couponsItem, index),
    },
  })
```

先不说这个执行，就是这个报错我就不理解，然后我查了一下，第一个报错好像是方法没写在methods里面。第二个是使用了该方法名但是没有定义该方法，所以我很不理解这是为什么，后来想了一下有了下面的一些理解。

#### 出现问题的可能

* 首先可以看到控制台的打印顺序，是先打印索引才报的错，这说明是`toggleRule`这个方法先被调用，然后才在使用这个方法时报错，使用这个方法就是在render函数内。其实这一点我们从Vue的生命周期应该就能明白，Vue是先实例化数据然后才挂载的DOM，数据的初始化在created阶段，而 DOM挂载在mounted阶段，不过为什么关于为什么这个事件的绑定方法为什么会自动触发还需要继续深入探讨。

#### 解决方案

很简单，绑定方法的时候不要直接绑定要使用的方法，而是用箭头函数包裹一下

```javascript
createElement("div", {
    class: {
      iconfont: true,
      "icon-tishi1": true,
    },
    on: {
      click: () => {
        this.toggleRule(couponsItem, index);
      },
    },
  })
```

这里报错的问题也一并消失了。

#### list组件

这里顺便记录一下这个List组件

js部分：

```javascript
export default {
  name: "couponItem",
  props: {
    couponsArr: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ruleListHeight: "26px",
      ruleListActiveArr: [false, false, false],
    };
  },
  methods: {
    toggleRule(couponsItem, index) {
      const rulNum = couponsItem.ruleDetail.length;
      if (this.ruleListActiveArr[index]) {
        // 如果点击的是已打开的list
        // 只关闭当前的list
        this.ruleListHeight = "26px";
        this.ruleListActiveArr[index] = false;
      } else {
        // 如果点击的是未打开的list
        // 先移除所有状态
        this.ruleListActiveArr = this.ruleListActiveArr.map(() => false);
        // 给点击的添加状态
        this.ruleListHeight = 26 * rulNum + "px";
        this.ruleListActiveArr[index] = true;
      }
    },
  },
  render(createElement) {
    return createElement(
      "div",
      {
        class: {
          couponsList: true,
        },
      },
      this.couponsArr.map((couponsItem, index) => {
        return createElement(
          "div",
          {
            class: {
              "coupons-item": true,
            },
          },
          [
            createElement(
              "div",
              {
                class: {
                  item: true,
                },
              },
              [
                createElement(
                  "div",
                  {
                    class: {
                      amount: true,
                    },
                  },
                  [
                    createElement("span", parseInt(couponsItem.amount) || ""),
                    createElement(
                      "span",
                      couponsItem.amount.split(
                        parseInt(couponsItem.amount)
                      )[1] || ""
                    ),
                  ]
                ),
                createElement(
                  "div",
                  {
                    class: {
                      "coupons-detail": true,
                    },
                  },
                  [
                    createElement(
                      "div",
                      {
                        class: {
                          "coupons-info": true,
                        },
                      },
                      [
                        createElement(
                          "div",
                          {
                            class: {
                              "text-info": true,
                            },
                          },
                          [
                            createElement(
                              "div",
                              {
                                class: {
                                  name: true,
                                },
                              },
                              couponsItem.name
                            ),
                            createElement(
                              "div",
                              {
                                class: {
                                  rule: true,
                                },
                              },
                              couponsItem.date
                            ),
                          ]
                        ),
                        createElement(
                          "div",
                          {
                            class: {
                              "qr-info": true,
                            },
                          },
                          [
                            createElement("span", {
                              class: {
                                iconfont: true,
                                "icon-erweima": true,
                              },
                            }),
                          ]
                        ),
                      ]
                    ),
                    createElement(
                      "div",
                      {
                        class: {
                          date: true,
                        },
                      },
                      ["有效期:", createElement("span", couponsItem.date)]
                    ),
                  ]
                ),
              ]
            ),
            createElement(
              "div",
              {
                class: {
                  "rule-detail": true,
                },
              },
              [
                createElement(
                  "div",
                  {
                    class: {
                      "rule-box": true,
                    },
                  },
                  [
                    createElement("div", {
                      class: {
                        iconfont: true,
                        "icon-tishi1": true,
                      },
                      on: {
                        click: () => {
                          this.toggleRule(couponsItem, index);
                        },
                      },
                    }),
                    createElement(
                      "div",
                      {
                        class: {
                          left: true,
                        },
                      },
                      "使用条件:"
                    ),
                    createElement(
                      "div",
                      {
                        class: {
                          "rule-list": true,
                          // ["rule-list-" + index + 1]: true,
                          active: this.ruleListActiveArr[index],
                        },
                        style: {
                          "--ruleListHeight": this.ruleListHeight,
                        },
                      },
                      couponsItem.ruleDetail.map((item) => {
                        return createElement(
                          "div",
                          {
                            class: {
                              "rule-item": true,
                            },
                          },
                          item
                        );
                      })
                    ),
                  ]
                ),
              ]
            ),
          ]
        );
      })
    );
  },
};
```

css部分：

```css
.item {
  color: #fff;
  height: 100px;
  border-radius: var(--borderRa);
  display: flex;
  background-image: linear-gradient(90deg, #0091fe, #a2faae);
  padding: 10px 0;
  box-sizing: border-box;
}

.amount {
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* writing-mode: vertical-lr; */
}

.amount span {
  font-size: 22px;
}

.coupons-detail {
  display: flex;
  flex: 1;
  padding-right: var(--shortDistance);
  flex-direction: column;
  justify-content: space-between;
}

.coupons-info {
  display: flex;
  justify-content: space-between;
}

.qr-info > .iconfont {
  font-size: 30px;
  color: #000;
}

.rule {
  font-size: 15px;
  width: 240px;
}

.date,
.date > span {
  font-size: 13px;
}

.rule-detail {
  display: flex;
  justify-content: flex-end;
}

.rule-box {
  width: calc(100% - 50px);
  height: 100%;
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.rule-box > .iconfont {
  position: absolute;
  right: 0;
  /* top: 50%;
    transform: translateY(-50%); */
  top: 5px;
}

.left,
.rule-item {
  font-size: 14px;
  height: 26px;
  line-height: 26px;
}

.rule-list {
  overflow-y: hidden;
  height: 26px;
  transition: all 0.3s;
}
.active {
  height: var(--ruleListHeight);
}

.rule-list > span {
  font-size: 14px;
}
```

后续如果有时间再专门弄一个个人封装的组件库的目录吧