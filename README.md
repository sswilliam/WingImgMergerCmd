# WingImgMergerCmd

##Overview
This is a command line tool with the same functionality as image resource merger in Egret Wing IDE. 

When using Egret Wing IDE publishing project, you can let the IDE help you merge the image resources after the publish. This is very helpful and can improve the performance of the h5 application a lot by reducing the http IO cost.

However I did't find any command line interface for such functionality. This is not convenient when you want to write a build script. I did some investigation and find the code is under /Applications/Egret Wing 3.app/Contents/Resources/app/extensions/egret-support/web

