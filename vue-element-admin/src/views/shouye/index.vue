<template>
  <div class="g-bg">
    <div class="content-box">
      <div><strong>基于 vue-element-admin 和 express 开发的的爬虫系统</strong></div>
      <br>
      <div class="search-input-row">
        <el-select
          ref="headerSearchSelect"
          v-model="search"
          :remote-method="querySearch"
          filterable
          default-first-option
          remote
          placeholder="输入模板进行搜素"
          class="search-input"
          @change="change"
        >
          <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
        </el-select>
      </div>
    </div>
    <github-corner class="github-corner" />
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner';
import Fuse from 'fuse.js';
import path from 'path';

export default{
  name: "Index",
  components: {
      GithubCorner
  },
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    change(val) {
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }

        const data = {
          path: path.resolve(basePath, router.path),
          title: [...prefixTitle]
        }

        if (router.meta && router.meta.title) {
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.g-bg {
  position: relative;
  background: url('./img/bg.png') no-repeat;
  background-size:100% 100%;
  width: 100vw;
  height: calc(100vh - 84px);

  .content-box {
    position: absolute;
    top: 35%;
    text-align: center;
    margin-left: -8%;
    height: 220px;
    width: 100%;
    z-index: 2022;
    color: #ffffff;
    font-size: 24px;
    font-weight: bold;
  }
  .search-input-row {
    margin-top: 10px;
  }
  .search-input {
    width: 400px;
    font-size: 18px;
  }
}

.github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
}
</style>
