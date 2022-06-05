<template>
  <div class="app-container">

    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table :data="list" border fit highlight-current-row tooltip-effect="light">
      <el-table-column type="index" width="80" align="center" />
      <el-table-column
        v-for="(item, index) in fields"
        :key="index"
        :label="item"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row[item] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
import shareStore from '@/store/modules/tasksTable'

export default {
  name: 'ExportExcel',
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      list: null,
      fields: [],
      activatedFlag: true
    }
  },
  activated() {
    this.activatedFlag = true
  },
  deactivated() {
    this.activatedFlag = false
  },
  watch: {
    '$route.query.startTime': {
      handler: function(newVal, oldVal) {
        if (this.activatedFlag) {
          const task = shareStore.state.tasksTable.find(d => d.startTime === parseInt(newVal))
          this.fields = Object.keys(task.data[0])
          this.list = task.data
        }
      },
      immediate: true
    }
  },
  methods: {
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.fields
        const filterVal = this.fields
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
