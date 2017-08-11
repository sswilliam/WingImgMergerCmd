var node_images = require("images");


var path = require('path');
var fs = require('fs');
// alert(fs.existsSync('image.jpg'));

function output(msg){
    console.log("[output]"+msg);
}
function ShowTheObject(obj){  
  var des = "";  
    for(var name in obj){  
    des += name 
    // + ":" + obj[name] 
    + ";";  
    }  
    console.log (des);
}  


function alertMsg(msg) {
    alert(msg);
}

function SSDBG(msg) {
    console.log("[SSDBG]"+msg);
}


function mkdirByUrl(url) {
    try {
        var dirs = [];
        while (true) {
            url = path.dirname(url);
            if (!fs.existsSync(url)) {
                dirs.push(url);
            }
            else {
                break;
            }
        }
        var i = dirs.length - 1;
        for (; i >= 0; i--) {
            fs.mkdirSync(dirs[i]);
        }
    }
    catch (e) {
    }
}
function saveBase64(url, str) {
    mkdirByUrl(url);
    var buffer = new Buffer(str, 'base64');
    var fileUrl = path.normalize(url);
    // output('saveBase64:'+fileUrl);
    fs.writeFileSync(fileUrl, buffer);
}
function readImageToDataUrl(url, callBack) {
    var fileType = url.substring(url.lastIndexOf('.') + 1);
    var fileUrl = path.normalize(url);
    fs.readFile(fileUrl, function (err, data) {
        // output('readImageToDataUrl:'+fileUrl);
        if (err) {
            callBack(null);
        }
        else {
            callBack(("data:image/" + fileType + ";base64,") + data.toString('base64'));
        }
    });
}
function readImageAsyn(url) {
    try {
        var fileType = url.substring(url.lastIndexOf('.') + 1);
        var fileUrl = path.normalize(url);
        // output('readImageAsyn:'+fileUrl);
        return fs.readFileSync(fileUrl).toString('base64');
    }
    catch (e) {
        output(e.message);
    }
}
function readText(url) {
    try {
        url = path.normalize(url);
        var configstr = fs.readFileSync(url).toString();
        // output('readText:'+configstr);
        return configstr;
    }
    catch (e) {
        output(e.message);
    }
}
function writeText(url, data) {
    mkdirByUrl(url);
    try {
        fs.writeFileSync(path.normalize(url), data, { encoding: 'utf8' });
    }
    catch (e) {
        output('写入Text文件失败:' + url);
    }
}
function readJson(url) {
    url = path.normalize(url);
    var obj;
    try {
        var configstr = fs.readFileSync(url).toString();
        obj = JSON.parse(configstr);
    }
    catch (error) {
        output('读取json文件失败:' + url);
    }
    return obj;
}
function writeJson(url, data) {
    mkdirByUrl(url);
    try {
        if (data instanceof String) {
            fs.writeFileSync(path.normalize(url), data);
        }
        else {
            fs.writeFileSync(path.normalize(url), JSON.stringify(data, null, 0));
        }
    }
    catch (e) {
        output('写入Json文件失败:' + url);
    }
}
function copyFile(fromUrl, toUrl) {
    try {
        mkdirByUrl(toUrl);
        fromUrl = path.normalize(fromUrl);
        toUrl = path.normalize(toUrl);
        fs.writeFileSync(toUrl, fs.readFileSync(fromUrl));
    }
    catch (e) {
        output('copyFile error:' + fromUrl + ' ===> ' + toUrl);
    }
}
function exitFile(url) {
    return fs.existsSync(path.normalize(url));
}
function getBindFile(url) {
    url = escapePath(url);
    var dir = url.substring(0, url.lastIndexOf('/'));
    var fileName = getFileNameByUrl(url);
    var fileType = getFileTypeByUrl(url);
    var files = [];
    lsFileNo(dir, files);
    var i = 0;
    var len = files.length;
    for (; i < len; i++) {
        var tempType = getFileTypeByUrl(files[i]);
        var tempName = getFileNameByUrl(files[i]);
        // if(url.indexOf('bigcard')>=0)
        // {
        //  output(tempType+":"+fileType+":"+tempName+":"+fileName)
        // }
        if (fileType !== tempType && tempName === fileName) {
            // output('getBindFile:'+files[i])
            return files[i];
        }
    }
    return '';
}
function getFileNameByUrl(url) {
    var startIndex = url.lastIndexOf('/') + 1;
    var endIndex = url.lastIndexOf('.');
    return url.substring(startIndex, endIndex);
}
function getFileTypeByUrl(url) {
    var endIndex = url.lastIndexOf('.') + 1;
    return url.substring(endIndex);
}
function escapePath(str) {
    str = str.split('\\').join('/');
    var index = str.indexOf(':/');
    if (index >= 0) {
        str = str.substring(0, index).toUpperCase() + str.substring(index);
    }
    return str;
}
function foreachFiles(url) {
    url = path.normalize(url);
    var results = [];
    lsFile(url, results);
    return results;
}
function lsFile(ff, reuslts) {
    var files = fs.readdirSync(ff);
    var i = 0;
    var len = files.length;
    for (; i < len; i++) {
        var fname = escapePath(ff + path.sep + files[i]);
        var stat = fs.lstatSync(fname);
        if (stat.isDirectory() === true) {
            lsFile(fname, reuslts);
        }
        else {
            reuslts.push(fname);
        }
    }
}
function lsFileNo(ff, reuslts) {
    var files = fs.readdirSync(ff);
    var i = 0;
    var len = files.length;
    for (; i < len; i++) {
        var fname = escapePath(ff + path.sep + files[i]);
        var stat = fs.lstatSync(fname);
        if (!stat.isDirectory()) {
            reuslts.push(fname);
        }
    }
}
function deleteFile(url) {
    try {
        fs.unlinkSync(path.normalize(url));
    }
    catch (e) {
        output(e.message)
        output('deleteFile error:' + url);
    }
}
function pathJoin(url1, url2) {
    return escapePath(path.join(url1, url2));
}









var CRC32Util = (function () {
    function CRC32Util() {
    }
    /**
     * 获取CRC缓存数据表
     */
    CRC32Util.makeCrcTable = function () {
        var crcTable = new Array(256);
        for (var n = 0; n < 256; n++) {
            var c = n;
            for (var k = 8; --k >= 0;) {
                if ((c & 1) !== 0) {
                    c = 0xedb88320 ^ (c >>> 1);
                }
                else {
                    c = c >>> 1;
                }
            }
            crcTable[n] = c;
        }
        return crcTable;
    };
    /**
     * 从字节流计算CRC32数据
     * @param buf 要计算的字节流
     */
    CRC32Util.getCRC32 = function (buf) {
        var crc = 0;
        var off = 0;
        var len = buf.length;
        var c = (~crc) & 0xffffffff;
        while (--len >= 0) {
            c = CRC32Util.crcTable[(c ^ buf.charCodeAt(off)) & 0xff] ^ (c >>> 8);
            off++;
        }
        crc = ~c;
        return Math.abs(crc);
    };
    /**
     * 计算时用到的CRC缓存数据表
     */
    CRC32Util.crcTable = CRC32Util.makeCrcTable();
    return CRC32Util;
}());



var FileUtil = (function () {
    function FileUtil() {
    }
    /**
         * 获取路径的文件名(不含扩展名)或文件夹名
         */
    FileUtil.escapePath = function (str) {
        return str.split('\\').join('/');
    };
    FileUtil.getFileName = function (path) {
        if (path === null || path === '') {
            return '';
        }
        path = FileUtil.escapePath(path);
        var startIndex = path.lastIndexOf('/');
        var endIndex;
        if (startIndex > 0 && startIndex === path.length - 1) {
            path = path.substring(0, path.length - 1);
            startIndex = path.lastIndexOf('/');
            endIndex = path.length;
            return path.substring(startIndex + 1, endIndex);
        }
        endIndex = path.lastIndexOf('.');
        if (endIndex <= startIndex) {
            endIndex = path.length;
        }
        return path.substring(startIndex + 1, endIndex);
    };
    FileUtil.getDirectory = function (path) {
        var path = FileUtil.escapePath(path);
        return path.substring(0, path.lastIndexOf('/') + 1);
    };
    /**
     * 获得路径的扩展名
     */
    FileUtil.getExtension = function (path) {
        path = FileUtil.escapePath(path);
        var index = path.lastIndexOf('.');
        if (index === -1) {
            return '';
        }
        var i = path.lastIndexOf('/');
        if (i > index) {
            return '';
        }
        return path.substring(index + 1);
    };
    
    return FileUtil;
}());





// var packUtil;
// (function (packUtil) {
//     var canvas = document.createElement('canvas');
//     var canvas2drender = canvas.getContext('2d');
//     function clipImageByRes(resvo, image, cb) {
//         canvas.width = image.width;
//         canvas.height = image.height;
//         canvas2drender.clearRect(0, 0, image.width, image.height);
//         canvas2drender.drawImage(image, 0, 0);
//         var inputData = canvas2drender.getImageData(0, 0, image.width, image.height);
//         var result = clipImageByData(inputData);
//         canvas.width = result.clipw;
//         canvas.height = result.cliph;
//         canvas2drender.clearRect(0, 0, result.clipw, result.cliph);
//         canvas2drender.putImageData(result.image, 0, 0);
//         var newimg = document.createElement('img');
//         resvo.bitmapData = newimg;
//         resvo.sourceRect = new resModel.Rectangle(result.clipx, result.clipy, image.width, image.height);
//         newimg.onload = function () {
//             cb();
//             // var testcanvas:HTMLCanvasElement = document.getElementById('test') as HTMLCanvasElement;
//             // testcanvas.width = newimg.width;
//             // testcanvas.height = newimg.height;
//             // var testcanvas2drender = testcanvas.getContext('2d');
//             // testcanvas2drender.drawImage(newimg,0,0);
//         };
//         var str = canvasImportPngBase64(canvas, result.clipw, result.cliph);
//         newimg.src = str;
//     }
//     packUtil.clipImageByRes = clipImageByRes;
//     function clipImageByData(input) {
//         var w = input.width;
//         var h = input.height;
//         var minLeft = w;
//         var maxRight = 0;
//         var minTop = h;
//         var maxBottom = 0;
//         var data = input.data;
//         for (var yIndex = 0; yIndex < h; yIndex++) {
//             for (var xIndex = 0; xIndex < minLeft; xIndex++) {
//                 if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
//                     minLeft = xIndex;
//                     break;
//                 }
//             }
//             for (xIndex = w - 1; xIndex >= maxRight; xIndex--) {
//                 if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
//                     maxRight = xIndex;
//                     break;
//                 }
//             }
//         }
//         for (xIndex = 0; xIndex < w; xIndex++) {
//             for (yIndex = 0; yIndex < minTop; yIndex++) {
//                 if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
//                     minTop = yIndex;
//                     break;
//                 }
//             }
//             for (yIndex = h - 1; yIndex >= maxBottom; yIndex--) {
//                 if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
//                     maxBottom = yIndex;
//                     break;
//                 }
//             }
//         }
//         var clipx = Math.min(minLeft, maxRight);
//         var clipy = Math.min(minTop, maxBottom);
//         var clipw = Math.abs(maxRight - minLeft) + 1;
//         var cliph = Math.abs(maxBottom - minTop) + 1;
//         var resultImage = canvas2drender.createImageData(clipw, cliph);
//         for (yIndex = 0; yIndex < cliph; yIndex++) {
//             for (xIndex = 0; xIndex < clipw; xIndex++) {
//                 var toIndex = getImageIndex(xIndex, yIndex, clipw);
//                 var fromIndex = getImageIndex(xIndex + clipx, yIndex + clipy, w);
//                 resultImage.data[toIndex] = data[fromIndex];
//                 resultImage.data[toIndex + 1] = data[fromIndex + 1];
//                 resultImage.data[toIndex + 2] = data[fromIndex + 2];
//                 resultImage.data[toIndex + 3] = data[fromIndex + 3];
//             }
//         }
//         return { image: resultImage, clipx: clipx, clipy: clipy, clipw: clipw, cliph: cliph };
//     }
//     packUtil.clipImageByData = clipImageByData;
//     function getImageIndex(xIndex, yIndex, w) {
//         return (xIndex + yIndex * w) * 4;
//     }
//     packUtil.getImageIndex = getImageIndex;
//     function getImageAlpha(data, xIndex, yIndex, w) {
//         return data[(xIndex + yIndex * w) * 4 + 3];
//     }
//     packUtil.getImageAlpha = getImageAlpha;
//     function canvasImportPng(canvas, width, height) {
//         var w = canvas.width, h = canvas.height;
//         if (!width) {
//             width = w;
//         }
//         if (!height) {
//             height = h;
//         }
//         var retCanvas = document.createElement('canvas');
//         var retCtx = retCanvas.getContext('2d');
//         retCanvas.width = width;
//         retCanvas.height = height;
//         retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
//         var str = retCanvas.toDataURL('image/png');
//         ;
//         str = str.replace('data:image/png;base64,', '');
//         // str = str.replace( ' ' , '+');
//         return str;
//     }
//     packUtil.canvasImportPng = canvasImportPng;
//     function canvasImportPngBase64(canvas, width, height) {
//         var w = canvas.width, h = canvas.height;
//         if (!width) {
//             width = w;
//         }
//         if (!height) {
//             height = h;
//         }
//         var retCanvas = document.createElement('canvas');
//         var retCtx = retCanvas.getContext('2d');
//         retCanvas.width = width;
//         retCanvas.height = height;
//         retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
//         var str = retCanvas.toDataURL('image/png');
//         ;
//         return str;
//     }
//     packUtil.canvasImportPngBase64 = canvasImportPngBase64;
// })(packUtil || (packUtil = {}));



