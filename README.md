# 无限小镇
这是一个使用threejs实现的无限小镇的WEBGL示例程序

根据无限城镇的示例代码逆向的ES6 模块源码

该工程现在使用的技术栈有：
1. [ ]    "@tweenjs/tween.js": "^17.4.0",
2. [ ]    "babel-polyfill": "^6.26.0",
3. [ ]    "bluebird": "^3.5.5",
4. [ ]    "es6-promise": "^4.2.8",
5. [ ]    "jquery": "^3.4.1",
6. [ ]    "jquery-mousewheel": "^3.1.13",
7. [ ]    "lodash": "^4.17.14",
8. [ ]    "seedrandom": "^3.0.1",
9. [ ]    "three-orbit-controls": "^82.1.0",
10. [ ]    "valid-url": "^1.0.9"


分别介绍一下上述模块的关键作用

1. [ ]    "@tweenjs/tween.js": "^17.4.0",
    实现动画效果,如场景的移动、缩放、旋转等等
2. [ ]    "babel-polyfill": "^6.26.0",
    实现ES6的兼容
3. [ ]    "bluebird": "^3.5.5",
    实现Promise的兼容
4. [ ]    "es6-promise": "^4.2.8",
    实现ES6 Promise的兼容
5. [ ]    "jquery": "^3.4.1",
    实现jQuery的兼容
6. [ ]    "jquery-mousewheel": "^3.1.13",
    鼠标滚轮的支持
7. [ ]    "lodash": "^4.17.14",
    工具类库
8. [ ]    "seedrandom": "^3.0.1",
    实现随机数的支持，如随机生成车、云、地形等等
9. [ ]    "three-orbit-controls": "^82.1.0",
    实现控制相机的兼容
10. [ ]    "valid-url": "^1.0.9"
    url有效性的检测


## 安装

```bash
npm install
```

一些有趣的地方、车辆检测、离开暂停、进入开始、无限视角

