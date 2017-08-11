var packUtil;
(function (packUtil) {
    var canvas = document.createElement('canvas');
    var canvas2drender = canvas.getContext('2d');
    function clipImageByRes(resvo, image, cb) {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas2drender.clearRect(0, 0, image.width, image.height);
        canvas2drender.drawImage(image, 0, 0);
        var inputData = canvas2drender.getImageData(0, 0, image.width, image.height);
        var result = clipImageByData(inputData);
        canvas.width = result.clipw;
        canvas.height = result.cliph;
        canvas2drender.clearRect(0, 0, result.clipw, result.cliph);
        canvas2drender.putImageData(result.image, 0, 0);
        var newimg = document.createElement('img');
        resvo.bitmapData = newimg;
        resvo.sourceRect = new resModel.Rectangle(result.clipx, result.clipy, image.width, image.height);
        newimg.onload = function () {
            cb();
            // var testcanvas:HTMLCanvasElement = document.getElementById('test') as HTMLCanvasElement;
            // testcanvas.width = newimg.width;
            // testcanvas.height = newimg.height;
            // var testcanvas2drender = testcanvas.getContext('2d');
            // testcanvas2drender.drawImage(newimg,0,0);
        };
        var str = canvasImportPngBase64(canvas, result.clipw, result.cliph);
        newimg.src = str;
    }
    packUtil.clipImageByRes = clipImageByRes;
    function clipImageByData(input) {
        var w = input.width;
        var h = input.height;
        var minLeft = w;
        var maxRight = 0;
        var minTop = h;
        var maxBottom = 0;
        var data = input.data;
        for (var yIndex = 0; yIndex < h; yIndex++) {
            for (var xIndex = 0; xIndex < minLeft; xIndex++) {
                if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
                    minLeft = xIndex;
                    break;
                }
            }
            for (xIndex = w - 1; xIndex >= maxRight; xIndex--) {
                if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
                    maxRight = xIndex;
                    break;
                }
            }
        }
        for (xIndex = 0; xIndex < w; xIndex++) {
            for (yIndex = 0; yIndex < minTop; yIndex++) {
                if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
                    minTop = yIndex;
                    break;
                }
            }
            for (yIndex = h - 1; yIndex >= maxBottom; yIndex--) {
                if (getImageAlpha(data, xIndex, yIndex, w) > 0) {
                    maxBottom = yIndex;
                    break;
                }
            }
        }
        var clipx = Math.min(minLeft, maxRight);
        var clipy = Math.min(minTop, maxBottom);
        var clipw = Math.abs(maxRight - minLeft) + 1;
        var cliph = Math.abs(maxBottom - minTop) + 1;
        var resultImage = canvas2drender.createImageData(clipw, cliph);
        for (yIndex = 0; yIndex < cliph; yIndex++) {
            for (xIndex = 0; xIndex < clipw; xIndex++) {
                var toIndex = getImageIndex(xIndex, yIndex, clipw);
                var fromIndex = getImageIndex(xIndex + clipx, yIndex + clipy, w);
                resultImage.data[toIndex] = data[fromIndex];
                resultImage.data[toIndex + 1] = data[fromIndex + 1];
                resultImage.data[toIndex + 2] = data[fromIndex + 2];
                resultImage.data[toIndex + 3] = data[fromIndex + 3];
            }
        }
        return { image: resultImage, clipx: clipx, clipy: clipy, clipw: clipw, cliph: cliph };
    }
    packUtil.clipImageByData = clipImageByData;
    function getImageIndex(xIndex, yIndex, w) {
        return (xIndex + yIndex * w) * 4;
    }
    packUtil.getImageIndex = getImageIndex;
    function getImageAlpha(data, xIndex, yIndex, w) {
        return data[(xIndex + yIndex * w) * 4 + 3];
    }
    packUtil.getImageAlpha = getImageAlpha;
    function canvasImportPng(canvas, width, height) {
        var w = canvas.width, h = canvas.height;
        if (!width) {
            width = w;
        }
        if (!height) {
            height = h;
        }
        var retCanvas = document.createElement('canvas');
        var retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        var str = retCanvas.toDataURL('image/png');
        ;
        str = str.replace('data:image/png;base64,', '');
        // str = str.replace( ' ' , '+');
        return str;
    }
    packUtil.canvasImportPng = canvasImportPng;
    function canvasImportPngBase64(canvas, width, height) {
        var w = canvas.width, h = canvas.height;
        if (!width) {
            width = w;
        }
        if (!height) {
            height = h;
        }
        var retCanvas = document.createElement('canvas');
        var retCtx = retCanvas.getContext('2d');
        retCanvas.width = width;
        retCanvas.height = height;
        retCtx.drawImage(canvas, 0, 0, w, h, 0, 0, width, height);
        var str = retCanvas.toDataURL('image/png');
        ;
        return str;
    }
    packUtil.canvasImportPngBase64 = canvasImportPngBase64;
})(packUtil || (packUtil = {}));
