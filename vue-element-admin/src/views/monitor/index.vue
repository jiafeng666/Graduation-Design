<template>
  <div class="chart-container">
    <div id="chartId" style="width: 100%; height: 100%;" />
  </div>
</template>

<script>
import echarts from 'echarts'
import shareStore from "@/store/modules/tasksTable"
import { parseTime } from '@/utils'

export default {
  name: 'MixChart',
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById("chartId"));
      this.renderChart();
    },
    renderChart() {
      const data = shareStore.state.tasksTable;
      const seriesData = [];
      const labelArr = [];
      data.forEach(d => {
        const time = parseTime(d.startTime, "{y}-{m}-{d}");
        if(!labelArr.includes(time)) {
          labelArr.push(time);
        }
        seriesData[labelArr.length-1] = (seriesData[labelArr.length-1] || 0) + d.total;
      });
      // 图形样式配置
      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '模板每日采集量',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          top: 150,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: labelArr
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }],
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [
            0
          ],
          bottom: 30,
          start: 10,
          end: 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#d3dee5'

          },
          textStyle: {
            color: '#fff' 
          },
          borderColor: '#90979c'
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        series: [{
          name: '总数',
          type: 'bar',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            normal: {
              color: 'rgba(255,144,128,1)',
              label: {
                show: true,
                textStyle: {
                  color: '#fff'
                },
                position: 'top',
                formatter(p) {
                  return p.value > 0 ? p.value : ''
                }
              }
            }
          },
          data: seriesData
        }]
      });
    },
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
}
</style>
