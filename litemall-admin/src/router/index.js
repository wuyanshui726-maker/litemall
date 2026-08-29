import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    perms: ['GET /aaa','POST /bbb']     will control the page perms (you can set multiple perms)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
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
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'app.menu.dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  // 批发改造：用户管理只有1个子菜单，框架自动扁平化显示收货地址
  {
    path: '/user',
    component: Layout,
    redirect: 'user/address',
    name: 'userManage',
    meta: {
      title: 'app.menu.user',
      icon: 'chart'
    },
    children: [
      {
        path: 'address',
        component: () => import('@/views/user/address'),
        name: 'address',
        meta: {
          perms: ['GET /admin/address/list'],
          title: 'app.menu.user_address',
          noCache: true
        }
      }
    ]
  },

  // 批发改造：商场管理只保留订单管理
  {
    path: '/mall',
    component: Layout,
    redirect: 'mall/order',
    name: 'mallManage',
    meta: {
      title: 'app.menu.mall',
      icon: 'chart'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/mall/order'),
        name: 'order',
        meta: {
          perms: ['GET /admin/order/list', 'GET /admin/order/detail', 'POST /admin/order/ship', 'POST /admin/order/refund', 'POST /admin/order/delete', 'POST /admin/order/reply'],
          title: 'app.menu.mall_order',
          noCache: true
        }
      }
    ]
  },

  // 批发改造：商品管理 - 删评论，新增下架商品
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'goodsManage',
    meta: {
      title: 'app.menu.goods',
      icon: 'chart'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/goods/list'),
        name: 'goodsList',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/delete'],
          title: 'app.menu.goods_list',
          noCache: true
        }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goodsCreate',
        meta: {
          perms: ['POST /admin/goods/create'],
          title: 'app.menu.goods_create',
          noCache: true
        }
      },
      {
        path: 'edit',
        component: () => import('@/views/goods/edit'),
        name: 'goodsEdit',
        meta: {
          perms: ['GET /admin/goods/detail', 'POST /admin/goods/update', 'POST /admin/goods/catAndBrand'],
          title: 'app.menu.goods_edit',
          noCache: true
        },
        hidden: true
      },
      {
        path: 'offline',
        component: () => import('@/views/goods/offline'),
        name: 'goodsOffline',
        meta: {
          perms: ['GET /admin/goods/list', 'POST /admin/goods/update'],
          title: '商品下架',
          noCache: true
        }
      }
    ]
  },

  // 批发改造：推广管理整栏删除

  // 批发改造：系统管理保留管理员+存储管理(上传商品图片用)
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    name: 'sysManage',
    meta: {
      title: 'app.menu.sys',
      icon: 'chart'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/sys/admin'),
        name: 'admin',
        meta: {
          perms: ['GET /admin/admin/list', 'POST /admin/admin/create', 'POST /admin/admin/update', 'POST /admin/admin/delete'],
          title: 'app.menu.sys_admin',
          noCache: true
        }
      },
      {
        path: 'os',
        component: () => import('@/views/sys/os'),
        name: 'os',
        meta: {
          perms: ['GET /admin/storage/list', 'POST /admin/storage/create', 'POST /admin/storage/update', 'POST /admin/storage/delete'],
          title: 'app.menu.sys_os',
          noCache: true
        }
      }
    ]
  },

  // 批发改造：配置管理只保留小程序管理
  {
    path: '/config',
    component: Layout,
    redirect: 'config/wx',
    name: 'configManage',
    meta: {
      title: 'app.menu.config',
      icon: 'chart'
    },
    children: [
      {
        path: 'wx',
        component: () => import('@/views/config/wx'),
        name: 'configWx',
        meta: {
          perms: ['GET /admin/config/wx', 'POST /admin/config/wx'],
          title: 'app.menu.config_wx',
          noCache: true
        }
      }
    ]
  },

  // 批发改造：外链整栏删除
  {
    path: '/profile',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    children: [
      {
        path: 'password',
        component: () => import('@/views/profile/password'),
        name: 'password',
        meta: { title: 'app.menu.profile_password', noCache: true }
      },
      {
        path: 'notice',
        component: () => import('@/views/profile/notice'),
        name: 'notice',
        meta: { title: 'app.menu.profile_notice', noCache: true }
      }
    ],
    hidden: true
  },

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
