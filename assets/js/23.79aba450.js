(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{570:function(a,t,s){"use strict";s.r(t);var e=s(17),r=Object(e.a)({},(function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[s("h3",{attrs:{id:"创建版本库"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#创建版本库"}},[a._v("#")]),a._v(" 创建版本库")]),a._v(" "),s("ol",[s("li",[a._v("随便在某个地方新建一个空白文件夹，然后右键点击"),s("code",[a._v("Git Bash Here")])]),a._v(" "),s("li",[a._v("在git bash窗口输入"),s("code",[a._v("git init")]),a._v("命令将该目录变成可被git管理的仓库（此时会生成一个.git的隐藏文件夹）")])]),a._v(" "),s("h3",{attrs:{id:"基本使用"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#基本使用"}},[a._v("#")]),a._v(" 基本使用")]),a._v(" "),s("h4",{attrs:{id:"_1-使用git-add将文件添加到缓存区-例如"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_1-使用git-add将文件添加到缓存区-例如"}},[a._v("#")]),a._v(" 1.使用"),s("code",[a._v("git add")]),a._v("将文件添加到缓存区,例如：")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("add")]),a._v(" aaa.txt\n")])])]),s("p",[a._v("如果想将该文件夹下所有文件都添加到缓存区，则可以使用"),s("code",[a._v("git add .")]),a._v("命令来完成。")]),a._v(" "),s("h4",{attrs:{id:"_2-使用git-commit将文件提交到仓库-可以使用-m来为本次提交添加注释"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_2-使用git-commit将文件提交到仓库-可以使用-m来为本次提交添加注释"}},[a._v("#")]),a._v(" 2.使用"),s("code",[a._v("git commit")]),a._v("将文件提交到仓库，可以使用"),s("code",[a._v("-m")]),a._v("来为本次提交添加注释")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" commit -m "),s("span",{pre:!0,attrs:{class:"token string"}},[a._v('"第一次提交"')]),a._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("master "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("root-commit"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" 3f02ac0"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),a._v(" 第一次提交\n "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("file")]),a._v(" changed, "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v(" insertion"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("+"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\n create mode "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("100644")]),a._v(" aaa.txt\n")])])]),s("h4",{attrs:{id:"_3-使用branch来新建分支"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_3-使用branch来新建分支"}},[a._v("#")]),a._v(" 3.使用branch来新建分支")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" branch newImage\n")])])]),s("p",[a._v("新建一个名为"),s("code",[a._v("newImage")]),a._v("的分支，但是需要注意的时创建分支之后，当前分支还是之前的分支，并没有切换到新建的"),s("code",[a._v("newImage")]),a._v("分支上，如果需要切换分支则需要使用到"),s("code",[a._v("checkout")]),a._v("命令，例如切换到刚刚创建的"),s("code",[a._v("newImage")]),a._v("分支上")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" checkOut newImage\n")])])]),s("p",[a._v("如果想要在创建分支的同时切换到新建的分支上，可以使用快捷命令"),s("code",[a._v("git checkout -b <your-branch-name>")]),a._v("来实现")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" checkout -b "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("your-branch-name"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\n")])])]),s("h4",{attrs:{id:"_4-分支的合并-merge-rebase"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_4-分支的合并-merge-rebase"}},[a._v("#")]),a._v(" 4.分支的合并(merge,rebase)")]),a._v(" "),s("h5",{attrs:{id:"merge"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#merge"}},[a._v("#")]),a._v(" merge")]),a._v(" "),s("p",[a._v("merge命令的合并更像是将目标分支的内容拿过来进行合并，例如有两个分支"),s("code",[a._v("main")]),a._v("h和"),s("code",[a._v("bugFix")]),a._v("，并且他们都各有自己的提交，假设当前分支为"),s("code",[a._v("main")]),a._v("，然后执行下面的内容，结果如下：")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" merge bugFix\n")])])]),s("h5",{attrs:{id:"rebase"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#rebase"}},[a._v("#")]),a._v(" rebase")]),a._v(" "),s("p",[a._v("第二种合并分支的方法是 "),s("code",[a._v("git rebase")]),a._v("。Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。")]),a._v(" "),s("p",[a._v("Rebase 的优势就是可以创造更线性的提交历史，\t这听上去有些难以理解。如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰")]),a._v(" "),s("h4",{attrs:{id:"_5-head"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#_5-head"}},[a._v("#")]),a._v(" 5.HEAD")]),a._v(" "),s("p",[a._v("HEAD 是一个对当前检出记录的符号引用 —— 也就是指向你正在其基础上进行工作的提交记录。")]),a._v(" "),s("p",[a._v("HEAD 总是指向当前分支上最近一次提交记录。大多数修改提交树的 Git 命令都是从改变 HEAD 的指向开始的。")]),a._v(" "),s("p",[a._v("HEAD 通常情况下是指向分支名的（如 bugFix）。在你提交时，改变了 bugFix 的状态，这一变化通过 HEAD 变得可见")]),a._v(" "),s("h3",{attrs:{id:"版本管理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#版本管理"}},[a._v("#")]),a._v(" 版本管理")]),a._v(" "),s("h4",{attrs:{id:"查看项目版本-git-log"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#查看项目版本-git-log"}},[a._v("#")]),a._v(" 查看项目版本（git log）")]),a._v(" "),s("p",[a._v("如果嫌输出信息太多，看得眼花缭乱的，可以试试加上"),s("code",[a._v("--pretty=oneline")]),a._v("参数")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" log\ncommit f2d06a84525a0f1d665201a593f0b7b0c532c79d "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("HEAD -"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" master"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("\nAuthor: ming "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1845728120")]),a._v("@qq.com"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\nDate:   Wed Apr "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(":53:48 "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("2021")]),a._v(" +0800\n\n    第三次提交\n\ncommit 677c7cb8ab97a132838d0ba0da75af567d9579a7\nAuthor: ming "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1845728120")]),a._v("@qq.com"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\nDate:   Wed Apr "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(":51:28 "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("2021")]),a._v(" +0800\n\n    第二次提交\n\ncommit 3f02ac0af6b8d79de54350cafbca69a9d8b5a5ed\nAuthor: ming "),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1845728120")]),a._v("@qq.com"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\nDate:   Wed Apr "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("14")]),a._v(":49:30 "),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("2021")]),a._v(" +0800\n\n    第一次提交\n\n\n")])])]),s("h4",{attrs:{id:"版本回退-git-reset"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#版本回退-git-reset"}},[a._v("#")]),a._v(" 版本回退(git reset)")]),a._v(" "),s("p",[a._v("首先，Git必须知道当前版本是哪个版本，在Git中，用"),s("code",[a._v("HEAD")]),a._v("表示当前版本，，上一个版本就是"),s("code",[a._v("HEAD^")]),a._v("，上上一个版本就是"),s("code",[a._v("HEAD^^")]),a._v("，当然往上100个版本写100个"),s("code",[a._v("^")]),a._v("比较容易数不过来，所以写成"),s("code",[a._v("HEAD~100")]),a._v("。")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" reset --hard HEAD^\nHEAD is now at 677c7cb 第二次提交\n")])])]),s("p",[a._v("打开文件查看，会发现文件确实回到了上一个版本；但是我们再通过"),s("code",[a._v("git log")]),a._v("命令查看时发现，最新的哪个版本"),s("code",[a._v("第三次提交 添加核心代码")]),a._v("已经看不到了？")]),a._v(" "),s("p",[a._v("不用担心，只要命令行窗口未关闭，我们可以顺着向上找到最新提交的版本号"),s("code",[a._v("f2d06a...")]),a._v("，然后我们再次使用回退命令"),s("code",[a._v("git reset --hard")]),a._v("即可回到未来的某个版本")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" reset --hard f2d06a\nHEAD is now at f2d06a8 第三次提交\n")])])]),s("blockquote",[s("p",[a._v("版本号不必写全，输入版本号前几位即可，Git会自动寻找；但是也不要输入位数太少，因为有可能找到前几位相同的版本")])]),a._v(" "),s("h4",{attrs:{id:"获取所有的版本回退记录-git-reflog"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#获取所有的版本回退记录-git-reflog"}},[a._v("#")]),a._v(" 获取所有的版本回退记录(git reflog)")]),a._v(" "),s("p",[a._v("不是任何时候都不会关闭命令窗口，如果git bash窗口已经关闭了怎么办,这个时候就需要通过"),s("code",[a._v("git reflog")]),a._v("命令即可获取所有版本回退记录")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[a._v("$ "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" reflog\nf2d06a8 "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("HEAD -"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" master"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" HEAD@"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(": reset: moving to f2d06a\n677c7cb HEAD@"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(": reset: moving to HEAD^\nf2d06a8 "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("HEAD -"),s("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v(" master"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(" HEAD@"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("2")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(": commit: 第三次提交\n677c7cb HEAD@"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("3")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(": commit: 第二次提交\n3f02ac0 HEAD@"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),s("span",{pre:!0,attrs:{class:"token number"}},[a._v("4")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v(": commit "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("initial"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v(": 第一次提交\n")])])]),s("h4",{attrs:{id:"拉取项目到本地-pull"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#拉取项目到本地-pull"}},[a._v("#")]),a._v(" 拉取项目到本地(pull)")]),a._v(" "),s("p",[a._v("在准备上传之前最好先更新下项目（拉取远程库中最新的版本），确保没有和远程仓库的代码有冲突")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" pull --rebase origin master\n")])])]),s("blockquote",[s("p",[a._v("pull和clone区别是pull是本地已有，相当于是更新，二clone是克隆，是从无到有，相当于下载")])]),a._v(" "),s("p",[a._v('下面添加目录下所有(".“)发生改变的文件到暂存储：')]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[a._v("add")]),a._v(" "),s("span",{pre:!0,attrs:{class:"token builtin class-name"}},[a._v(".")]),a._v("\n")])])]),s("p",[a._v("提交到本地库")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" commit -m "),s("span",{pre:!0,attrs:{class:"token string"}},[a._v('""')]),a._v("\n")])])]),s("p",[a._v("最后，就可以把和本地库中的内容推送到远程库")]),a._v(" "),s("div",{staticClass:"language-bash extra-class"},[s("pre",{pre:!0,attrs:{class:"language-bash"}},[s("code",[s("span",{pre:!0,attrs:{class:"token function"}},[a._v("git")]),a._v(" push -u origin master\n")])])]),s("h4",{attrs:{id:"从远程仓库克隆-clone"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#从远程仓库克隆-clone"}},[a._v("#")]),a._v(" 从远程仓库克隆(clone)")]),a._v(" "),s("ol",[s("li",[a._v("找一个本地目录（或者创建）")]),a._v(" "),s("li",[a._v("打开git bash 输入"),s("code",[a._v("git clone https://gitee.com/mrchai/test_project.git")]),a._v(" 即可完成")])])])}),[],!1,null,null,null);t.default=r.exports}}]);