---
title: nrm的基本使用
author: ming
date: '2021-04-29'
---

### nrm的大致使用

1. 查看源

   ```bash
   $ nrm ls
   ```

   查看npm可选的源，其中前面带*号的表示当前使用的源

2. 切换源

   ```bash
   $ nrm use <源名称>
   ```

   例如如果需要切换到淘宝源，可以执行命令`nrm use taobao`

3. 新增源

   ```bash
   $ nrm add <registry> <url>
   ```

   其中reigstry为源名，url为源的路径

   例如`nrm add registry http://registry.npm.frp.trmap.cn/`

4. 删除源

   ```bash
   $ nrm del <registry>
   ```

5. 测试速度

   ```bash
   $ nrm test npm
   ```

   