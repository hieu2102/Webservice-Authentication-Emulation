@echo off
echo Commit Message: %1

git add .
git commit -m %1
git push