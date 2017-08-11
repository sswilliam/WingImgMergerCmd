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
            // 	//通过打包配置得到需要被打包的图像资源，此函数会创建好key值和compress值
            //     logMsg('createPackIamgeWithKeyAndCompress...');
            // 	var packImages:ImageRes[] = this.createPackIamgeWithKeyAndCompress(packConfig);
            // 	//修复图像列表内的url属性和scale9Grid属性
            //     // logMsg('fixImagesUrlAndScale9Grid...');
            // 	//补全images对应的图像
            //     logMsg('loadImages...');
            // 	this.loadImages(packConfig.sourcePath,packImages,(success:boolean)=>{
            //         if(!success)
            // 		{
            // 			if(onError !== null)
            // 			{
            // 				onError();
            // 			}
            // 			return;
            // 		}
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
            // 			{
            //                 onError();
            // 			}
            //             return;
            //         }
            //         else
            //         {
            //            this. finalPublish(
            // 				packConfig.sourcePath,
            // 				pathJoin(this._workspace, this.targerDir),
            // 				packConfig.publishCopyAll,
            // 				packConfig.cleanPublishPath,
            // 				packConfig.addCrc,
            // 				this._resourcePath,
            // 				readJson(this._resourcePath),
            // 				packGroups
            // 			);
            // 			writeJson(this._packPath, packConfig);
            // 			if(onComplete)
            // 			{
            // 				onComplete();
            // 			}
            //         }
            //     });
            // }
            /**
             * 根据是否压缩九宫格，重新修改bitmapData数据以及scale9Grid数据
             * @param images
             */
            // private  fixCompress(images:ImageRes[]):void
            // {
            // 	images.forEach((image:ImageRes)=>{
            // 		if(image.scale9Grid && image.compress)
            // 		{
            // 			var scale9GridBitmap:Scale9GridBitmap = new Scale9GridBitmap();
            // 			var oldBitmapData:BitmapData = image.bitmapData;
            // 			scale9GridBitmap.bitmapData = image.bitmapData;
            // 			var scale9Grid:Rectangle = new Rectangle();
            // 			scale9Grid.left = image.scale9Grid.x;
            // 			scale9Grid.top = image.scale9Grid.y;
            // 			scale9Grid.right = image.bitmapData.width-image.scale9Grid.x-image.scale9Grid.width;
            // 			scale9Grid.bottom = image.bitmapData.height-image.scale9Grid.y-image.scale9Grid.height;
            // 			scale9GridBitmap.scale9Grid = scale9Grid;
            // 			scale9GridBitmap.updateView();
            // 			var compressW:int = image.bitmapData.width-image.scale9Grid.width+2;
            // 			var compressH:int = image.bitmapData.height-image.scale9Grid.height+2;
            // 			scale9GridBitmap.width = compressW;
            // 			scale9GridBitmap.height = compressH;
            // 			var newBitmapData:BitmapData = new BitmapData(compressW,compressH,true,0);
            // 			newBitmapData.draw(scale9GridBitmap);
            // 			var newScale9Grid:Rectangle = new Rectangle(image.scale9Grid.x,image.scale9Grid.y,2,2);
            // 			image.bitmapData = newBitmapData;
            // 			image.scale9Grid = newScale9Grid;
            // 			image.sourceRect.width = image.sourceRect.width-(oldBitmapData.width-compressW);
            // 			image.sourceRect.height = image.sourceRect.height-(oldBitmapData.height-compressH);
            // 		}
            // 	});
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
                    var packGap = 2;
                    for (i = len - 1; i >= 0; i--) {
                        image = packImages[i];
                        if (image.bitWidth <= maxImageWidth && image.bitHeight <= maxImageHeight) {
                            getImageRects(image.groupName).push(new rectUtil.MaxRectangle(0, 0, image.bitWidth, image.bitHeight, image));
                        }
                    }
                    var packGroups = [];
                    len = allImageLib.length;
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
            //新的根目录
            var newRootPath = publishPath;
            //合并完成的会放到这个文件夹里面
            var targetGroupFolder = this.getFileName('packs', newRootPath);
            var targetGroupPath = newRootPath + targetGroupFolder + '/';
            //源目录中所有文件的列表
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
                    var sheetSprite = document.createElement('canvas');
                    sheetSprite.width = packW;
                    sheetSprite.height = packH;
                    var sheetSpritectx = sheetSprite.getContext('2d');
                    var subKeys = [];
                    var imagesLen = images.length;
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
                        sheetSpritectx.drawImage(newBitmap, 0, 0, newBitmap.width, newBitmap.height, image.packRect.x, image.packRect.y, image.packRect.width, image.packRect.height);
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
                    var sheetPngBytes = packUtil.canvasImportPng(sheetSprite, packW, packH);
                    var jsonImgUrl;
                    if (addCrc) {
                        var sheetPngCrc = CRC32Util.getCRC32(sheetPngBytes).toString(16);
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
                        saveBase64(jsonImgUrl, sheetPngBytes);
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
            for (i = 0; i < ress.length; i++) {
                var sourceUrl = ress[i].locolUrl;
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
            // 	for(i= 0;i<sourceFiles.length;i++)
            // 	{
            // 		var fromPath:string = FileUtil.escapePath(sourceFiles[i]);
            // 		var targetPath:string = fromPath.replace(sourcePath,publishPath)
            // 		copyFile(fromPath,targetPath)
            // 	}
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
                // logMsg('图片加载中：'+imageUrl)
                readImageToDataUrl(imageUrl, function (data) {
                    if (data) {
                        var img = document.createElement('img');
                        img.onload = function () {
                            img.onload = null;
                            img.onerror = null;
                            if (tempThis.useClip) {
                                packUtil.clipImageByRes(imageRes, img, loadnext.bind(tempThis));
                            }
                            else {
                                imageRes.sourceRect = new resModel.Rectangle(0, 0, img.width, img.height);
                                loadnext();
                            }
                        };
                        img.onerror = function () {
                            logMsg('图片格式错误：' + imageUrl);
                            img.onload = null;
                            img.onerror = null;
                            success = false;
                            loadnext();
                        };
                        imageRes.bitmapData = img;
                        img.src = data;
                    }
                    else {
                        logMsg('图片加载失败：' + imageUrl);
                        success = false;
                        loadnext();
                    }
                });
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
