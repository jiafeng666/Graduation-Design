<template>
  <div class="container">
    <div style="height: 280px; width: 100%;">
      <el-image :src="imgSrc" fit="contain" style="height: 100%; width: 100%;" />
      <el-divider>采集位置</el-divider>
      <el-card class="box-card card-container">
        <div slot="header" class="clearfix">
          模板信息
        </div>
        <div class="form-row">
          <span class="form-label">模板名称：</span> 腾讯新闻要闻爬取
        </div>
        <div class="form-row">
          <span class="form-label">采集字段：</span> 标题，链接，类型，媒体，发布时间，图片，标签
        </div>
        <form action="form_action.asp" method="get">
          <el-button type="primary" @click.prevent="crawl">启动</el-button>
        </form>
      </el-card>
    </div>
  </div>
</template>

<script>
import img from './img/qqnews.png'
import axios from 'axios'
import shareStore from '@/store/modules/tasksTable'

export default {
  name: 'SplitpaneDemo',
  components: {},
  data() {
    return {
      imgSrc: img
    }
  },
  methods: {
    crawl() {
      this.$message.success('任务已启动，详情请往“我的任务”页面查看')
      axios.get('http://localhost:8080/qqnews').then(res => {
        const taskData = {
          templateTitle: '腾讯新闻要闻爬取',
          templateTheme: '新闻',
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
