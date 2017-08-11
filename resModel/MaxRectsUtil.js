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
        // 	var usedSurfaceArea:number = 0;
        // 	for(var i:number = 0; i < this.usedRectangles.length; i++)
        // 		usedSurfaceArea += this.usedRectangles[i].width * this.usedRectangles[i].height;
        // 	return usedSurfaceArea / (this.binWidth *this. binHeight);
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
                // 	newGroup = [currentRect];
                // 	results.push({maxWidth:0,maxHeight:0,imageGroups:newGroup});
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
