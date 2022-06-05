# 基于 vue-element-admin 的爬虫管理平台的设计与实现
本次项目采用前后端分离设计，前端使用 vue-element-admin 进行开发，后端使用 express 封装数据接口

## 后端 —— express-spider
在 express_router 下包含有一个主路由以及博客、论坛、住房、新闻、电商等5个爬虫主题，每个主题下又包含有相应的主流平台的爬虫模板和一个主题路由，在主题路由内封装好各个模板的接口，爬虫模板则将采集到的数据封装好，做为相应接口的响应内容。在主路由内对各个主题路由进行注册，当前端页面进行请求的时候就可以响应数据了。大致流程如下：
![image](https://user-images.githubusercontent.com/80165334/172040820-0409cb55-cf39-4640-9051-5a6dc670325c.png)


## 前端
### 首页
首页中包含一个搜索框，输入模板名称之后，遍历出路由作为该搜索框的下拉项，点击选项则可以跳转到相应的模板界面
![image](https://user-images.githubusercontent.com/80165334/172040948-30ab6eaa-dbc7-40a9-88b9-42fd72da7ebb.png)


### 模板页面
利用 vue 指令 v-model 获取到输入的参数，再通过 v-on 指令将 click 事件绑定在启动按钮上，点击启动之后就会将参数拼接成 express 封装的接口 url，再对该接口进行请求便可以拿到数据，拿到数据之后进行封装并存储到 store，方便页面间共享数据，为了下次启动项目还有之前启动模板的数据记录，store使用 VuexPresistence 插件实现了持久化，该插件会将数据存到 localStorage
![image](https://user-images.githubusercontent.com/80165334/172040967-ece62bfc-5d97-4448-bcbc-4b30a79e4e57.png)



### 任务列表页
从 store 内将之前封装好的数据取出进行展示，将时间戳参数设计为一个主键，点击数据量单元格，携带时间参数通过路由跳转到数据详情页，点击删除按钮时，就会遍历 store ，将store 内时间戳与该任务时间戳相同的数据删除
![image](https://user-images.githubusercontent.com/80165334/172040972-1c2886f0-75ac-4075-ac69-439ef7ced668.png)



### 数据详情页
监听任务列表页带过来的时间戳参数，根据时间戳从 store 内取出相应数据进行展示。当发生变化时，就重新从 store 里边拉取对应时间戳的数据，将获取到的数据，循环遍历出所有的 key，在表格列的循环中，根据 key 名去取出对应的 value
![image](https://user-images.githubusercontent.com/80165334/172040981-fe04c8f6-5d9e-41d2-ac9e-2ecce82948c6.png)


### 数据监控页
拿到 store 的数据，格式化时间戳为年月日，创建两个数组：坐标数组和数据数组。循环遍历 store 的数据，①当坐标数组中没有这个日期，就往坐标数组塞进这个日期，②根据坐标数组的长度，往数据数组对应下标位置累加采集到的数据条数，即对应日期所有模板采集到的数据条数。将坐标数组赋给 x 轴，数据数组赋给 series 的 data，即可绘制图形
![image](https://user-images.githubusercontent.com/80165334/172040987-46b5a336-a42b-4bb8-9ac8-4d1a175de748.png)


