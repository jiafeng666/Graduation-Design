<template>
  <div class="container">
    <div style="height: 250px; width: 100%;">
      <el-image :src="imgSrc" fit="contain" style="height: 100%; width: 100%;" />
      <el-divider>采集位置</el-divider>
      <el-card class="box-card card-container">
        <div slot="header" class="clearfix">
          模板信息
        </div>
        <div class="form-row">
          <span class="form-label">模板名称：</span> 豆瓣影片详情爬取
        </div>
        <div class="form-row">
          <span class="form-label">采集字段：</span> 影片名，链接，制片国家/地区，首映时间，主演，导演，编剧，制片人，类型，剧情介绍
        </div>
        <div class="form-row">
          <span class="form-label">关键词示例：</span> https://movie.douban.com/subject/1292052/ (影片url)
        </div>
        <form action="form_action.asp" method="get">
          <span class="form-label">关键词: </span>
          <el-input v-model.trim="keyword" placeholder="请输入关键词" class="input-box" />
          <el-button type="primary" @click.prevent="crawl">启动</el-button>
        </form>
      </el-card>
    </div>
  </div>
</template>

<script>
import img from '../img/douban_movie.png'
import axios from 'axios'
import shareStore from '@/store/modules/tasksTable'

export default {
  name: 'SplitpaneDemo',
  components: {},
  data() {
    return {
      imgSrc: img,
      keyword: ''
    }
  },
  methods: {
    crawl() {
      this.$message.success('任务已启动，详情请往“我的任务”页面查看')
      axios.get(`http://localhost:8080/dbmovie?key=${this.keyword}`).then(res => {
        const taskData = {
          templateTitle: '豆瓣影片详情爬取',
          templateTheme: '论坛',
          startTime: new Date().getTime(),
          total: res.data.data.length,
          data: res.data.data
        }
        shareStore.dispatch('addTasksTableData', taskData)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    height: calc(100vh - 110px);
    margin: 10px;
    .card-container {
      width: 80%;
      margin: 0 auto;
    }
    .form-row {
      margin: 15px 0;
    }
    .form-label {
      font-weight: 600;
    }
    .input-box {
      width: 240px;
      margin: 0 10px;
    }
  }
</style>
