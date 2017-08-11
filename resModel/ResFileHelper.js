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
