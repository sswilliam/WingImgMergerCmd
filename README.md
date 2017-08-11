# WingImgMergerCmd

## 关于
在Egret Wing IDE里可以在发布项目的时候，勾选合并资源。同时资源的json文件也会一起更改。这样发布项目就很方便。但是我没找到命令行的相同功能。在论坛上也搜索了，提问了，似乎没有找到满意的答案。于是就自己扒了Egret Wing的内容。发现所有的代码都在 /Applications/Egret Wing 3.app/Contents/Resources/app/extensions/egret-support/web下

因为Egret Wing 3是基于Electron开发的，所以其实是有node+chrome。所以这个功能其实是基于浏览器的canvas来操作图片。所以我猜想这就是Wing没有提供命令行功能的原因。所以我把代码弄出来做了一些修改。使用images库来替换canvas来操作图片。这样就做到了纯命令行下运行。

由于是第一次接触node和javascript，写的有点丑，看看后面如果有需要再改吧。

## 如何使用
需要先安装nodejs

1. git clone https://github.com/sswilliam/WingImgMergerCmd.git
2. cd WingImgMergerCmd
3. node index.js [project path] [publish relative path]
需要两个参数
project path就是egret项目的路径
publish relative path就是发布相对路径，通常包含版本号的

这样就可以在命令行下，先用egret命令发布项目，再用这个工具合并资源



## Overview
This is a command line tool with the same functionality as image resource merger in Egret Wing IDE. 

When using Egret Wing IDE publishing project, you can let the IDE help you merge the image resources after the publish. This is very helpful and can improve the performance of the h5 application a lot by reducing the http IO cost.

However I did't find any command line interface for such functionality. This is not convenient when you want to write a build script. I did some investigation and find the code is under /Applications/Egret Wing 3.app/Contents/Resources/app/extensions/egret-support/web

It is based on browser and the canvas is used to manipulate images. In order to make it a pure command line tool. I used the node images library to manipulate the image and it work just the same as the Egret Wing. 

This is the first time I wrote node js project so the code looks ugly. I even don't know how to load the js from externally so I have to copy all the code into single files. wow~ ⊙o⊙ But it can at least work now. 

## How to use
You need to have node js installed on you machine before you using this tool
It is a commandline tool, you can use it with following steps
1. git clone https://github.com/sswilliam/WingImgMergerCmd.git
2. cd WingImgMergerCmd
3. node index.js [project path] [publish relative path]

Here is one example
node index.js ~/Desktop/SSMJDev/SSMJDev/h5/SSMJH5_2 bin-release/web/b1/resource/
the project path is your egret project path
the publish relative path is the path that you publish the project. Usually the version is in the path.

Then you can use egret command to publish the project first and then use this comamnd line tool to merge the resource.

Hope it is helpful :)
