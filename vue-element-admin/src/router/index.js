import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/shouye/index'),
        name: 'index',
        meta: { title: '首页', icon: 'el-icon-house', affix: true }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/task/index'),
        name: 'task',
        meta: { title: '我的任务', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    meta: { 'title': '博客', icon: 'el-icon-document' },
    children: [
      {
        path: 'jianshu',
        component: () => import('@/views/blog/jianshu/index'),
        name: 'jianshu',
        meta: { title: '简书', icon: 'jianshu' }
      },
      {
        path: 'juejin',
        component: () => import('@/views/blog/juejin/index'),
        name: 'juejin',
        meta: { title: '掘金', icon: 'juejin' }
      },
      {
        path: 'weibo',
        component: () => import('@/views/blog/weibo/index'),
        name: 'weibo',
        meta: { title: '微博', icon: 'weibo' },
        children: [
          {
            path: 'weibohot',
            component: () => import('@/views/blog/weibo/weibohot'),
            name: 'Weibohot',
            meta: { title: '微博热搜' }
          },
          {
            path: 'weibosou',
            component: () => import('@/views/blog/weibo/weibosou'),
            name: 'Weibosou',
            meta: { title: '微博搜索' }
          }
        ]
      }
    ]
  },
  {
    path: '/forum',
    component: Layout,
    meta: { 'title': '论坛', icon: 'el-icon-chat-line-square' },
    children: [
      {
        path: 'douban',
        component: () => import('@/views/forum/douban/index'),
        name: 'douban',
        meta: { title: '豆瓣', icon: 'douban' },
        children: [
          {
            path: 'doubanactor',
            component: () => import('@/views/forum/douban/doubanactor'),
            name: 'doubanactor',
            meta: { title: '豆瓣演员信息' }
          },
          {
            path: 'doubancomment',
            component: () => import('@/views/forum/douban/doubancomment'),
            name: 'doubancomment',
            meta: { title: '豆瓣话题评论' }
          },
          {
            path: 'doubanmovie',
            component: () => import('@/views/forum/douban/doubanmovie'),
            name: 'doubanmovie',
            meta: { title: '豆瓣电影信息' }
          }
        ]
      },
      {
        path: 'tianya',
        component: () => import('@/views/forum/tianya/index'),
        name: 'tianya',
        meta: { title: '天涯', icon: 'tianya' }
      },
      {
        path: 'zhihu',
        component: () => import('@/views/forum/zhihu/index'),
        name: 'zhihu',
        meta: { title: '知乎', icon: 'zhihu' },
        children: [
          {
            path: 'zhihuhot',
            component: () => import('@/views/forum/zhihu/zhihuhot'),
            name: 'zhihuhot',
            meta: { title: '知乎热榜' }
          },
          {
            path: 'zhihusou',
            component: () => import('@/views/forum/zhihu/zhihusou'),
            name: 'zhihusou',
            meta: { title: '知乎搜索' }
          }
        ]
      }
    ]
  },
  {
    path: '/house',
    component: Layout,
    meta: { 'title': '住房', icon: 'el-icon-suitcase' },
    children: [
      {
        path: '58',
        component: () => import('@/views/house/58/index'),
        name: '58',
        meta: { title: '58同城', icon: '58' }
      },
      {
        path: 'anjuke',
        component: () => import('@/views/house/anjuke/index'),
        name: 'anjuke',
        meta: { title: '安居客', icon: 'anjuke' }
      },
      {
        path: 'beike',
        component: () => import('@/views/house/beike/index'),
        name: 'beike',
        meta: { title: '贝壳', icon: 'beike' }
      },
      {
        path: 'lianjia',
        component: () => import('@/views/house/lianjia/index'),
        name: 'lianjia',
        meta: { title: '链家', icon: 'lianjia' }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    name: 'news',
    meta: { 'title': '新闻', icon: 'el-icon-news' },
    children: [
      {
        path: 'jrtt',
        component: () => import('@/views/news/jrtt/index'),
        name: 'jrtt',
        meta: { title: '今日头条', icon: 'jrtt' }
      },
      {
        path: 'netease',
        component: () => import('@/views/news/netease/index'),
        name: 'netease',
        meta: { title: '网易新闻', icon: 'netease' }
      },
      {
        path: 'qqnews',
        component: () => import('@/views/news/qqnews/index'),
        name: 'qqnews',
        meta: { title: '腾讯新闻', icon: 'qqnews' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    meta: { 'title': '电商', icon: 'el-icon-shopping-bag-1' },
    children: [
      {
        path: 'jingdong',
        component: () => import('@/views/shop/jingdong/index'),
        name: 'jingdong',
        meta: { title: '京东', icon: 'jingdong' },
        children: [
          {
            path: 'jdlist',
            component: () => import('@/views/shop/jingdong/jdlist'),
            name: 'jdlist',
            meta: { title: '京东商品搜索' }
          },
          {
            path: 'jdcomment',
            component: () => import('@/views/shop/jingdong/jdcomment'),
            name: 'jdcomment',
            meta: { title: '京东商品评论' }
          }
        ]
      },
      {
        path: 'pdd',
        component: () => import('@/views/shop/pdd/index'),
        name: 'pdd',
        meta: { title: '拼多多', icon: 'pdd' }
      },
      {
        path: 'taobao',
        component: () => import('@/views/shop/taobao/index'),
        name: 'taobao',
        meta: { title: '淘宝', icon: 'taobao' }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/index'),
        name: 'monitor',
        meta: { title: '数据监控', icon: 'el-icon-data-analysis' }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    hidden: true,
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: '数据详情' }
      }
      // {
      //   path: 'export-selected-excel',
      //   component: () => import('@/views/excel/select-excel'),
      //   name: 'SelectExcel',
      //   meta: { title: 'Export Selected' }
      // },
      // {
      //   path: 'upload-excel',
      //   component: () => import('@/views/excel/upload-excel'),
      //   name: 'UploadExcel',
      //   meta: { title: 'Upload Excel' }
      // }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
