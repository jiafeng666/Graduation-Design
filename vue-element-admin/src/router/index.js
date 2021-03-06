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
        meta: { title: '??????', icon: 'el-icon-house', affix: true }
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
        meta: { title: '????????????', icon: 'el-icon-files' }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    meta: { 'title': '??????', icon: 'el-icon-document' },
    children: [
      {
        path: 'jianshu',
        component: () => import('@/views/blog/jianshu/index'),
        name: 'jianshu',
        meta: { title: '??????', icon: 'jianshu' }
      },
      {
        path: 'juejin',
        component: () => import('@/views/blog/juejin/index'),
        name: 'juejin',
        meta: { title: '??????', icon: 'juejin' }
      },
      {
        path: 'weibo',
        component: () => import('@/views/blog/weibo/index'),
        name: 'weibo',
        meta: { title: '??????', icon: 'weibo' },
        children: [
          {
            path: 'weibohot',
            component: () => import('@/views/blog/weibo/weibohot'),
            name: 'Weibohot',
            meta: { title: '????????????' }
          },
          {
            path: 'weibosou',
            component: () => import('@/views/blog/weibo/weibosou'),
            name: 'Weibosou',
            meta: { title: '????????????' }
          }
        ]
      }
    ]
  },
  {
    path: '/forum',
    component: Layout,
    meta: { 'title': '??????', icon: 'el-icon-chat-line-square' },
    children: [
      {
        path: 'douban',
        component: () => import('@/views/forum/douban/index'),
        name: 'douban',
        meta: { title: '??????', icon: 'douban' },
        children: [
          {
            path: 'doubanactor',
            component: () => import('@/views/forum/douban/doubanactor'),
            name: 'doubanactor',
            meta: { title: '??????????????????' }
          },
          {
            path: 'doubancomment',
            component: () => import('@/views/forum/douban/doubancomment'),
            name: 'doubancomment',
            meta: { title: '??????????????????' }
          },
          {
            path: 'doubanmovie',
            component: () => import('@/views/forum/douban/doubanmovie'),
            name: 'doubanmovie',
            meta: { title: '??????????????????' }
          }
        ]
      },
      {
        path: 'tianya',
        component: () => import('@/views/forum/tianya/index'),
        name: 'tianya',
        meta: { title: '??????', icon: 'tianya' }
      },
      {
        path: 'zhihu',
        component: () => import('@/views/forum/zhihu/index'),
        name: 'zhihu',
        meta: { title: '??????', icon: 'zhihu' },
        children: [
          {
            path: 'zhihuhot',
            component: () => import('@/views/forum/zhihu/zhihuhot'),
            name: 'zhihuhot',
            meta: { title: '????????????' }
          },
          {
            path: 'zhihusou',
            component: () => import('@/views/forum/zhihu/zhihusou'),
            name: 'zhihusou',
            meta: { title: '????????????' }
          }
        ]
      }
    ]
  },
  {
    path: '/house',
    component: Layout,
    meta: { 'title': '??????', icon: 'el-icon-suitcase' },
    children: [
      {
        path: '58',
        component: () => import('@/views/house/58/index'),
        name: '58',
        meta: { title: '58??????', icon: '58' }
      },
      {
        path: 'anjuke',
        component: () => import('@/views/house/anjuke/index'),
        name: 'anjuke',
        meta: { title: '?????????', icon: 'anjuke' }
      },
      {
        path: 'beike',
        component: () => import('@/views/house/beike/index'),
        name: 'beike',
        meta: { title: '??????', icon: 'beike' }
      },
      {
        path: 'lianjia',
        component: () => import('@/views/house/lianjia/index'),
        name: 'lianjia',
        meta: { title: '??????', icon: 'lianjia' }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    name: 'news',
    meta: { 'title': '??????', icon: 'el-icon-news' },
    children: [
      {
        path: 'jrtt',
        component: () => import('@/views/news/jrtt/index'),
        name: 'jrtt',
        meta: { title: '????????????', icon: 'jrtt' }
      },
      {
        path: 'netease',
        component: () => import('@/views/news/netease/index'),
        name: 'netease',
        meta: { title: '????????????', icon: 'netease' }
      },
      {
        path: 'qqnews',
        component: () => import('@/views/news/qqnews/index'),
        name: 'qqnews',
        meta: { title: '????????????', icon: 'qqnews' }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    meta: { 'title': '??????', icon: 'el-icon-shopping-bag-1' },
    children: [
      {
        path: 'jingdong',
        component: () => import('@/views/shop/jingdong/index'),
        name: 'jingdong',
        meta: { title: '??????', icon: 'jingdong' },
        children: [
          {
            path: 'jdlist',
            component: () => import('@/views/shop/jingdong/jdlist'),
            name: 'jdlist',
            meta: { title: '??????????????????' }
          },
          {
            path: 'jdcomment',
            component: () => import('@/views/shop/jingdong/jdcomment'),
            name: 'jdcomment',
            meta: { title: '??????????????????' }
          }
        ]
      },
      {
        path: 'pdd',
        component: () => import('@/views/shop/pdd/index'),
        name: 'pdd',
        meta: { title: '?????????', icon: 'pdd' }
      },
      {
        path: 'taobao',
        component: () => import('@/views/shop/taobao/index'),
        name: 'taobao',
        meta: { title: '??????', icon: 'taobao' }
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
        meta: { title: '????????????', icon: 'el-icon-data-analysis' }
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
        meta: { title: '????????????' }
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
