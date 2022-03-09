---
title: git的基本使用
author: ming
date: '2021-04-28'
---

### 创建版本库

1. 随便在某个地方新建一个空白文件夹，然后右键点击`Git Bash Here`
2. 在git bash窗口输入`git init`命令将该目录变成可被git管理的仓库（此时会生成一个.git的隐藏文件夹）

### 基本使用

#### 1.使用`git add`将文件添加到缓存区,例如：

```bash
$ git add aaa.txt
```

如果想将该文件夹下所有文件都添加到缓存区，则可以使用`git add .`命令来完成。

#### 2.使用`git commit`将文件提交到仓库，可以使用`-m`来为本次提交添加注释

```bash
$ git commit -m "第一次提交"
[master (root-commit) 3f02ac0] 第一次提交
 1 file changed, 1 insertion(+)
 create mode 100644 aaa.txt
```

#### 3.使用branch来新建分支

```bash
$ git branch newImage
```

新建一个名为`newImage`的分支，但是需要注意的时创建分支之后，当前分支还是之前的分支，并没有切换到新建的`newImage`分支上，如果需要切换分支则需要使用到`checkout`命令，例如切换到刚刚创建的`newImage`分支上

```bash
$ git checkOut newImage
```

如果想要在创建分支的同时切换到新建的分支上，可以使用快捷命令`git checkout -b <your-branch-name>`来实现

```bash
$ git checkout -b <your-branch-name>
```

#### 4.分支的合并(merge,rebase)

##### merge

merge命令的合并更像是将目标分支的内容拿过来进行合并，例如有两个分支`main`h和`bugFix`，并且他们都各有自己的提交，假设当前分支为`main`，然后执行下面的内容，结果如下：

```bash
$ git merge bugFix
```

##### rebase

第二种合并分支的方法是 `git rebase`。Rebase 实际上就是取出一系列的提交记录，“复制”它们，然后在另外一个地方逐个的放下去。

Rebase 的优势就是可以创造更线性的提交历史，	这听上去有些难以理解。如果只允许使用 Rebase 的话，代码库的提交历史将会变得异常清晰


#### 5.HEAD

HEAD 是一个对当前检出记录的符号引用 —— 也就是指向你正在其基础上进行工作的提交记录。

HEAD 总是指向当前分支上最近一次提交记录。大多数修改提交树的 Git 命令都是从改变 HEAD 的指向开始的。

HEAD 通常情况下是指向分支名的（如 bugFix）。在你提交时，改变了 bugFix 的状态，这一变化通过 HEAD 变得可见

### 版本管理

#### 查看项目版本（git log）

如果嫌输出信息太多，看得眼花缭乱的，可以试试加上`--pretty=oneline`参数

```bash
$ git log
commit f2d06a84525a0f1d665201a593f0b7b0c532c79d (HEAD -> master)
Author: ming <1845728120@qq.com>
Date:   Wed Apr 14 14:53:48 2021 +0800

    第三次提交

commit 677c7cb8ab97a132838d0ba0da75af567d9579a7
Author: ming <1845728120@qq.com>
Date:   Wed Apr 14 14:51:28 2021 +0800

    第二次提交

commit 3f02ac0af6b8d79de54350cafbca69a9d8b5a5ed
Author: ming <1845728120@qq.com>
Date:   Wed Apr 14 14:49:30 2021 +0800

    第一次提交


```

#### 版本回退(git reset)

首先，Git必须知道当前版本是哪个版本，在Git中，用`HEAD`表示当前版本，，上一个版本就是`HEAD^`，上上一个版本就是`HEAD^^`，当然往上100个版本写100个`^`比较容易数不过来，所以写成`HEAD~100`。

```bash
$ git reset --hard HEAD^
HEAD is now at 677c7cb 第二次提交
```

打开文件查看，会发现文件确实回到了上一个版本；但是我们再通过`git log`命令查看时发现，最新的哪个版本`第三次提交 添加核心代码`已经看不到了？

不用担心，只要命令行窗口未关闭，我们可以顺着向上找到最新提交的版本号`f2d06a...`，然后我们再次使用回退命令`git reset --hard`即可回到未来的某个版本

```bash
$ git reset --hard f2d06a
HEAD is now at f2d06a8 第三次提交
```

> 版本号不必写全，输入版本号前几位即可，Git会自动寻找；但是也不要输入位数太少，因为有可能找到前几位相同的版本

#### 获取所有的版本回退记录(git reflog)

不是任何时候都不会关闭命令窗口，如果git bash窗口已经关闭了怎么办,这个时候就需要通过`git reflog`命令即可获取所有版本回退记录

```bash
$ git reflog
f2d06a8 (HEAD -> master) HEAD@{0}: reset: moving to f2d06a
677c7cb HEAD@{1}: reset: moving to HEAD^
f2d06a8 (HEAD -> master) HEAD@{2}: commit: 第三次提交
677c7cb HEAD@{3}: commit: 第二次提交
3f02ac0 HEAD@{4}: commit (initial): 第一次提交
```

#### 拉取项目到本地(pull)

在准备上传之前最好先更新下项目（拉取远程库中最新的版本），确保没有和远程仓库的代码有冲突

```bash
git pull --rebase origin master
```

>pull和clone区别是pull是本地已有，相当于是更新，二clone是克隆，是从无到有，相当于下载

下面添加目录下所有(".“)发生改变的文件到暂存储：

```bash
git add .
```

提交到本地库

```bash
git commit -m ""
```

最后，就可以把和本地库中的内容推送到远程库

```bash
git push -u origin master
```

#### 从远程仓库克隆(clone)

1. 找一个本地目录（或者创建）
2. 打开git bash 输入`git clone https://gitee.com/mrchai/test_project.git ` 即可完成