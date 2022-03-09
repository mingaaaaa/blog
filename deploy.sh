#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# 这里用的是ssh地址
git push -f git@github.com:mingaaaaa/blog.git master:gh-pages
# 这里用的是https地址
# git push -f https://github.com/mingaaaaa/blog.git master:gh-pages
# 这里gitee需要使用page需要实名认证  很麻烦   所以用github了
# git push -f git@gitee.com:zhang_yang_ming/blog.git master:gh-pages

cd -
