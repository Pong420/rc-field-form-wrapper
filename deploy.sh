#!/usr/bin/env sh

cd src/form

git init

git add .

git commit -m 'update'

git remote add origin https://github.com/Pong420/rc-field-form.git

git push -f origin master:build

rm -rf .git