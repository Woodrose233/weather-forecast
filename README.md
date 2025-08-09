# 项目：设计天气预报网页

效果请访问：https://woodrose233.github.io/weather-forecast/weather

## 设计目标
1. 双端适配
2. UI自主设计
3. 实现定位和自主选择位置（需要学习）
4. 根据位置调取api，获得数据
5. 首先显示当前天气和温湿度、空气质量等信息
6. 下栏使用横线滚条显示24小时预报
7. 再下栏使用横向滚条显示14天预报
8. 再一栏显示活动建议

## 目标总结
+ 使用共计4个行内块元素
+ 适配，根据设备长宽比自主选择展示策略
+ 实现与api的交互，以及横线滚条
+ 优化UI

---

## 设计阶段

**前言**： 本项目纯纯练手，无技术含量。本人对于前端知识掌握不牢，必须边学边做，下面的日志中或许会出现许多令人啼笑皆非的乐子，请谅解。

---
**2025/8/3**

首先确定项目结构。本项目将会使用HTML、CSS、JS完全分离的文档编写方法。所有图像素材会存入文件夹"pictures"中，以供调用。为了调试方便，图像素材暂时不进行准备，等待后期导入。

1. 新建weather.html，设计4个基础的行内块元素

**2025/8/7**

疏忽了文档的更新。目前的状况：
1. 基本的UI显示已经完成。
2. 通过Deepseek学习到了一些网页设计知识，可以在之后使用
3. 已经获取了IP地址定位和天气预报的API
4. 开始获取行政区划-编码表

**2025/8/8**
1. 优化了UI显示，正在设计搜索城市的逻辑
2. flex显示是CSS中非常重要的内容，刚刚学到了一个展示方式 justify-content: space-between;
这个展示方式通过让盒子中的元素相距最远，实现了标题与关闭按钮的排版：
![alt text](noteImages\note1_space_between.png)

**2025/8/9**
1. 高德天气api格式：https://restapi.amap.com/v3/weather/weatherInfo?city=110101&key=<用户key>
2. 我的key：743825297c9d0da6e7188252624e80ac 随便玩吧，就是个练手的
3. 拼接：https://restapi.amap.com/v3/weather/weatherInfo?city=110101&extensions=all&key=743825297c9d0da6e7188252624e80ac
4. 大D老师的api调用指导：
    ```JavaScript
    fetch('https://api.example.com/data.json')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```
5. 同时，在JS文件夹中有调用实时天气（不填写extensions）和调用预报天气（extensions=all）后的JSON样例

**2025/8/9 16:50**

截至目前，基本上完成了天气预报的主体设计。

![alt text](noteImages\note2_web_example.png)

目前需要完善的是：
+ 定位搜索的实现
+ 图标的设计
+ 推荐函数的完善
+ CSS的结构优化
+ UI的优化
