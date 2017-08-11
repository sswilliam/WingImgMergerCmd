# WingImgMergerCmd

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
