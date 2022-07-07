import {FileLoader} from "three";
import {DefaultLoadingManager} from "three";

/**
 * 处理光的漫反射/环境光,球谐函数系数
 * @param jsonData
 * @returns {number[]}
 */
function sphericalHarmonicsCoefficients(jsonData) {
    debugger
    // 拷贝元素，从0到26个元素,球谐波离线预计算的系数因子
    var data = jsonData.slice(0, 27);
    // 我猜应该是9个系数
    // 通过预先计算出的常数来优化漫反射
    // 伴随勒让德多项式 常量
    var a = 1 / (2 * Math.sqrt(Math.PI));
    var e = -(.5 * Math.sqrt(3 / Math.PI));
    var i = -e;
    var abcd = e;
    var knobHalf = .5 * Math.sqrt(15 / Math.PI);
    var currentRelations = -knobHalf;
    var c = .25 * Math.sqrt(5 / Math.PI);
    var addedRelations = currentRelations;
    var l = .25 * Math.sqrt(15 / Math.PI);
    var array = [a, a, a, e, e, e, i, i, i, abcd, abcd, abcd, knobHalf, knobHalf, knobHalf, currentRelations, currentRelations, currentRelations, c, c, c, addedRelations, addedRelations, addedRelations, l, l, l];
    return array.map(function(position, i) {
        return position * data[i];
    });
}
class FileLoaderUtils extends FileLoader{
    constructor(data){
        super();
        this.manager = undefined !== data ? data : DefaultLoadingManager;
    }
    load(url, loadCallback, onProgress, onError) {
        super.load(url, function(data) {
            const jsonData = JSON.parse(data);
            const x = sphericalHarmonicsCoefficients(jsonData);
            loadCallback(x);
        }, onProgress, onError);
    }
}

export default FileLoaderUtils
