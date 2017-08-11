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
                return this.bitmapData.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ImageRes.prototype, "bitHeight", {
            get: function () {
                return this.bitmapData.height;
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