var resModel;
(function (resModel) {
    /**
     * 配置数据模型
     * @author featherJ
     *
     */
    var ResModel = (function () {
        function ResModel(workspace, targerDir) {
            this.resInfoLib = {};
            /**
             * imageName映射到groupName
            */
            this.imageToGroupName = {};
            /**
             * 打包资源
             */
            // public  publish(onComplete:()=>void,onError:()=>void):void
            // {
            //      logMsg('createPackConfig...');
            //     var packConfig:IpackConfig = this.createPackConfig();
            //  //通过打包配置得到需要被打包的图像资源，此函数会创建好key值和compress值
            //     logMsg('createPackIamgeWithKeyAndCompress...');
            //  var packImages:ImageRes[] = this.createPackIamgeWithKeyAndCompress(packConfig);
            //  //修复图像列表内的url属性和scale9Grid属性
            //     // logMsg('fixImagesUrlAndScale9Grid...');
            //  //补全images对应的图像
            //     logMsg('loadImages...');
            //  this.loadImages(packConfig.sourcePath,packImages,(success:boolean)=>{
            //         if(!success)
            //      {
            //          if(onError !== null)
            //          {
            //              onError();
            //          }
            //          return;
            //      }
            //         //根据是否压缩九宫格，重新修改bitmapData数据以及scale9Grid数据
            //         // fixCompress(packImages);
            //         //创建合图组列表
            //          logMsg('createPackGroups...');
            //         var packGroups:PackGroup[] = this.resultPackGroup = this.createPackGroups(packImages,packConfig);
            //         //分析合图组 如九宫格压缩等信息
            //          logMsg('analysePacks...');
            //         success = this.analysePacks(packGroups);
            //         if(!success)
            //         {
            //             if(onError)
            //          {
            //                 onError();
            //          }
            //             return;
            //         }
            //         else
            //         {
            //            this. finalPublish(
            //              packConfig.sourcePath,
            //              pathJoin(this._workspace, this.targerDir),
            //              packConfig.publishCopyAll,
            //              packConfig.cleanPublishPath,
            //              packConfig.addCrc,
            //              this._resourcePath,
            //              readJson(this._resourcePath),
            //              packGroups
            //          );
            //          writeJson(this._packPath, packConfig);
            //          if(onComplete)
            //          {
            //              onComplete();
            //          }
            //         }
            //     });
            // }
            /**
             * 根据是否压缩九宫格，重新修改bitmapData数据以及scale9Grid数据
             * @param images
             */
            // private  fixCompress(images:ImageRes[]):void
            // {
            //  images.forEach((image:ImageRes)=>{
            //      if(image.scale9Grid && image.compress)
            //      {
            //          var scale9GridBitmap:Scale9GridBitmap = new Scale9GridBitmap();
            //          var oldBitmapData:BitmapData = image.bitmapData;
            //          scale9GridBitmap.bitmapData = image.bitmapData;
            //          var scale9Grid:Rectangle = new Rectangle();
            //          scale9Grid.left = image.scale9Grid.x;
            //          scale9Grid.top = image.scale9Grid.y;
            //          scale9Grid.right = image.bitmapData.width-image.scale9Grid.x-image.scale9Grid.width;
            //          scale9Grid.bottom = image.bitmapData.height-image.scale9Grid.y-image.scale9Grid.height;
            //          scale9GridBitmap.scale9Grid = scale9Grid;
            //          scale9GridBitmap.updateView();
            //          var compressW:int = image.bitmapData.width-image.scale9Grid.width+2;
            //          var compressH:int = image.bitmapData.height-image.scale9Grid.height+2;
            //          scale9GridBitmap.width = compressW;
            //          scale9GridBitmap.height = compressH;
            //          var newBitmapData:BitmapData = new BitmapData(compressW,compressH,true,0);
            //          newBitmapData.draw(scale9GridBitmap);
            //          var newScale9Grid:Rectangle = new Rectangle(image.scale9Grid.x,image.scale9Grid.y,2,2);
            //          image.bitmapData = newBitmapData;
            //          image.scale9Grid = newScale9Grid;
            //          image.sourceRect.width = image.sourceRect.width-(oldBitmapData.width-compressW);
            //          image.sourceRect.height = image.sourceRect.height-(oldBitmapData.height-compressH);
            //      }
            //  });
            // }
            this.fileNameCache = [];
            this.useClip = true;
            this._workspace = escapePath(workspace);
            this.targerDir = escapePath(targerDir);
        }
        ResModel.prototype.hasGroupByName = function (name) {
            var i = 0;
            var len = this.packGroups.length;
            for (; i < len; i++) {
                var group = this.packGroups[i];
                if (group.name === name) {
                    return true;
                }
            }
            return false;
        };
        ResModel.prototype.getGroupByName = function (name) {
            var i = 0;
            var len = this.packGroups.length;
            for (; i < len; i++) {
                var group = this.packGroups[i];
                if (group.name === name) {
                    return group;
                }
            }
            return null;
        };
        ResModel.prototype.addGroupByName = function (name) {
            var newGroup = { 'gap': 4, 'name': name, 'sort': 0, 'res': [] };
            this.packGroups.push(newGroup);
        };
        ResModel.prototype.removeGroupByName = function (name) {
            var _this = this;
            var i = 0;
            var len = this.packGroups.length;
            for (; i < len; i++) {
                var group = this.packGroups[i];
                if (group.name === name) {
                    this.packGroups.splice(i, 1);
                    group.res.forEach(function (res) {
                        _this.unPackGroup.push(res);
                    });
                    break;
                }
            }
        };
        ResModel.prototype.moveImagetoGroup = function (imageName, groupName) {
            var imageInfo = this.getImageByKey(imageName);
            this.deleteImageFromGroup(imageName);
            this.addImageToGroup(imageInfo, groupName);
        };
        ResModel.prototype.deleteImageFromGroup = function (imageName) {
            var fromGroup = this.getImageInGroup(imageName);
            var targetRes;
            if (fromGroup) {
                var group = this.getGroupByName(fromGroup);
                targetRes = group.res;
            }
            else {
                targetRes = this.unPackGroup;
            }
            var i = 0;
            var len = targetRes.length;
            for (; i < len; i++) {
                if (targetRes[i].key === imageName) {
                    targetRes.splice(i, 1);
                    break;
                }
            }
        };
        ResModel.prototype.addImageToGroup = function (imageInfo, groupName) {
            var targetRes;
            if (groupName) {
                var group = this.getGroupByName(groupName);
                targetRes = group.res;
            }
            else {
                targetRes = this.unPackGroup;
            }
            targetRes.push(imageInfo);
            this.imageToGroupName[imageInfo.key].groupName = groupName;
        };
        Object.defineProperty(ResModel.prototype, "resourcePath", {
            /**
             * 资源配置文件路径
             */
            get: function () {
                return this._resourcePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResModel.prototype, "resList", {
            /**
             * 资源列表
             */
            get: function () {
                return this._resList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResModel.prototype, "groupList", {
            /**
             * 组列表
             */
            get: function () {
                return this._groupList;
            },
            enumerable: true,
            configurable: true
        });
        ResModel.prototype.decodeResourceConfig = function (resourcePath) {
            this._resourcePath = resourcePath = escapePath(resourcePath);
            var obj;
            try {
                obj = readJson(this._resourcePath);
            }
            catch (error) {
                logMsg('资源配置读取失败:' + error);
            }
            try {
                if (obj) {
                    obj = this.jsonToRes(obj);
                }
            }
            catch (e) {
                logMsg('资源配置格式错误:' + e);
            }
            if (obj) {
                this._resList = obj['resList'];
                this._groupList = obj['groupList'];
                logMsg('资源配置读取成功！');
            }
            else {
                this._resList = [];
                this._groupList = [];
            }
            this.packResList = [];
            this.imageResLib = {};
            var len = this._resList.length;
            var i = 0;
            for (i = 0; i < len; i++) {
                if (this.resList[i].type === resModel.ResType.TYPE_IMAGE) {
                    this.packResList.push(this.resList[i]);
                    this.imageResLib[this.resList[i].getName()] = this.resList[i];
                }
            }
        };
        ResModel.prototype.getImageRes = function (name) {
            return this.imageResLib[name];
        };
        ResModel.prototype.jsonToRes = function (jsonObj) {
            this.resInfoLib = {};
            var obj;
            var resArr = jsonObj.resources;
            var groupArr = jsonObj.groups;
            var resList = [];
            var groupList = [];
            var j;
            for (var i = 0; i < resArr.length; i++) {
                var resInfoVO = new resModel.ResInfoVO();
                resInfoVO.groupName = 'autoGroup';
                resInfoVO.setName(resArr[i].name);
                resInfoVO.showUrl = resArr[i].url;
                resInfoVO.type = resArr[i].type;
                if (resArr[i].scale9grid && resArr[i].type === 'image') {
                    var scale9grid = String(resArr[i].scale9grid).split(',');
                    resInfoVO.x = parseInt(scale9grid[0]);
                    resInfoVO.y = parseInt(scale9grid[1]);
                    resInfoVO.w = parseInt(scale9grid[2]);
                    resInfoVO.h = parseInt(scale9grid[3]);
                    resInfoVO.hasScale9Grid = true;
                    resInfoVO.other = '[' + resArr[i].scale9grid + ']';
                }
                if (resArr[i].soundType && resArr[i].type === 'sound') {
                    resInfoVO.other = resArr[i].soundType;
                }
                if (resArr[i].subkeys && resArr[i].type === 'sheet') {
                    var subkeys = resArr[i].subkeys;
                    var subkeyArr = subkeys.split(',');
                    var subList = [];
                    for (j = 0; j < subkeyArr.length; j++) {
                        var subVO = new resModel.SheetSubVO();
                        subVO.setIsSameName(false);
                        subVO.setName(subkeyArr[j]);
                        subList.push(subVO);
                    }
                    resInfoVO.subList = subList;
                }
                resList.push(resInfoVO);
                this.resInfoLib[resInfoVO.getName()] = resInfoVO;
            }
            for (i = 0; i < groupArr.length; i++) {
                var groupInfoVO = new resModel.GroupInfoVO();
                groupInfoVO.groupName = groupArr[i].name;
                var keyList = groupArr[i].keys;
                var keyArr = keyList.split(',');
                for (j = 0; j < keyArr.length; j++) {
                    var key = keyArr[j];
                    for (var k = 0; k < resList.length; k++) {
                        if (resList[k].getName() === key) {
                            resList[k].groupName = groupInfoVO.groupName;
                            groupInfoVO.addResInfoVO(resList[k]);
                            break;
                        }
                    }
                }
                groupList.push(groupInfoVO);
            }
            obj = { resList: resList, groupList: groupList };
            return obj;
        };
        ResModel.prototype.resetImageToGroupName = function () {
            var _this = this;
            this.imageToGroupName = {};
            var i = 0;
            var len = this.unPackGroup.length;
            var imageInfo;
            for (i = 0; i < len; i++) {
                imageInfo = this.unPackGroup[i];
                this.imageToGroupName[imageInfo.key] = { groupName: '', image: imageInfo };
            }
            len = this.packGroups.length;
            for (i = 0; i < len; i++) {
                var packgroup = this.packGroups[i];
                packgroup.res.forEach(function (imageInfo) {
                    _this.imageToGroupName[imageInfo.key] = { groupName: packgroup.name, image: imageInfo };
                });
            }
        };
        ResModel.prototype.getImageByKey = function (key) {
            return this.imageToGroupName[key].image;
        };
        ResModel.prototype.getImageInGroup = function (imageKey) {
            return this.imageToGroupName[imageKey].groupName;
        };
        ResModel.prototype.decodePackConfig = function () {
            // this._packPath = escapePath( path);
            var config;
            // try
            // {
            //     config =readJson(this._packPath);
            // }
            // catch(error)
            // {
            // }
            config = config || {};
            //未分组
            if (!config.hasOwnProperty('unPackGroup')) {
                config['unPackGroup'] = [];
            }
            //已分组
            if (!config.hasOwnProperty('packGroups')) {
                config['packGroups'] = [];
            }
            //源目录
            if (!config.hasOwnProperty('sourcePath')) {
                config['sourcePath'] = this._workspace + '/resource/';
            }
            //发布目录
            if (!config.hasOwnProperty('publishPath')) {
                config['publishPath'] = this._workspace + '/resource_Publish/';
            }
            //拷贝未引用文件
            if (!config.hasOwnProperty('publishCopyAll')) {
                config['publishCopyAll'] = false;
            }
            //发布时清空发布目录
            if (!config.hasOwnProperty('cleanPublishPath')) {
                config['cleanPublishPath'] = false;
            }
            //添加crc校验码
            if (!config.hasOwnProperty('addCrc')) {
                config['addCrc'] = true;
            }
            this.packGroups = config['packGroups'];
            this.unPackGroup = config['unPackGroup'];
            this.sourcePath = escapePath(config['sourcePath']);
            this.publishPath = escapePath(config['publishPath']);
            this.publishCopyAll = config['publishCopyAll'];
            this.cleanPublishPath = config['cleanPublishPath'];
            this.addCrc = config['addCrc'];
            //将保存在本地未分组配置中，已经不存在的资源移除掉。
            for (var i = 0; i < this.unPackGroup.length; i++) {
                var has = false;
                if (this.imageResLib[this.unPackGroup[i].key]) {
                    has = true;
                }
                if (!has) {
                    this.unPackGroup.splice(i, 1);
                    i--;
                }
            }
            //将保存在本地分组配置中，已经不存在的资源移除掉。
            for (i = 0; i < this.packGroups.length; i++) {
                var packGroup = this.packGroups[i];
                if (packGroup.res) {
                    for (var j = 0; j < packGroup.res.length; j++) {
                        has = false;
                        if (this.imageResLib[packGroup.res[j].key]) {
                            has = true;
                        }
                        if (!has) {
                            packGroup.res.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
            //检测是否有新的未分组的资源，将这些资源添加到本地分组配置的，未分组列表里
            for (i = 0; i < this.packResList.length; i++) {
                //从分组配置中，已经分组的资源中查找是否有该该资源
                var hasGrouped = false;
                for (j = 0; j < this.packGroups.length; j++) {
                    packGroup = this.packGroups[j];
                    if (packGroup.res) {
                        for (var k = 0; k < packGroup.res.length; k++) {
                            if (packGroup.res[k].key === this.packResList[i].getName()) {
                                hasGrouped = true;
                                break;
                            }
                        }
                    }
                    if (hasGrouped) {
                        break;
                    }
                }
                //如果上一次查找为false，从分组配置中，未分组的资源中查找是否有该资源
                if (!hasGrouped) {
                    for (j = 0; j < this.unPackGroup.length; j++) {
                        if (this.unPackGroup[j].key === this.packResList[i].getName()) {
                            hasGrouped = true;
                            break;
                        }
                    }
                    //如果还是没有找到，就把这个资源添加到未分组里
                    if (!hasGrouped) {
                        this.unPackGroup.push({ 'key': this.packResList[i].getName(), 'compress': false });
                    }
                }
            }
            this.resetImageToGroupName();
        };
        /**
         * 创建打包配置，之所以每次都创建是为了保证创建是最新的
         * @return
         */
        ResModel.prototype.createPackConfig = function () {
            var newConfig = {};
            var newUnPackGroup = newConfig.unPackGroup = [];
            for (var i = 0; i < this.unPackGroup.length; i++) {
                newUnPackGroup.push({ 'key': this.unPackGroup[i].key, 'compress': this.unPackGroup[i].compress });
            }
            var newPackGroups = newConfig.packGroups = [];
            for (i = 0; i < this.packGroups.length; i++) {
                var packGroup = this.packGroups[i];
                var newPackGroup = { 'gap': packGroup['gap'], 'sort': packGroup['sort'], 'name': packGroup['name'] };
                var currentRes = newPackGroup['res'] = [];
                var res = packGroup['res'];
                for (var j = 0; j < res.length; j++) {
                    currentRes.push({ 'key': res[j]['key'], 'compress': res[j]['compress'] });
                }
                newPackGroups.push(newPackGroup);
            }
            newConfig.sourcePath = escapePath(this.sourcePath);
            newConfig.publishPath = escapePath(this.publishPath);
            newConfig.publishCopyAll = this.publishCopyAll;
            newConfig.cleanPublishPath = this.cleanPublishPath;
            newConfig.addCrc = this.addCrc;
            return newConfig;
        };
        //================================自动打包==============================
        ResModel.prototype.publicByAuto = function (maxImageWidth, maxImageHeight, groupConfig, onComplete, onError) {
            var _this = this;
            maxImageWidth = this.calculater2(maxImageWidth);
            maxImageWidth = this.calculater2(maxImageHeight);
            var packConfig = {};
            packConfig.sourcePath = escapePath(this.sourcePath);
            var packImages = [];
            var len = this.resList.length;
            for (var i = 0; i < len; i++) {
                var resInfo = this.resList[i];
                if (!groupConfig[resInfo.groupName])
                    continue;
                if (resInfo.type !== 'image') {
                    continue;
                }
                var resImageFile = getBindFile(pathJoin(packConfig.sourcePath, resInfo.showUrl));
                if (resImageFile) {
                    continue;
                }
                var image = new resModel.ImageRes();
                image.key = resInfo.getName();
                image.groupName = resInfo.groupName;
                image.compress = false;
                image.url = resInfo.showUrl;
                if (resInfo.hasScale9Grid) {
                    var scale9Grid = new resModel.Rectangle();
                    scale9Grid.setTo(resInfo.x, resInfo.y, resInfo.w, resInfo.h);
                    image.scale9Grid = scale9Grid;
                }
                packImages.push(image);
            }
            packConfig.unPackGroup = [];
            packConfig.packGroups = [];
            packConfig.publishPath = escapePath(this.publishPath);
            packConfig.publishCopyAll = this.publishCopyAll;
            packConfig.cleanPublishPath = this.cleanPublishPath;
            packConfig.addCrc = this.addCrc;
            logMsg('开始加载图片...');
            this.loadImages(packConfig.sourcePath, packImages, function (success) {

                try {
                    var allImageLib = [];
                    function getImageRects(name) {
                        var i = 0;
                        var len = allImageLib.length;
                        for (; i < len; i++) {
                            if (allImageLib[i].groupName === name) {
                                return allImageLib[i].imageRects;
                            }
                        }
                        var newGroup = { groupName: name, imageRects: [] };
                        allImageLib.push(newGroup);
                        return newGroup.imageRects;
                    }
                    len = packImages.length;
                // console.log("success---------> 0:"+len);
                    var packGap = 2;
                    for (i = len - 1; i >= 0; i--) {
                        image = packImages[i];
                        // console.log(image)
                        console.log(image.bitWidth+"   "+image.bitHeight);
                        if (image.bitWidth <= maxImageWidth && image.bitHeight <= maxImageHeight) {
                            console.log("start get image")
                            getImageRects(image.groupName).push(new rectUtil.MaxRectangle(0, 0, image.bitWidth, image.bitHeight, image));
                        }
                    }
                    var packGroups = [];
                    len = allImageLib.length;
                    console.log("allImageLib.length    "+len);
                    for (i = 0; i < len; i++) {
                        var rectResults = rectUtil.MaxRectsUtil.packImages(allImageLib[i].imageRects, maxImageWidth, maxImageHeight, packGap);
                        var j = 0;
                        var jLen = rectResults.length;
                        var currentRectResult;
                        for (; j < jLen; j++) {
                            currentRectResult = rectResults[j];
                            var newPackGroup = new resModel.PackGroup();
                            newPackGroup.name = allImageLib[i].groupName + '-' + j;
                            newPackGroup.size = new resModel.Point(_this.calculater2(currentRectResult.maxWidth), _this.calculater2(currentRectResult.maxHeight));
                            var k = 0;
                            var kLen = currentRectResult.imageGroups.length;
                            for (k = 0; k < kLen; k++) {
                                var currentMaxRect = currentRectResult.imageGroups[k];
                                image = currentMaxRect.data;
                                image.packRect = new resModel.Rectangle(currentMaxRect.x, currentMaxRect.y, currentMaxRect.width, currentMaxRect.height);
                                newPackGroup.images.push(image);
                            }
                            packGroups.push(newPackGroup);
                        }
                        logMsg('【' + allImageLib[i].groupName + '】分组创建了' + jLen + '张合图!');
                    }

                    _this.finalPublish(packConfig.sourcePath, pathJoin(_this._workspace, _this.targerDir), packConfig.publishCopyAll, packConfig.cleanPublishPath, packConfig.addCrc, _this._resourcePath, readJson(_this._resourcePath), packGroups);
                    // writeJson(this._packPath, packConfig);
                    if (onComplete) {
                        onComplete();
                    }
                }
                catch (e) {
                    logMsg('error:' + e.toString());
                }
            });
        };
        ResModel.prototype.calculater2 = function (num) {
            var newNum = 2;
            while (num > newNum) {
                newNum = newNum << 1;
            }
            return newNum;
        };
        /**
         * 最终发布流程
         * @param rootPath
         * @param resrouceName
         * @param sourcePath
         * @param publishPath
         * @param copyAll
         * @param cleanPublishPath
         * @param addCrc
         * @param jsonPath
         * @param resourceConfig
         * @param packGroups
         */
       ResModel.prototype.finalPublish = function (sourcePath, publishPath, copyAll, cleanPublishPath, addCrc, jsonPath, resource, packGroups) {
            logMsg('开始合图...');
            this.fileNameCache.length = 0;
            if (cleanPublishPath) {
                deleteFile(publishPath);
            }
            console.log(cleanPublishPath);
            console.log(publishPath);
            //新的根目录
            var newRootPath = publishPath;
            //合并完成的会放到这个文件夹里面
            var targetGroupFolder = this.getFileName('packs', newRootPath);
            var targetGroupPath = newRootPath + targetGroupFolder + '/';
            //源目录中所有文件的列表

            console.log(targetGroupFolder);
            var sourceFiles = foreachFiles(sourcePath);
            //删掉资源配置文件路径
            this.removeFileFromSource(sourceFiles, jsonPath);
            var resourceData = this.jsonToRes(resource);
            var ress = resourceData['resList'];
            ress.forEach(function (res) {
                res.url = pathJoin(sourcePath, res.showUrl);
            });
            var groups = resourceData['groupList'];
            var newRess = [];
            var packGroupLen = packGroups.length;
            // logMsg('finalPublish:packImage:'+packGroupLen);
            console.log(packGroupLen);
            console.log(addCrc);
            // return;
            for (var i = 0; i < packGroupLen; i++) {
                // logMsg('finalPublish:packImage for i:'+i);
                if (packGroups[i].images && packGroups[i].images.length > 0) {
                    //这个sheet的名字
                    var sheetName = packGroups[i].name + 'sheet';
                    var sheetJsonObject = new Object();
                    var framesObject = {};
                    var packW = packGroups[i].size.x;
                    var packH = packGroups[i].size.y;
                    var images = packGroups[i].images;
                    var SSCanvas = node_images(packW,packH)
                   
                    var subKeys = [];
                    var imagesLen = images.length;
                    console.log("imageslen "+imagesLen)
                    for (var j = 0; j < imagesLen; j++) {
                        var image = images[j];
                        // logMsg('finalPublish:packImage for j:'+j);
                        var newBitmap = image.bitmapData;
                        var subKey = image.key;
                        var scale9Grid = image.scale9Grid;
                        var sourceRect = image.sourceRect;
                        // logMsg('finalPublish:scale9Grid'+scale9Grid+',sourceRect'+sourceRect);
                        framesObject[subKey] = { 'x': image.packRect.x, 'y': image.packRect.y, 'w': image.packRect.width, 'h': image.packRect.height,
                            'offX': sourceRect.x, 'offY': sourceRect.y, 'sourceW': sourceRect.width, 'sourceH': sourceRect.height };
                        if (scale9Grid) {
                            framesObject[subKey]['scale9grid'] = scale9Grid.x + ',' + scale9Grid.y + ',' + scale9Grid.width + ',' + scale9Grid.height;
                        }
                        // logMsg('finalPublish:drawImage=>'+[newBitmap.width,newBitmap.height, image.packRect.x,  image.packRect.y, image.packRect.width, image.packRect.height].join(','));
                        SSCanvas.drawImage(newBitmap, image.packRect.x, image.packRect.y );

                        //删除文件列表里的文件
                        var needDeleteRes = this.getRes(ress, subKey);
                        if (needDeleteRes) {
                            this.removeFileFromSource(sourceFiles, needDeleteRes.locolUrl);
                        }
                        //从所有资源列表中删掉这个资源
                        this.deleteRes(ress, subKey);
                        var sheetSubVO = new resModel.SheetSubVO();
                        sheetSubVO.setName(subKey);
                        subKeys.push(sheetSubVO);
                        // console.log("delete img:"+ image.url);
                        deleteFile(pathJoin(publishPath, image.url));
                    }
                    //  var body:HTMLElement = document.getElementsByTagName('div')[0];
                    //  body.appendChild(sheetSprite);
                    subKeys.sort(function (A, B) {
                        if (A.getName() > B.getName()) {
                            return -1;
                        }
                        return 1;
                    });
                    sheetJsonObject['frames'] = framesObject;
                    //要输出的Sheet的图片文件
                    // logMsg('finalPublish:canvasImportPng:'+packW+','+packH);
                    // var sheetPngBytes = packUtil.canvasImportPng(sheetSprite, packW, packH);
                    //sswilliam
                    //here we don't know how to get the base64 from a images object
                    //so we use a ugly way
                    //need to be improved
                    


                    var jsonImgUrl;
                    if (addCrc) {
                        var mockName = "qwertyuklafnmamenkjnvaeraer.png"
                        SSCanvas.save(mockName);
                        var sheetPngCrc = CRC32Util.getCRC32(readImageAsyn(mockName)).toString(16);
                        deleteFile(mockName);
                        jsonImgUrl = pathJoin(targetGroupPath, sheetName + '_' + sheetPngCrc + '.png');
                        sheetJsonObject['file'] = sheetName + '_' + sheetPngCrc + '.png';
                    }
                    else {
                        jsonImgUrl = pathJoin(targetGroupPath, sheetName + '.png');
                        sheetJsonObject['file'] = sheetName + '.png';
                    }
                    //要输出的Sheet的json文件
                    var sheetJson = JSON.stringify(sheetJsonObject, null, 0);
                    var sheetJsonName = sheetName;
                    var jsonUrl = '';
                    if (addCrc) {
                        sheetJsonName = sheetName + '_' + CRC32Util.getCRC32(sheetJson).toString(16);
                    }
                    jsonUrl = pathJoin(targetGroupPath, sheetJsonName + '.json');
                    if (images.length > 0) {
                        writeJson(jsonUrl, sheetJsonObject);
                        // saveBase64(jsonImgUrl, sheetPngBytes);
                        SSCanvas.save(jsonImgUrl);
                        logMsg('导出图片:（' + packW + ',' + packH + ')' + jsonImgUrl);
                        var res = new resModel.ResInfoVO();
                        res.setName(sheetName);
                        res.showUrl = 'targetGroupFolder/' + sheetJsonName + '.json';
                        res.url = jsonUrl;
                        res.subList = subKeys;
                        res.type = resModel.ResType.TYPE_SHEET;
                        ress.push(res);
                    }
                }
            }

            for (j = 0; j < ress.length; j++) {
                this.removeFileFromSource(sourceFiles, ress[j].locolUrl);
            }

            // logMsg('finalPublish:copypackImage:'+ress.length);
            console.log("ress.length:"+ress.length)
            for (i = 0; i < ress.length; i++) {
                var sourceUrl = ress[i].locolUrl;
                console.log("ress: "+sourceUrl);
                var publishUrl = sourceUrl.replace(sourcePath, publishPath);
                var fileName = FileUtil.getFileName(publishUrl);
                //  logMsg('i:'+i+"   "+sourceUrl+"   "+sourcePath);
                var ext = FileUtil.getExtension(publishUrl);
                if ((ress[i].type === resModel.ResType.TYPE_SHEET || ress[i].type === resModel.ResType.TYPE_FONT) && sourceUrl !== publishUrl) {
                    var resImageFile = getBindFile(publishUrl);
                    var sourceConfigStr = readText(sourceUrl);
                    if (resImageFile) {
                        var sourceImagePath = resImageFile;
                        var publishIamgePath = sourceImagePath.replace(sourcePath, publishPath);
                        if (addCrc) {
                            var imageBytes = readImageAsyn(sourceImagePath);
                            if (imageBytes) {
                                var imageCrcStr = CRC32Util.getCRC32(imageBytes).toString(16);
                                var imageExt = FileUtil.getExtension(publishIamgePath);
                                var sourceImageFileName = FileUtil.getFileName(publishIamgePath);
                                var imagefileName = sourceImageFileName + '_' + imageCrcStr;
                                publishIamgePath = FileUtil.getDirectory(publishIamgePath);
                                publishIamgePath += imagefileName;
                                if (imageExt) {
                                    publishIamgePath += '.' + imageExt;
                                }
                                //替换原名为原名+crc的形式
                                sourceConfigStr = sourceConfigStr.replace(new RegExp(imageExt ? sourceImageFileName + '.' + imageExt : sourceImageFileName, 'g'), imageExt ? imagefileName + '.' + imageExt : imagefileName);
                            }
                        }
                        copyFile(sourceImagePath, publishIamgePath);
                        deleteFile(sourceImagePath);
                    }
                    if (addCrc) {
                        // logMsg('imageDelete>>>:'+publishUrl);
                        deleteFile(publishUrl);
                        var sourceConfigCrcStr = CRC32Util.getCRC32(sourceConfigStr).toString(16);
                        fileName = FileUtil.getFileName(publishUrl) + '_' + sourceConfigCrcStr;
                        publishUrl = FileUtil.getDirectory(publishUrl);
                        publishUrl += fileName;
                        if (ext) {
                            publishUrl += '.' + ext;
                        }
                    }
                    writeText(publishUrl, sourceConfigStr);
                }
                else if (sourceUrl !== publishUrl) {
                    // logMsg('deleteFile>>>:'+publishUrl); 
                    deleteFile(publishUrl);
                    if (addCrc) {
                        var resBytes = readImageAsyn(sourceUrl);
                        if (resBytes) {
                            var resCrcStr = CRC32Util.getCRC32(resBytes).toString(16);
                            fileName = FileUtil.getFileName(publishUrl) + '_' + resCrcStr;
                            publishUrl = FileUtil.getDirectory(publishUrl);
                            publishUrl += fileName;
                            if (ext) {
                                publishUrl += '.' + ext;
                            }
                        }
                    }
                    copyFile(sourceUrl, publishUrl);
                }
                //剔除掉新的根目录，得到相对路径
                var showUrl = publishUrl.replace(newRootPath, '');
                res = new resModel.ResInfoVO();
                res.h = ress[i].h;
                res.id = ress[i].id;
                res.setName(ress[i].getName());
                res.other = ress[i].other;
                res.subList = ress[i].subList;
                res.type = ress[i].type;
                res.url = publishUrl;
                res.showUrl = showUrl;
                res.w = ress[i].w;
                res.x = ress[i].x;
                res.y = ress[i].y;
                newRess.push(res);
            }
            // logMsg('finalPublish:copypackImage:'+ress.length);
            var resourceObject = ResFileHelper.exportJsonObject(newRess, groups);
            writeJson(jsonPath.replace(sourcePath, publishPath), resourceObject);
            // if(copyAll)
            // {
            //  for(i= 0;i<sourceFiles.length;i++)
            //  {
            //      var fromPath:string = FileUtil.escapePath(sourceFiles[i]);
            //      var targetPath:string = fromPath.replace(sourcePath,publishPath)
            //      copyFile(fromPath,targetPath)
            //  }
            // }
            // logMsg('finalPublish:finish!');
        };
        /**
         * 从source中删掉与target的key相同的一项。
         * @param source
         * @param name
         *
         */
        ResModel.prototype.deleteRes = function (source, name) {
            var len = source.length;
            for (var i = 0; i < len; i++) {
                if (source[i].getName() === name) {
                    source.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 从source中得到key的资源
         * @param source
         * @param name
         * @return
         *
         */
        ResModel.prototype.getRes = function (source, name) {
            var len = source.length;
            for (var i = 0; i < len; i++) {
                if (source[i].getName() === name) {
                    return source[i];
                }
            }
            return null;
        };
        /**
         * 从文件列表中删除某个文件
         * @param files
         * @param file
         *
         */
        ResModel.prototype.removeFileFromSource = function (files, path) {
            var len = files.length;
            for (var i = 0; i < len; i++) {
                if (files[i] === path) {
                    files.splice(i, 1);
                    break;
                }
            }
        };
        /**
         * 得到不重复的文件名
         * @param url
         * @return
         */
        ResModel.prototype.getFileName = function (str, targetPath) {
            var index = 0;
            while (exitFile(pathJoin(targetPath, str + index))) {
                index++;
            }
            return str + index;
        };
        /**
         * 补全images里对应的图像
         * @param images
         */
        ResModel.prototype.loadImages = function (sourcePath, images, onComplete) {
            var sum = images.length;
            if (sum === 0) {
                onComplete(true);
                return;
            }
            var loadNum = -1;
            var success = true;
            var tempThis = this;
            function loadnext() {
                loadNum++;
                if (loadNum >= sum) {
                    onComplete(success);
                    return;
                }
                var imageRes = images[loadNum];
                var imageUrl = pathJoin(sourcePath, imageRes.url);
                // SSDBG(imageUrl)
                // logMsg('图片加载中：'+imageUrl)

                //by sswilliam
                //we need some to use the images lib to load the image
                let img = node_images(imageUrl);
                imageRes.sourceRect = new resModel.Rectangle(0, 0, img.width(), img.height());
                imageRes.bitmapData = img;
                loadnext();
            //     readImageToDataUrl(imageUrl, function (data) {
            //         if (data) {
            //             var img = document.createElement('img');
            //             img.onload = function () {
            //                 img.onload = null;
            //                 img.onerror = null;
            //                 if (tempThis.useClip) {
            //                     packUtil.clipImageByRes(imageRes, img, loadnext.bind(tempThis));
            //                 }
            //                 else {
            //                     imageRes.sourceRect = new resModel.Rectangle(0, 0, img.width, img.height);
            //                     loadnext();
            //                 }
            //             };
            //             img.onerror = function () {
            //                 logMsg('图片格式错误：' + imageUrl);
            //                 img.onload = null;
            //                 img.onerror = null;
            //                 success = false;
            //                 loadnext();
            //             };
            //             imageRes.bitmapData = img;
            //             img.src = data;
            //         }
            //         else {
            //             logMsg('图片加载失败：' + imageUrl);
            //             success = false;
            //             loadnext();
            //         }
            //     });
            }
            ;
            loadnext();
        };
        /**
         * 分析合图组
         * @param packImages
         * @param resource
         * @param packConfig
         * @param onComplete
         *
         */
        ResModel.prototype.analysePacks = function (packGroups) {
            var success = true;
            packGroups.forEach(function (packGroup) {
                // logMsg('analysePacks: '+packGroup.name+'  ...');
                var maxRects = [];
                packGroup.images.forEach(function (image) {
                    var rect = new rectUtil.MaxRectangle(0, 0, image.bitmapData.width, image.bitmapData.height, image);
                    maxRects.push(rect);
                });
                rectUtil.MaxRectsUtil.setMaxSize(4096, 4096);
                rectUtil.MaxRectsUtil.setGap(packGroup.gap);
                rectUtil.MaxRectsUtil.setSortOn(packGroup.sort === 0 ? rectUtil.MaxRectsSortType.AREA : rectUtil.MaxRectsSortType.SIZE);
                rectUtil.MaxRectsUtil.insertRectangles(maxRects);
                if (rectUtil.MaxRectsUtil.resultType === rectUtil.MaxRectsResultType.SUCCESS) {
                    for (var i = 0; i < rectUtil.MaxRectsUtil.result.length; i++) {
                        var imageRes = rectUtil.MaxRectsUtil.result[i].data;
                        imageRes.packRect = new resModel.Rectangle(rectUtil.MaxRectsUtil.result[i].x, rectUtil.MaxRectsUtil.result[i].y, rectUtil.MaxRectsUtil.result[i].width, rectUtil.MaxRectsUtil.result[i].height);
                    }
                    packGroup.size = new resModel.Point(rectUtil.MaxRectsUtil.resultSize.x, rectUtil.MaxRectsUtil.resultSize.y);
                }
                else if (rectUtil.MaxRectsUtil.resultType === rectUtil.MaxRectsResultType.SHEET_EMPTY) {
                    //失败了
                    success = false;
                }
                else if (rectUtil.MaxRectsUtil.resultType === rectUtil.MaxRectsResultType.SHEET_TO_BIG) {
                    //失败了
                    success = false;
                }
                // logMsg('analysePacks: '+packGroup.name+(success?'  success':'  faild'));
            });
            return success;
        };
        /**
         * 创建合图组列表
         * @param images
         * @param packConfig
         * @return
         */
        ResModel.prototype.createPackGroups = function (images, packConfig) {
            var packGroups = [];
            var packGroupDatas = packConfig.packGroups;
            if (!packGroupDatas) {
                packGroupDatas = [];
            }
            // logMsg('packGroupDatas.length'+packGroupDatas.length)
            packGroupDatas.forEach(function (packGroupData) {
                var packGroup = new resModel.PackGroup();
                packGroup.gap = packGroupData.gap;
                packGroup.name = packGroupData.name;
                packGroup.sort = packGroupData.sort;
                var reses = packGroupData.res;
                if (!reses) {
                    reses = [];
                }
                reses.forEach(function (res) {
                    var resKey = res.key;
                    for (var i = 0; i < images.length; i++) {
                        if (images[i].key === resKey) {
                            packGroup.images.push(images[i]);
                            break;
                        }
                    }
                });
                // logMsg('packGroup '+packGroup.name+' childNum:'+packGroup.images.length);
                packGroups.push(packGroup);
            });
            return packGroups;
        };
        /**
         * 通过打包配置得到需要被打包的图像资源，此函数会创建好key值和compress值
         * @return
         */
        ResModel.prototype.createPackIamgeWithKeyAndCompress = function (packConfig) {
            var _this = this;
            var images = [];
            var packGroups = packConfig.packGroups;
            if (!packGroups) {
                packGroups = [];
            }
            packGroups.forEach(function (packGroup) {
                var reses = packGroup.res;
                if (!reses) {
                    reses = [];
                }
                reses.forEach(function (res) {
                    var image = new resModel.ImageRes();
                    image.key = res.key;
                    image.compress = res.compress;
                    var resInfo = _this.resInfoLib[res.key];
                    image.url = resInfo.showUrl;
                    if (resInfo.hasScale9Grid) {
                        var scale9Grid = new resModel.Rectangle();
                        scale9Grid.setTo(resInfo.x, resInfo.y, resInfo.w, resInfo.h);
                        image.scale9Grid = scale9Grid;
                    }
                    images.push(image);
                });
            });
            return images;
        };
        return ResModel;
    }());
    resModel.ResModel = ResModel;
})(resModel || (resModel = {}));



var resModel;
(function (resModel) {
    var Point = (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    resModel.Point = Point;
    var Rectangle = (function () {
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        Rectangle.prototype.setTo = function (x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        };
        return Rectangle;
    }());
    resModel.Rectangle = Rectangle;
    /**
     * 组的资源包
     */
    var GroupInfoVO = (function () {
        function GroupInfoVO() {
            this.groupName = '';
            this._childList = [];
        }
        Object.defineProperty(GroupInfoVO.prototype, "childList", {
            get: function () {
                return this._childList;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 添加一个资源包
         * @param resInfoVO
         *
         */
        GroupInfoVO.prototype.addResInfoVO = function (resInfoVO) {
            if (this._childList.indexOf(resInfoVO) <= 0) {
                this._childList.push(resInfoVO);
            }
        };
        /**
         * 移除一个资源包
         * @param url
         *
         */
        GroupInfoVO.prototype.removeResInfoVO = function (resInfoVO) {
            var index = this._childList.indexOf(resInfoVO);
            if (index !== -1) {
                this._childList.splice(index, 1);
            }
        };
        GroupInfoVO.prototype.dispose = function () {
            this._childList.length = 0;
        };
        return GroupInfoVO;
    }());
    resModel.GroupInfoVO = GroupInfoVO;
    /**
     * 资源数据包
     * @author 雷羽佳 2014.6.9 11:14
     */
    var ResInfoVO = (function () {
        function ResInfoVO() {
            this._name = '';
            /**资源类型*/
            this.type = '';
            /**真实资源路径*/
            this.url = '';
            this._showUrl = '';
            this.isCreated = false;
            this._isSameName = false;
            /**其他项错误*/
            this.otherError = false;
            /**
             * 九宫格或者声音类型
             */
            this.other = '';
            /**id*/
            this.id = 0;
            /**九宫格基本数据*/
            this.x = 0;
            this.y = 0;
            this.w = 0;
            this.h = 0;
            this.hasScale9Grid = false;
            /**文件错误，如不存在或文件解析错误等 */
            this.fileError = false;
            //////////以下部分仅为渲染列表的时候使用，不是真正的数据，是为了渲染性能而写的////
            this.inCurrentGroup = false;
        }
        Object.defineProperty(ResInfoVO.prototype, "locolUrl", {
            /**
             * 本地路径，该路径是去除了路径参数的，只用于做加载用，并不参与resource.json的处理
             */
            get: function () {
                var index = this.url.indexOf('?');
                if (index !== -1) {
                    return this.url.slice(0, index);
                }
                return this.url;
            },
            enumerable: true,
            configurable: true
        });
        /**资源名称*/
        ResInfoVO.prototype.getName = function () {
            return this._name;
        };
        /**
         * @private
         */
        ResInfoVO.prototype.setName = function (value) {
            this._name = value;
        };
        /**是否有重名*/
        ResInfoVO.prototype.getIsSameName = function () {
            return this._isSameName;
        };
        /**
         * @private
         */
        ResInfoVO.prototype.setIsSameName = function (value) {
            this._isSameName = value;
        };
        Object.defineProperty(ResInfoVO.prototype, "showUrl", {
            /**显示的资源路径*/
            get: function () {
                return this._showUrl;
            },
            /**
             * @private
             */
            set: function (value) {
                this._showUrl = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResInfoVO.prototype, "subError", {
            /**
             * 二级是否错误
             * @return
             *
             */
            get: function () {
                if (this.subList) {
                    for (var i = 0; i < this.subList.length; i++) {
                        if (this.subList[i].getIsSameName() === true) {
                            return true;
                        }
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        ResInfoVO.prototype.toString = function () {
            return "[name:  " + this.getName() + " , id:" + this.id + " , type:" + this.type + ", url:" + this.url + ", showUrl:" + this.showUrl + "]";
        };
        return ResInfoVO;
    }());
    resModel.ResInfoVO = ResInfoVO;
    var ResShowVO = (function () {
        function ResShowVO() {
            this.name = '';
            this.type = '';
            this.showUrl = '';
            this.other = '';
        }
        ResShowVO.prototype.ResShowVO = function () {
        };
        return ResShowVO;
    }());
    /**
     * 二级key数据包
     * @author 雷羽佳
     *
     */
    var SheetSubVO = (function () {
        function SheetSubVO() {
            this._name = '';
            this._isSameName = false;
        }
        /**
         * 二级的key
         */
        SheetSubVO.prototype.getName = function () {
            return this._name;
        };
        /**
         * @private
         */
        SheetSubVO.prototype.setName = function (value) {
            this._name = value;
        };
        /**
         * 是否重名，包括，是否与所有一级重名是否与所有二级重名，只要有重名就为true。
         */
        SheetSubVO.prototype.getIsSameName = function () {
            return this._isSameName;
        };
        /**
         * @private
         */
        SheetSubVO.prototype.setIsSameName = function (value) {
            this._isSameName = value;
        };
        return SheetSubVO;
    }());
    resModel.SheetSubVO = SheetSubVO;
    var ResourceVO = (function () {
        function ResourceVO() {
            this.resourceUrl = '';
            this.rootPath = '';
            /**
             * 资源目录，即resrouce文件夹
             */
            this.resourcePath = '';
            /**
             * 发布目录
             */
            this.publishPath = '';
            /**
             * 发布拷贝全部
             */
            this.publishCopyAll = false;
            /**
             * 发布时清空“发布目录”
             */
            this.cleanPublishPath = false;
            /**
             * 发布时添加crc码到文件名
             */
            this.addCrc = true;
            /**
             * 资源发布配置目录 （合图配置目录）
             */
            this.publishConfigPath = '';
        }
        ResourceVO.prototype.toString = function () {
            return "[resourceUrl:" + this.resourceUrl + ", rootPath:" + this.rootPath + ", resourcePath:" + this.resourcePath + ", publishPath:" + this.publishPath + ", publishCopyAll:" + this.publishCopyAll + ", cleanPublishPath:" + this.cleanPublishPath + ", addCrc:" + this.addCrc + "]";
        };
        return ResourceVO;
    }());
    var BitmapData = (function () {
        function BitmapData() {
        }
        return BitmapData;
    }());
    /**
     * 一个图像资源
     * @author featherJ
     */
    var ImageRes = (function () {
        function ImageRes() {
            /**
             * 资源key
             */
            this.key = '';
            /**
             * 资源url
             */
            this.url = '';
            /**
             * 是否压缩九宫格
             */
            this.compress = false;
        }
        Object.defineProperty(ImageRes.prototype, "bitWidth", {
            get: function () {
                return this.bitmapData.width();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageRes.prototype, "bitHeight", {
            get: function () {
                return this.bitmapData.height();
            },
            enumerable: true,
            configurable: true
        });
        return ImageRes;
    }());
    resModel.ImageRes = ImageRes;
    /**
     * 一个合图组
     * @author featherJ
     */
    var PackGroup = (function () {
        function PackGroup() {
            /**
             * 间隙
             */
            this.gap = 0;
            /**
             * 组名
             */
            this.name = '';
            /**
             * 排序算法
             */
            this.sort = 0;
            /**
             * 图集序列
             */
            this.images = [];
        }
        return PackGroup;
    }());
    resModel.PackGroup = PackGroup;
    /**
     * 资源的类型
     * @author 雷羽佳 2014.6.9 12:08
     *
     */
    var ResType = (function () {
        function ResType() {
        }
        //资源类型
        ResType.TYPE_BIN = 'bin';
        ResType.TYPE_IMAGE = 'image';
        ResType.TYPE_TEXT = 'text';
        ResType.TYPE_JSON = 'json';
        ResType.TYPE_SHEET = 'sheet';
        ResType.TYPE_FONT = 'font';
        ResType.TYPE_SOUND = 'sound';
        //资源扩展
        ResType.IMAGE_TYPE_EXTS = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
        ResType.SOUND_TYPE_EXTS = ['mp3', 'wav', 'm4a'];
        ResType.TEXT_TYPE_EXTS = ['txt'];
        ResType.FONT_TYPE_EXTS = ['fnt'];
        ResType.JSON_TYPE_EXTS = ['json'];
        //附加参数类型
        ResType.SOUND_TYPE = ['music', 'effect'];
        ResType.DEFAULT_TYPE = [
            {
                'name': '二进制',
                'key': 'bin',
                'isShow': false,
                'type': 'default',
                'exts': []
            },
            {
                'name': '图片',
                'key': 'image',
                'isShow': true,
                'type': 'default',
                'exts': ['png', 'jpg', 'jpeg', 'bmp', 'gif']
            },
            {
                'name': '声音',
                'key': 'sound',
                'isShow': true,
                'type': 'default',
                'exts': ['mp3', 'wav', 'm4a']
            },
            {
                'name': '文本',
                'key': 'text',
                'isShow': true,
                'type': 'default',
                'exts': ['txt']
            },
            {
                'name': '字体',
                'key': 'font',
                'isShow': true,
                'type': 'default',
                'exts': ['fnt']
            },
            {
                'name': 'Sheet',
                'key': 'sheet',
                'isShow': false,
                'type': 'default',
                'exts': ['json']
            },
            {
                'name': 'Json',
                'key': 'json',
                'isShow': true,
                'type': 'default',
                'exts': ['json']
            }
        ];
        return ResType;
    }());
    resModel.ResType = ResType;
})(resModel || (resModel = {}));



var ggg;
(function (ggg) {
    /**
     * 二维装箱算法
     * featherJ 改
     */
    var MaxRectsCore = (function () {
        function MaxRectsCore() {
            this.binWidth = 0;
            this.binHeight = 0;
            this.allowRotations = false;
            this.usedRectangles = [];
            this.freeRectangles = [];
            /**
             *工厂类实例 用来实例化内部新对象
             */
            this.factory = new MaxRectangle();
            this.score1 = 0; // Unused in this function. We don't need to know the score after finding the position.
            this.score2 = 0;
        }
        /**
         * 是否可以旋转
         * @param rotations
         *
         */
        MaxRectsCore.prototype.setCanRotate = function (rotations) {
            this.allowRotations = rotations;
        };
        /**
         *初始化一个用来填充的矩形区域
         * @param width 宽度
         * @param height 高度
         * @param rotations 是否允许旋转
         *
         */
        MaxRectsCore.prototype.init = function (width, height) {
            if (this.count(width) % 1 != 0 || this.count(height) % 1 != 0)
                throw new Error("Must be 2,4,8,16,32,...512,1024,...");
            this.binWidth = width;
            this.binHeight = height;
            var n = this.factory.newOne();
            n.x = 0;
            n.y = 0;
            n.width = width;
            n.height = height;
            this.usedRectangles.length = 0;
            this.freeRectangles.length = 0;
            this.freeRectangles.push(n);
        };
        MaxRectsCore.prototype.count = function (n) {
            if (n >= 2)
                return this.count(n / 2);
            return n;
        };
        /**
         * 插入一个矩形，并布局该矩形
         * @param width 宽度
         * @param height 高度
         * @param data 附加参数
         * @param method 布局方式
         * @return 布局完毕的矩形对象
         *
         */
        MaxRectsCore.prototype.insert = function (width, height, data, method) {
            var newNode = this.factory.newOne();
            this.score1 = 0;
            this.score2 = 0;
            switch (method) {
                case FreeRectangleChoiceHeuristic.BestShortSideFit:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height, data);
                    break;
                case FreeRectangleChoiceHeuristic.BottomLeftRule:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, this.score1, this.score2, data);
                    break;
                case FreeRectangleChoiceHeuristic.ContactPointRule:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, this.score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestLongSideFit:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, this.score2, this.score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestAreaFit:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, this.score1, this.score2, data);
                    break;
            }
            if (newNode.height == 0)
                return newNode;
            this.placeRectangle(newNode);
            return newNode;
        };
        /**
         * 插入一个矩形，并布局该矩形
         * @param width 宽度
         * @param height 高度
         * @param method 布局方式
         * @return 布局完毕的矩形对象
         *
         */
        MaxRectsCore.prototype.insertGroup = function (rectangles, method) {
            while (rectangles.length > 0) {
                var bestScore1 = Number.MAX_VALUE;
                var bestScore2 = Number.MAX_VALUE;
                var bestRectangleIndex = -1;
                var bestNode;
                for (var i = 0; i < rectangles.length; ++i) {
                    var score1 = 0;
                    var score2 = 0;
                    var newNode = this.scoreRectangle(rectangles[i].width, rectangles[i].height, method, score1, score2, rectangles[i].data);
                    if (score1 < bestScore1 || (score1 == bestScore1 && score2 < bestScore2)) {
                        bestScore1 = score1;
                        bestScore2 = score2;
                        bestNode = newNode;
                        bestRectangleIndex = i;
                    }
                }
                if (bestRectangleIndex == -1)
                    return;
                this.placeRectangle(bestNode);
                rectangles.splice(bestRectangleIndex, 1);
            }
        };
        MaxRectsCore.prototype.placeRectangle = function (node) {
            var numRectanglesToProcess = this.freeRectangles.length;
            for (var i = 0; i < numRectanglesToProcess; i++) {
                if (this.splitFreeNode(this.freeRectangles[i], node)) {
                    this.freeRectangles.splice(i, 1);
                    --i;
                    --numRectanglesToProcess;
                }
            }
            this.pruneFreeList();
            this.usedRectangles.push(node);
        };
        MaxRectsCore.prototype.scoreRectangle = function (width, height, method, score1, score2, data) {
            var newNode = this.factory.newOne();
            score1 = Number.MAX_VALUE;
            score2 = Number.MAX_VALUE;
            switch (method) {
                case FreeRectangleChoiceHeuristic.BestShortSideFit:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height, data);
                    break;
                case FreeRectangleChoiceHeuristic.BottomLeftRule:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2, data);
                    break;
                case FreeRectangleChoiceHeuristic.ContactPointRule:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, score1, data);
                    // todo: reverse
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case FreeRectangleChoiceHeuristic.BestLongSideFit:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestAreaFit:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2, data);
                    break;
            }
            // Cannot fit the current Rectangle.
            if (newNode.height == 0) {
                score1 = Number.MAX_VALUE;
                score2 = Number.MAX_VALUE;
            }
            return newNode;
        };
        /// Computes the ratio of used surface area.
        MaxRectsCore.prototype.occupancy = function () {
            var usedSurfaceArea = 0;
            for (var i = 0; i < this.usedRectangles.length; i++)
                usedSurfaceArea += this.usedRectangles[i].width * this.usedRectangles[i].height;
            return usedSurfaceArea / (this.binWidth * this.binHeight);
        };
        MaxRectsCore.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX, data) {
            var bestNode = this.factory.newOne();
            //memset(bestNode, 0, sizeof(Rectangle));
            bestY = Number.MAX_VALUE;
            var rect;
            var topSideY;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestY = topSideY;
                        bestX = rect.x;
                        bestNode.isRotated = false;
                    }
                }
                else if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY || (topSideY == bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestY = topSideY;
                        bestX = rect.x;
                        bestNode.isRotated = true;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestShortSideFit = function (width, height, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            this.bestShortSideFit = Number.MAX_VALUE;
            this.bestLongSideFit = this.score2;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (shortSideFit < this.bestShortSideFit || (shortSideFit == this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        this.bestShortSideFit = shortSideFit;
                        this.bestLongSideFit = longSideFit;
                    }
                }
                var flippedLeftoverHoriz;
                var flippedLeftoverVert;
                var flippedShortSideFit;
                var flippedLongSideFit;
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.width - height);
                    flippedLeftoverVert = Math.abs(rect.height - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                    if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit == this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        this.bestShortSideFit = flippedShortSideFit;
                        this.bestLongSideFit = flippedLongSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestLongSideFit = Number.MAX_VALUE;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestAreaFit = Number.MAX_VALUE;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var areaFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                areaFit = rect.width * rect.height - width * height;
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
            }
            return bestNode;
        };
        /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
        MaxRectsCore.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
            if (i1end < i2start || i2end < i1start)
                return 0;
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        };
        MaxRectsCore.prototype.contactPointScoreNode = function (x, y, width, height) {
            var score = 0;
            if (x == 0 || x + width == this.binWidth)
                score += height;
            if (y == 0 || y + height == this.binHeight)
                score += width;
            var rect;
            for (var i = 0; i < this.usedRectangles.length; i++) {
                rect = this.usedRectangles[i];
                if (rect.x == x + width || rect.x + rect.width == x)
                    score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
                if (rect.y == y + height || rect.y + rect.height == y)
                    score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
            }
            return score;
        };
        MaxRectsCore.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestContactScore = -1;
            var rect;
            var score;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestContactScore = score;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.splitFreeNode = function (freeNode, usedNode) {
            // Test with SAT if the Rectangles even intersect.
            if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
                return false;
            var newNode;
            if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
                    newNode = freeNode.cloneOne();
                    newNode.height = usedNode.y - newNode.y;
                    this.freeRectangles.push(newNode);
                }
                // New node at the bottom side of the used node.
                if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                    newNode = freeNode.cloneOne();
                    newNode.y = usedNode.y + usedNode.height;
                    newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                    this.freeRectangles.push(newNode);
                }
            }
            if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                    newNode = freeNode.cloneOne();
                    newNode.width = usedNode.x - newNode.x;
                    this.freeRectangles.push(newNode);
                }
                // New node at the right side of the used node.
                if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                    newNode = freeNode.cloneOne();
                    newNode.x = usedNode.x + usedNode.width;
                    newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                    this.freeRectangles.push(newNode);
                }
            }
            return true;
        };
        MaxRectsCore.prototype.pruneFreeList = function () {
            for (var i = 0; i < this.freeRectangles.length; i++)
                for (var j = i + 1; j < this.freeRectangles.length; j++) {
                    if (this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])) {
                        this.freeRectangles.splice(i, 1);
                        break;
                    }
                    if (this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])) {
                        this.freeRectangles.splice(j, 1);
                    }
                }
        };
        MaxRectsCore.prototype.isContainedIn = function (a, b) {
            return a.x >= b.x && a.y >= b.y
                && a.x + a.width <= b.x + b.width
                && a.y + a.height <= b.y + b.height;
        };
        return MaxRectsCore;
    }());
    ggg.MaxRectsCore = MaxRectsCore;
    var FreeRectangleChoiceHeuristic = (function () {
        function FreeRectangleChoiceHeuristic() {
        }
        FreeRectangleChoiceHeuristic.BestShortSideFit = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
        FreeRectangleChoiceHeuristic.BestLongSideFit = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
        FreeRectangleChoiceHeuristic.BestAreaFit = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
        FreeRectangleChoiceHeuristic.BottomLeftRule = 3; ///< -BL: Does the Tetris placement.
        FreeRectangleChoiceHeuristic.ContactPointRule = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
        return FreeRectangleChoiceHeuristic;
    }());
    /**
    * MaxRect算法用的矩形数据
    * @author featherJ
    *
    */
    var MaxRectangle = (function () {
        function MaxRectangle(x, y, width, height, data) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (data === void 0) { data = null; }
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            /**
             * 是否旋转了
             */
            this._isRotated = false;
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
            this.data = data;
        }
        Object.defineProperty(MaxRectangle.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (v) {
                this._x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (v) {
                this._y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                this._width = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                this._height = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (v) {
                this._data = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "isRotated", {
            get: function () {
                return this._isRotated;
            },
            set: function (v) {
                this._isRotated = v;
            },
            enumerable: true,
            configurable: true
        });
        MaxRectangle.prototype.cloneOne = function () {
            var cloneRect = new MaxRectangle();
            cloneRect.x = this._x;
            cloneRect.y = this._y;
            cloneRect.width = this._width;
            cloneRect.height = this._height;
            cloneRect.data = this.data;
            cloneRect.isRotated = this.isRotated;
            return cloneRect;
        };
        MaxRectangle.prototype.newOne = function () {
            return new MaxRectangle();
        };
        return MaxRectangle;
    }());
    ggg.MaxRectangle = MaxRectangle;
})(ggg || (ggg = {})); // TypeScript file




var rectUtil;
(function (rectUtil) {
    var MaxRectsSortType = (function () {
        function MaxRectsSortType() {
        }
        /**
         * 按面积排序
         */
        MaxRectsSortType.AREA = 'area';
        /**
         * 按宽高排序
         */
        MaxRectsSortType.SIZE = 'size';
        return MaxRectsSortType;
    }());
    rectUtil.MaxRectsSortType = MaxRectsSortType;
    var FreeRectangleChoiceHeuristic = (function () {
        function FreeRectangleChoiceHeuristic() {
        }
        FreeRectangleChoiceHeuristic.BestShortSideFit = 0; ///< -BSSF: Positions the Rectangle against the short side of a free Rectangle into which it fits the best.
        FreeRectangleChoiceHeuristic.BestLongSideFit = 1; ///< -BLSF: Positions the Rectangle against the long side of a free Rectangle into which it fits the best.
        FreeRectangleChoiceHeuristic.BestAreaFit = 2; ///< -BAF: Positions the Rectangle into the smallest free Rectangle into which it fits.
        FreeRectangleChoiceHeuristic.BottomLeftRule = 3; ///< -BL: Does the Tetris placement.
        FreeRectangleChoiceHeuristic.ContactPointRule = 4; ///< -CP: Choosest the placement where the Rectangle touches other Rectangles as much as possible.
        return FreeRectangleChoiceHeuristic;
    }());
    rectUtil.FreeRectangleChoiceHeuristic = FreeRectangleChoiceHeuristic;
    var MaxRectsResultType = (function () {
        function MaxRectsResultType() {
        }
        /**
         * 成功了
         */
        MaxRectsResultType.SUCCESS = 'success';
        /**
         * 切片面积太大，超过了最大尺寸限制
         */
        MaxRectsResultType.SHEET_TO_BIG = 'toBig';
        /**
         * 存在空图
         */
        MaxRectsResultType.SHEET_EMPTY = 'sheetEmpty';
        return MaxRectsResultType;
    }());
    rectUtil.MaxRectsResultType = MaxRectsResultType;
    /**
     * MaxRect算法用的矩形数据
     * @author featherJ
     *
     */
    var MaxRectangle = (function () {
        function MaxRectangle(x, y, width, height, data) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            if (data === void 0) { data = null; }
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
            /**
             * 是否旋转了
             */
            this._isRotated = false;
            this._x = x;
            this._y = y;
            this._width = width;
            this._height = height;
            this.data = data;
        }
        Object.defineProperty(MaxRectangle.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (v) {
                this._x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (v) {
                this._y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (v) {
                this._width = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (v) {
                this._height = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (v) {
                this._data = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectangle.prototype, "isRotated", {
            get: function () {
                return this._isRotated;
            },
            set: function (v) {
                this._isRotated = v;
            },
            enumerable: true,
            configurable: true
        });
        MaxRectangle.prototype.cloneOne = function () {
            var cloneRect = new MaxRectangle();
            cloneRect.x = this._x;
            cloneRect.y = this._y;
            cloneRect.width = this._width;
            cloneRect.height = this._height;
            cloneRect.data = this.data;
            cloneRect.isRotated = this.isRotated;
            cloneRect.orginWidth = this.orginWidth;
            cloneRect.orginWHeight = this.orginWHeight;
            return cloneRect;
        };
        Object.defineProperty(MaxRectangle.prototype, "area", {
            get: function () {
                return this._width * this._height;
            },
            enumerable: true,
            configurable: true
        });
        MaxRectangle.prototype.newOne = function () {
            return new MaxRectangle();
        };
        MaxRectangle.prototype.toString = function () {
            return "[x:" + this.x + ",y:" + this.y + ",width:" + this.width + ",height:" + this.height + "]";
        };
        return MaxRectangle;
    }());
    rectUtil.MaxRectangle = MaxRectangle;
    /**
     * 二维装箱算法
     * featherJ 改
     */
    var MaxRectsCore = (function () {
        function MaxRectsCore() {
            this.binWidth = 0;
            this.binHeight = 0;
            this.allowRotations = false;
            this.usedRectangles = [];
            this.freeRectangles = [];
            /**
             *工厂类实例 用来实例化内部新对象
             */
            this.factory = new MaxRectangle();
            this.score1 = 0; // Unused in this function. We don't need to know the score after finding the position.
            this.score2 = 0;
        }
        /**
         * 是否可以旋转
         * @param rotations
         *
         */
        MaxRectsCore.prototype.setCanRotate = function (rotations) {
            this.allowRotations = rotations;
        };
        /**
         *初始化一个用来填充的矩形区域
         * @param width 宽度
         * @param height 高度
         * @param rotations 是否允许旋转
         *
         */
        MaxRectsCore.prototype.init = function (width, height) {
            if (this.count(width) % 1 !== 0 || this.count(height) % 1 !== 0) {
                throw new Error('Must be 2,4,8,16,32,...512,1024,...');
            }
            this.binWidth = width;
            this.binHeight = height;
            var n = this.factory.newOne();
            n.x = 0;
            n.y = 0;
            n.width = width;
            n.height = height;
            this.usedRectangles.length = 0;
            this.freeRectangles.length = 0;
            this.freeRectangles.push(n);
        };
        MaxRectsCore.prototype.count = function (n) {
            if (n >= 2) {
                return this.count(n / 2);
            }
            return n;
        };
        /**
         * 插入一个矩形，并布局该矩形
         * @param width 宽度
         * @param height 高度
         * @param data 附加参数
         * @param method 布局方式
         * @return 布局完毕的矩形对象
         *
         */
        MaxRectsCore.prototype.insert = function (width, height, data, method) {
            var newNode = this.factory.newOne();
            this.score1 = 0;
            this.score2 = 0;
            switch (method) {
                case FreeRectangleChoiceHeuristic.BestShortSideFit:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height, data);
                    break;
                case FreeRectangleChoiceHeuristic.BottomLeftRule:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, this.score1, this.score2, data);
                    break;
                case FreeRectangleChoiceHeuristic.ContactPointRule:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, this.score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestLongSideFit:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, this.score2, this.score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestAreaFit:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, this.score1, this.score2, data);
                    break;
            }
            if (newNode.height === 0) {
                return newNode;
            }
            this.placeRectangle(newNode);
            return newNode;
        };
        /**
         * 插入一个矩形，并布局该矩形
         * @param width 宽度
         * @param height 高度
         * @param method 布局方式
         * @return 布局完毕的矩形对象
         *
         */
        MaxRectsCore.prototype.insertGroup = function (rectangles, method) {
            while (rectangles.length > 0) {
                var bestScore1 = Number.MAX_VALUE;
                var bestScore2 = Number.MAX_VALUE;
                var bestRectangleIndex = -1;
                var bestNode;
                for (var i = 0; i < rectangles.length; ++i) {
                    var score1 = 0;
                    var score2 = 0;
                    var newNode = this.scoreRectangle(rectangles[i].width, rectangles[i].height, method, score1, score2, rectangles[i].data);
                    if (score1 < bestScore1 || (score1 === bestScore1 && score2 < bestScore2)) {
                        bestScore1 = score1;
                        bestScore2 = score2;
                        bestNode = newNode;
                        bestRectangleIndex = i;
                    }
                }
                if (bestRectangleIndex === -1) {
                    return;
                }
                this.placeRectangle(bestNode);
                rectangles.splice(bestRectangleIndex, 1);
            }
        };
        MaxRectsCore.prototype.placeRectangle = function (node) {
            var numRectanglesToProcess = this.freeRectangles.length;
            for (var i = 0; i < numRectanglesToProcess; i++) {
                if (this.splitFreeNode(this.freeRectangles[i], node)) {
                    this.freeRectangles.splice(i, 1);
                    --i;
                    --numRectanglesToProcess;
                }
            }
            this.pruneFreeList();
            this.usedRectangles.push(node);
        };
        MaxRectsCore.prototype.scoreRectangle = function (width, height, method, score1, score2, data) {
            var newNode = this.factory.newOne();
            score1 = Number.MAX_VALUE;
            score2 = Number.MAX_VALUE;
            switch (method) {
                case FreeRectangleChoiceHeuristic.BestShortSideFit:
                    newNode = this.findPositionForNewNodeBestShortSideFit(width, height, data);
                    break;
                case FreeRectangleChoiceHeuristic.BottomLeftRule:
                    newNode = this.findPositionForNewNodeBottomLeft(width, height, score1, score2, data);
                    break;
                case FreeRectangleChoiceHeuristic.ContactPointRule:
                    newNode = this.findPositionForNewNodeContactPoint(width, height, score1, data);
                    // todo: reverse
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case FreeRectangleChoiceHeuristic.BestLongSideFit:
                    newNode = this.findPositionForNewNodeBestLongSideFit(width, height, score2, score1, data);
                    break;
                case FreeRectangleChoiceHeuristic.BestAreaFit:
                    newNode = this.findPositionForNewNodeBestAreaFit(width, height, score1, score2, data);
                    break;
            }
            // Cannot fit the current Rectangle.
            if (newNode.height === 0) {
                score1 = Number.MAX_VALUE;
                score2 = Number.MAX_VALUE;
            }
            return newNode;
        };
        /// Computes the ratio of used surface area.
        // private  occupancy():number
        // {
        //  var usedSurfaceArea:number = 0;
        //  for(var i:number = 0; i < this.usedRectangles.length; i++)
        //      usedSurfaceArea += this.usedRectangles[i].width * this.usedRectangles[i].height;
        //  return usedSurfaceArea / (this.binWidth *this. binHeight);
        // }
        MaxRectsCore.prototype.findPositionForNewNodeBottomLeft = function (width, height, bestY, bestX, data) {
            var bestNode = this.factory.newOne();
            //memset(bestNode, 0, sizeof(Rectangle));
            bestY = Number.MAX_VALUE;
            var rect;
            var topSideY;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    topSideY = rect.y + height;
                    if (topSideY < bestY || (topSideY === bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestY = topSideY;
                        bestX = rect.x;
                        bestNode.isRotated = false;
                    }
                }
                else if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    topSideY = rect.y + width;
                    if (topSideY < bestY || (topSideY === bestY && rect.x < bestX)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestY = topSideY;
                        bestX = rect.x;
                        bestNode.isRotated = true;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestShortSideFit = function (width, height, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            this.bestShortSideFit = Number.MAX_VALUE;
            this.bestLongSideFit = this.score2;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (shortSideFit < this.bestShortSideFit || (shortSideFit === this.bestShortSideFit && longSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        this.bestShortSideFit = shortSideFit;
                        this.bestLongSideFit = longSideFit;
                    }
                }
                var flippedLeftoverHoriz;
                var flippedLeftoverVert;
                var flippedShortSideFit;
                var flippedLongSideFit;
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    flippedLeftoverHoriz = Math.abs(rect.width - height);
                    flippedLeftoverVert = Math.abs(rect.height - width);
                    flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
                    flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
                    if (flippedShortSideFit < this.bestShortSideFit || (flippedShortSideFit === this.bestShortSideFit && flippedLongSideFit < this.bestLongSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        this.bestShortSideFit = flippedShortSideFit;
                        this.bestLongSideFit = flippedLongSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestLongSideFit = function (width, height, bestShortSideFit, bestLongSideFit, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestLongSideFit = Number.MAX_VALUE;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var longSideFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit === bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    longSideFit = Math.max(leftoverHoriz, leftoverVert);
                    if (longSideFit < bestLongSideFit || (longSideFit === bestLongSideFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestShortSideFit = shortSideFit;
                        bestLongSideFit = longSideFit;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.findPositionForNewNodeBestAreaFit = function (width, height, bestAreaFit, bestShortSideFit, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestAreaFit = Number.MAX_VALUE;
            var rect;
            var leftoverHoriz;
            var leftoverVert;
            var shortSideFit;
            var areaFit;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                areaFit = rect.width * rect.height - width * height;
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    leftoverHoriz = Math.abs(rect.width - width);
                    leftoverVert = Math.abs(rect.height - height);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit === bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    leftoverHoriz = Math.abs(rect.width - height);
                    leftoverVert = Math.abs(rect.height - width);
                    shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                    if (areaFit < bestAreaFit || (areaFit === bestAreaFit && shortSideFit < bestShortSideFit)) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestShortSideFit = shortSideFit;
                        bestAreaFit = areaFit;
                    }
                }
            }
            return bestNode;
        };
        /// Returns 0 if the two intervals i1 and i2 are disjoint, or the length of their overlap otherwise.
        MaxRectsCore.prototype.commonIntervalLength = function (i1start, i1end, i2start, i2end) {
            if (i1end < i2start || i2end < i1start) {
                return 0;
            }
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        };
        MaxRectsCore.prototype.contactPointScoreNode = function (x, y, width, height) {
            var score = 0;
            if (x === 0 || x + width === this.binWidth) {
                score += height;
            }
            if (y === 0 || y + height === this.binHeight) {
                score += width;
            }
            var rect;
            for (var i = 0; i < this.usedRectangles.length; i++) {
                rect = this.usedRectangles[i];
                if (rect.x === x + width || rect.x + rect.width === x) {
                    score += this.commonIntervalLength(rect.y, rect.y + rect.height, y, y + height);
                }
                if (rect.y === y + height || rect.y + rect.height === y) {
                    score += this.commonIntervalLength(rect.x, rect.x + rect.width, x, x + width);
                }
            }
            return score;
        };
        MaxRectsCore.prototype.findPositionForNewNodeContactPoint = function (width, height, bestContactScore, data) {
            var bestNode = this.factory.newOne();
            //memset(&bestNode, 0, sizeof(Rectangle));
            bestContactScore = -1;
            var rect;
            var score;
            for (var i = 0; i < this.freeRectangles.length; i++) {
                rect = this.freeRectangles[i];
                // Try to place the Rectangle in upright (non-flipped) orientation.
                if (rect.width >= width && rect.height >= height) {
                    score = this.contactPointScoreNode(rect.x, rect.y, width, height);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = width;
                        bestNode.height = height;
                        bestNode.data = data;
                        bestNode.isRotated = false;
                        bestContactScore = score;
                    }
                }
                if (this.allowRotations && rect.width >= height && rect.height >= width) {
                    score = this.contactPointScoreNode(rect.x, rect.y, height, width);
                    if (score > bestContactScore) {
                        bestNode.x = rect.x;
                        bestNode.y = rect.y;
                        bestNode.width = height;
                        bestNode.height = width;
                        bestNode.data = data;
                        bestNode.isRotated = true;
                        bestContactScore = score;
                    }
                }
            }
            return bestNode;
        };
        MaxRectsCore.prototype.splitFreeNode = function (freeNode, usedNode) {
            // Test with SAT if the Rectangles even intersect.
            if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
                usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y) {
                return false;
            }
            var newNode;
            if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
                    newNode = freeNode.cloneOne();
                    newNode.height = usedNode.y - newNode.y;
                    this.freeRectangles.push(newNode);
                }
                // New node at the bottom side of the used node.
                if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
                    newNode = freeNode.cloneOne();
                    newNode.y = usedNode.y + usedNode.height;
                    newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
                    this.freeRectangles.push(newNode);
                }
            }
            if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
                    newNode = freeNode.cloneOne();
                    newNode.width = usedNode.x - newNode.x;
                    this.freeRectangles.push(newNode);
                }
                // New node at the right side of the used node.
                if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
                    newNode = freeNode.cloneOne();
                    newNode.x = usedNode.x + usedNode.width;
                    newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
                    this.freeRectangles.push(newNode);
                }
            }
            return true;
        };
        MaxRectsCore.prototype.pruneFreeList = function () {
            for (var i = 0; i < this.freeRectangles.length; i++) {
                for (var j = i + 1; j < this.freeRectangles.length; j++) {
                    if (this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])) {
                        this.freeRectangles.splice(i, 1);
                        break;
                    }
                    if (this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])) {
                        this.freeRectangles.splice(j, 1);
                    }
                }
            }
        };
        MaxRectsCore.prototype.isContainedIn = function (a, b) {
            return a.x >= b.x && a.y >= b.y
                && a.x + a.width <= b.x + b.width
                && a.y + a.height <= b.y + b.height;
        };
        return MaxRectsCore;
    }());
    rectUtil.MaxRectsCore = MaxRectsCore;
    /**
     * MaxRects工具
     * @author featherJ
     *
     */
    var MaxRectsUtil = (function () {
        function MaxRectsUtil() {
        }
        MaxRectsUtil.packImages = function (rectangles, imageWidth, imageHeight, gap) {
            if (gap === void 0) { gap = 2; }
            rectangles.sort(function (a, b) {
                return (a.area > b.area) ? -1 : 1;
            });
            var results = [];
            var imageRectCores = [];
            var i = 0;
            var len = rectangles.length;
            var currentRect;
            var currentCore;
            var newRect;
            var j;
            var coreLen = 0;
            //遍历所有图片，如果图片大于最大尺寸，则单独为一组；否则遍历已经存在的组，如果找不到组合容纳，则创建新组容纳。
            for (; i < len; i++) {
                currentRect = rectangles[i];
                currentRect.orginWidth = currentRect.width;
                currentRect.orginWHeight = currentRect.height;
                currentRect.width = Math.min(imageWidth, currentRect.width + gap);
                currentRect.height = Math.min(imageHeight, currentRect.height + gap);
                // if(currentRect.width>imageWidth || currentRect.height >imageHeight){
                //  newGroup = [currentRect];
                //  results.push({maxWidth:0,maxHeight:0,imageGroups:newGroup});
                // }
                for (j = 0; j < coreLen; j++) {
                    currentCore = imageRectCores[j];
                    newRect = currentCore.insert(currentRect.width, currentRect.height, currentRect.data, MaxRectsUtil.layoutMath);
                    if (newRect.width > 0) {
                        break;
                    }
                    else {
                        newRect = null;
                    }
                }
                if (!newRect) {
                    currentCore = MaxRectsUtil.createMaxRectCore(MaxRectsUtil.calculater2(Math.max(currentRect.width, imageWidth)), MaxRectsUtil.calculater2(Math.max(currentRect.height, imageHeight)));
                    imageRectCores.push(currentCore);
                    coreLen++;
                    newRect = currentCore.insert(currentRect.width, currentRect.height, currentRect.data, MaxRectsUtil.layoutMath);
                }
                newRect.orginWidth = currentRect.orginWidth;
                newRect.orginWHeight = currentRect.orginWHeight;
            }
            //将容纳箱中的图片放进组中
            for (j = 0; j < coreLen; j++) {
                currentCore = imageRectCores[j];
                results.push({ maxWidth: 0, maxHeight: 0, imageGroups: currentCore.usedRectangles });
            }
            //将宽高恢复
            len = results.length;
            for (i = 0; i < len; i++) {
                var maxWidth = 0;
                var maxheight = 0;
                results[i].imageGroups.forEach(function (rect) {
                    rect.width = rect.orginWidth;
                    rect.height = rect.orginWHeight;
                    maxWidth = Math.max(maxWidth, rect.x + rect.width);
                    maxheight = Math.max(maxheight, rect.y + rect.height);
                });
                results[i].maxWidth = maxWidth;
                results[i].maxHeight = maxheight;
            }
            return results;
        };
        MaxRectsUtil.calculater2 = function (num) {
            var newNum = 2;
            while (num > newNum) {
                newNum = newNum << 1;
            }
            return newNum;
        };
        MaxRectsUtil.createMaxRectCore = function (w, h) {
            var core = new MaxRectsCore();
            core.setCanRotate(false);
            core.init(w, h);
            return core;
        };
        Object.defineProperty(MaxRectsUtil, "result", {
            /**
             * 得到合图结果 ，只有当resultType为'success'时，才有数据
             */
            get: function () {
                return MaxRectsUtil._result.concat();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectsUtil, "resultType", {
            /**
             * 得到合图结果类型，见 MaxRectsResultType
             * @return
             *
             */
            get: function () {
                return MaxRectsUtil._resultType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaxRectsUtil, "resultSize", {
            /**
             * 最终尺寸
             * @return
             *
             */
            get: function () {
                return MaxRectsUtil._resultSize;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 设置最大尺寸
         * @param maxWidth 最大宽度
         * @param maxHeight 最大高度
         *
         */
        MaxRectsUtil.setMaxSize = function (maxWidth, maxHeight) {
            if (maxWidth === void 0) { maxWidth = -1; }
            if (maxHeight === void 0) { maxHeight = -1; }
            MaxRectsUtil._maxWidth = maxWidth;
            MaxRectsUtil._maxHeight = maxHeight;
        };
        /**
         * 设置排序方式见MaxRectsSortType
         * @param type
         */
        MaxRectsUtil.setSortOn = function (type) {
            MaxRectsUtil.sortType = type;
        };
        /**
         * 设置间隔
         * @param gap
         *
         */
        MaxRectsUtil.setGap = function (gap) {
            if (gap === void 0) { gap = 0; }
            MaxRectsUtil._gap = gap;
        };
        /**
         * 设置是否可以旋转
         * @param value
         */
        MaxRectsUtil.setCanRotate = function (value) {
            MaxRectsUtil.maxRectsCore.setCanRotate(value);
        };
        /**
         *设置布局方式
         * @param v
         *
         */
        MaxRectsUtil.setLayoutMath = function (v) {
            MaxRectsUtil.layoutMath = v;
        };
        /**
         *设置布局过程中新对象的工厂实例，布局过程产生新对象时将从该工厂实例中获取新对象，默认：MaxRectangle
         * @param instance
         *
         */
        MaxRectsUtil.setFactoryInstance = function (instance) {
            MaxRectsUtil.maxRectsCore.factory = instance;
        };
        /**
         * 插入切片开始合图，需要保证每一个切片的面积都大于0
         * @param rectangles
         *
         */
        MaxRectsUtil.insertRectangles = function (rectangles) {
            MaxRectsUtil._result = null;
            //先过滤一遍碎图，看有没有尺寸为0的图
            var newRects = [];
            for (var i = 0; i < rectangles.length; i++) {
                if (rectangles[i].width > 0 && rectangles[i].height > 0) {
                    newRects.push(rectangles[i]);
                }
            }
            if (newRects.length !== rectangles.length) {
                MaxRectsUtil._resultType = MaxRectsResultType.SHEET_EMPTY;
                // logMsg('有图的尺寸不对，宽和高都不能为零');
                return;
            }
            // logMsg('加载了:'+rectangles.length+' 个图片');
            //增加间隙
            if (MaxRectsUtil._gap > 0) {
                for (i = 0; i < newRects.length; i++) {
                    newRects[i].width += MaxRectsUtil._gap;
                    newRects[i].height += MaxRectsUtil._gap;
                }
            }
            //得到碎图的最大宽，最大高，和最大面积
            MaxRectsUtil._maxW = 0;
            MaxRectsUtil._maxH = 0;
            var area = 0;
            for (i = 0; i < newRects.length; i++) {
                if (newRects[i].width > MaxRectsUtil._maxW) {
                    MaxRectsUtil._maxW = newRects[i].width;
                }
                if (newRects[i].height > MaxRectsUtil._maxH) {
                    MaxRectsUtil._maxH = newRects[i].height;
                }
                area += newRects[i].width * newRects[i].height;
            }
            // logMsg('maxW:'+MaxRectsUtil._maxW+' maxH:'+MaxRectsUtil._maxH+' area:'+area);
            //现将幂按照碎图的最大宽高做一次过滤
            MaxRectsUtil._w = 1;
            MaxRectsUtil._h = 1;
            while (Math.pow(2, MaxRectsUtil._w) < MaxRectsUtil._maxW) {
                MaxRectsUtil._w++;
            }
            while (Math.pow(2, MaxRectsUtil._h) < MaxRectsUtil._maxH) {
                MaxRectsUtil._h++;
            }
            // logMsg('第一次过滤 宽幂:'+  MaxRectsUtil._w+' 宽:'+Math.pow(2,  MaxRectsUtil._w)+' 高幂:'+  MaxRectsUtil._h+' 高:'+Math.pow(2,  MaxRectsUtil._h));
            MaxRectsUtil._baseW = MaxRectsUtil._w;
            MaxRectsUtil._baseH = MaxRectsUtil._h;
            while (Math.pow(2, MaxRectsUtil._w) * Math.pow(2, MaxRectsUtil._h) < area) {
                MaxRectsUtil.calculateNext();
            }
            MaxRectsUtil._baseW = MaxRectsUtil._w;
            MaxRectsUtil._baseH = MaxRectsUtil._h;
            // logMsg('第二次过滤 宽幂:'+  MaxRectsUtil._w+' 宽:'+Math.pow(2,  MaxRectsUtil._w)+' 高幂:'+  MaxRectsUtil._h+' 高:'+Math.pow(2,  MaxRectsUtil._h));
            if (MaxRectsUtil.sortType === MaxRectsSortType.AREA) {
                //按面积排序一遍
                for (i = 0; i < newRects.length; i++) {
                    for (var j = i; j < newRects.length; j++) {
                        if (newRects[i].height * newRects[i].width < newRects[j].height * newRects[j].width) {
                            var temp = newRects[i];
                            newRects[i] = newRects[j];
                            newRects[j] = temp;
                        }
                    }
                }
            }
            else if (MaxRectsUtil.sortType === MaxRectsSortType.SIZE) {
                if (MaxRectsUtil._maxW > MaxRectsUtil._maxH) {
                    //按宽排序一遍
                    for (i = 0; i < newRects.length; i++) {
                        for (j = i; j < newRects.length; j++) {
                            if (newRects[i].width < newRects[j].width) {
                                temp = newRects[i];
                                newRects[i] = newRects[j];
                                newRects[j] = temp;
                            }
                        }
                    }
                }
                else {
                    //按高排序一遍
                    for (i = 0; i < newRects.length; i++) {
                        for (j = i; j < newRects.length; j++) {
                            if (newRects[i].height < newRects[j].height) {
                                temp = newRects[i];
                                newRects[i] = newRects[j];
                                newRects[j] = temp;
                            }
                        }
                    }
                }
            }
            var finish = false;
            var n = 0;
            var tooBig = false;
            while (!finish) {
                var currentW = Math.pow(2, MaxRectsUtil._w);
                var currentH = Math.pow(2, MaxRectsUtil._h);
                var tempRectangles = newRects.concat();
                // logMsg(n+'次计算，'+'宽:'+currentW+' 高:'+currentH+'     '+'宽幂:'+  MaxRectsUtil._w+' 高幂:'+  MaxRectsUtil._h);
                MaxRectsUtil.maxRectsCore.init(currentW, currentH);
                MaxRectsUtil.maxRectsCore.insertGroup(tempRectangles, MaxRectsUtil.layoutMath);
                var results = MaxRectsUtil.maxRectsCore.usedRectangles;
                finish = true;
                var hasError = false;
                for (i = 0; i < results.length; i++) {
                    if (results[i].x === 0 && results[i].y === 0 && results[i].width === 0 && results[i].height === 0) {
                        hasError = true;
                        break;
                    }
                }
                if (hasError) {
                    MaxRectsUtil.calculateNext();
                    finish = false;
                }
                n++;
                if ((currentW > MaxRectsUtil._maxWidth && MaxRectsUtil._maxWidth > 0) ||
                    (currentH > MaxRectsUtil._maxHeight && MaxRectsUtil._maxHeight > 0)) {
                    finish = true;
                    tooBig = true;
                }
            }
            if (tooBig) {
                MaxRectsUtil._resultType = MaxRectsResultType.SHEET_TO_BIG;
                // logMsg('图太多了，最大尺寸都不够')
                return;
            }
            // logMsg('成功了'+'最终宽度:'+currentW+' 最终高度:'+currentH)
            MaxRectsUtil._resultSize.x = currentW;
            MaxRectsUtil._resultSize.y = currentH;
            MaxRectsUtil._resultType = MaxRectsResultType.SUCCESS;
            MaxRectsUtil._result = MaxRectsUtil.maxRectsCore.usedRectangles;
            if (MaxRectsUtil._gap > 0) {
                for (i = 0; i < MaxRectsUtil._result.length; i++) {
                    MaxRectsUtil._result[i].width -= MaxRectsUtil._gap;
                    MaxRectsUtil._result[i].height -= MaxRectsUtil._gap;
                    MaxRectsUtil._result[i].x += Math.floor(MaxRectsUtil._gap / 2);
                    MaxRectsUtil._result[i].y += Math.floor(MaxRectsUtil._gap / 2);
                }
            }
        };
        MaxRectsUtil.calculateNext = function () {
            if (MaxRectsUtil._maxW > MaxRectsUtil._maxH) {
                if (MaxRectsUtil._w === MaxRectsUtil._h) {
                    MaxRectsUtil._h++;
                    MaxRectsUtil._w = MaxRectsUtil._baseW;
                    return;
                }
                if (MaxRectsUtil._h > MaxRectsUtil._w + 1) {
                    MaxRectsUtil._w++;
                    return;
                }
                if (MaxRectsUtil._h === MaxRectsUtil._w + 1) {
                    MaxRectsUtil._w = MaxRectsUtil._h;
                    MaxRectsUtil._h = MaxRectsUtil._baseH;
                    return;
                }
                if (MaxRectsUtil._w > MaxRectsUtil._h + 1) {
                    MaxRectsUtil._h++;
                    return;
                }
                if (MaxRectsUtil._w === MaxRectsUtil._h + 1) {
                    MaxRectsUtil._h = MaxRectsUtil._w;
                    return;
                }
            }
            else {
                if (MaxRectsUtil._h === MaxRectsUtil._w) {
                    MaxRectsUtil._w++;
                    MaxRectsUtil._h = MaxRectsUtil._baseH;
                    return;
                }
                if (MaxRectsUtil._w > MaxRectsUtil._h + 1) {
                    MaxRectsUtil._h++;
                    return;
                }
                if (MaxRectsUtil._w === MaxRectsUtil._h + 1) {
                    MaxRectsUtil._h = MaxRectsUtil._w;
                    MaxRectsUtil._w = MaxRectsUtil._baseW;
                    return;
                }
                if (MaxRectsUtil._h > MaxRectsUtil._w + 1) {
                    MaxRectsUtil._w++;
                    return;
                }
                if (MaxRectsUtil._h === MaxRectsUtil._w + 1) {
                    MaxRectsUtil._w = MaxRectsUtil._h;
                    return;
                }
            }
        };
        MaxRectsUtil.maxRectsCore = new MaxRectsCore();
        MaxRectsUtil._maxWidth = -1;
        MaxRectsUtil._maxHeight = -1;
        /**
         * 是否输出信息
         */
        MaxRectsUtil.isLog = true;
        MaxRectsUtil._resultSize = new resModel.Point(0, 0);
        MaxRectsUtil.sortType = MaxRectsSortType.AREA;
        MaxRectsUtil._gap = 0;
        MaxRectsUtil.layoutMath = FreeRectangleChoiceHeuristic.BottomLeftRule;
        MaxRectsUtil._resultType = '';
        //宽和搞的幂数
        MaxRectsUtil._w = 1;
        MaxRectsUtil._h = 1;
        MaxRectsUtil._maxW = 0;
        MaxRectsUtil._maxH = 0;
        MaxRectsUtil._baseW = 1;
        MaxRectsUtil._baseH = 1;
        return MaxRectsUtil;
    }());
    rectUtil.MaxRectsUtil = MaxRectsUtil;
})(rectUtil || (rectUtil = {}));


var ResFileHelper = (function () {
    function ResFileHelper() {
    }
    ResFileHelper.exportJsonObject = function (resList, groupList) {
        var resArr = [];
        var j;
        for (var i = 0; i < resList.length; i++) {
            var url = resList[i].showUrl;
            url = url.replace(/\\/g, '/');
            if (url.charAt(0) === '/') {
                url = url.slice(1, url.length);
            }
            var resObj;
            if (resList[i].type === 'image' && (resList[i].x !== 0 || resList[i].y !== 0 || resList[i].w !== 0 || resList[i].h !== 0)) {
                resObj = { url: url, type: resList[i].type, name: resList[i].getName(),
                    scale9grid: resList[i].x + ',' + resList[i].y + ',' + resList[i].w + ',' + resList[i].h
                };
            }
            else if (resList[i].type === 'sound' && resList[i].other) {
                resObj = { url: url, type: resList[i].type, name: resList[i].getName(),
                    soundType: resList[i].other
                };
            }
            else {
                resObj = { url: url, type: resList[i].type, name: resList[i].getName() };
            }
            if (resList[i].type === resModel.ResType.TYPE_SHEET) {
                if (resList[i].subList) {
                    var subkeys = '';
                    for (j = 0; j < resList[i].subList.length; j++) {
                        subkeys += resList[i].subList[j].getName() + ',';
                    }
                    if (subkeys.charAt(subkeys.length - 1) === ',') {
                        subkeys = subkeys.slice(0, subkeys.length - 1);
                    }
                    resObj.subkeys = subkeys;
                }
            }
            resArr.push(resObj);
        }
        var groupArr = [];
        for (i = 0; i < groupList.length; i++) {
            var tmpKeys = '';
            for (j = 0; j < groupList[i].childList.length; j++) {
                tmpKeys += groupList[i].childList[j].getName() + ',';
            }
            if (tmpKeys.length > 0) {
                tmpKeys = tmpKeys.slice(0, tmpKeys.length - 1);
            }
            var groupObj = { keys: tmpKeys, name: groupList[i].groupName };
            groupArr.push(groupObj);
        }
        var jsonObject = { groups: groupArr, resources: resArr };
        return jsonObject;
    };
    return ResFileHelper;
}());






var arguments = process.argv.splice(2);
console.log('所传递的参数是：', arguments);
if(arguments.length != 2){
    console.log("Two parameters are required, frist is the project path, second is the relaviate publish path");
    console.log("for example node index.js ~/Desktop/SSMJDev/SSMJDev/h5/SSMJH5_2 bin-release/web/b1/resource/");
    return;
}
function logMsg() {
    var msg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msg[_i - 0] = arguments[_i];
    }
    var s = msg.join(',');
    console.log(s);
    // output(s);
}


 try {
               
                var model = new resModel.ResModel(arguments[0], arguments[1]);
                model.useClip = false;
                model.decodeResourceConfig(pathJoin(arguments[0], 'resource/default.res.json'));
                model.decodePackConfig();
                model.publicByAuto(2048, 2048, {preload:"true"}, function () {
                    logMsg('资源发布成功！');
                    publishComplete(true);
                }, function () {
                    logMsg('资源发布失败！');
                    publishComplete(false);
                });
            }
            catch (e) {
                logMsg('error:' + e);
            }
