<template>
  <el-table :data="tasksTableData" style="width: 100%; padding-top: 15px;">
    <el-table-column type="index" width="80" align="center" />
    <el-table-column prop="templateTitle" label="任务名" />
    <el-table-column prop="templateTheme" label="主题分类" />
    <el-table-column label="采集状态" align="center">
      <template slot-scope="{row}">
        <el-tag style="cursor: pointer;" @click="handleToDetail(row.startTime, row.total)">采集到{{ row.total }}条数据</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="采集时间" align="center">
      <template slot-scope="{row}">
        <i class="el-icon-time" />
        {{ transformTime(row.startTime) }}
      </template>
    </el-table-column>
    <el-table-column label="更多操作" align="center">
      <template slot-scope="{row}">
        <el-button type="danger" plain icon="el-icon-delete" size="small" @click="handleDelete(row.startTime)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import shareStore from '@/store/modules/tasksTable'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
    }
  },
  computed: {
    tasksTableData() {
      return shareStore.state.tasksTable
    }
  },
  methods: {
    transformTime(timeUsec) {
      const date = new Date(timeUsec)
      return parseTime(date)
    },
    handleToDetail(timeUsec, total) {
      if (total <= 0) {
        return
      }
      this.$router.push({
        path: '/excel/export-excel',
        query: {
          startTime: timeUsec
        }
      })
    },
    handleDelete(timeUsec) {
      this.$confirm('确认删除该条任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        shareStore.dispatch('deleteTasksTableData', timeUsec)
        this.$message.success('删除成功！')
      }).catch(() => {
        this.$message.info('取消删除！')
      })
    }
  }
}
</script>
