import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '*',
  name: 'login',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/home/home.vue')
  }]
},
  //   优惠券
{
  path: '/discountCoupon',
  name: 'discountCoupon',
  component: Main,
  meta: {
    title: '优惠券管理',
    icon: 'ios-barcode-outline',
    showAlways: true
    // access: ['会员管理', '会员列表', '商家审核']
  },
  children: [{
    path: 'coupon-list',
    name: 'coupon-list',
    meta: {
      title: '优惠券列表'
      // access: ['会员列表']
    },
    component: () => import('@/view/discountCoupon/coupon-list.vue')
  },
  {
    path: 'coupon-add',
    name: 'coupon-add',
    meta: {
      //    hideInMenu: true,
      title: '添加优惠券'
    },
    component: () => import('@/view/discountCoupon/coupon-add.vue')
  }
  ]
},
  //   商品
{
  path: '/commodity',
  name: 'commodity',
  component: Main,
  meta: {
    title: '商品管理',
    icon: 'ios-cart-outline',
    showAlways: true
    // access: ['会员管理', '会员列表', '商家审核']
  },
  children: [{
    path: 'commodity-classify',
    name: 'commodity-classify',
    meta: {
      title: '商品分类'
      // access: ['会员列表']
    },
    component: () => import('@/view/commodity/commodity-classify.vue')
  }
    /* {
        path: 'coupon-add',
        name: 'coupon-add',
        meta: {
          //    hideInMenu: true,
          title: '添加优惠券'
        },
        component: () => import('@/view/discountCoupon/coupon-add.vue')
      }, */
  ]
}
  /* {
      path: '/member',
      name: 'member',
      component: Main,
      meta: {
          title: '会员管理',
          icon: 'ios-people',
          showAlways: true,
          access: ['会员管理', '会员列表', '商家审核']
      },
      children: [
          {
              path: 'list',
              name: 'member-list',
              meta: {
                  title: '会员列表',
                  access: ['会员列表']
              },
              component: () => import('@/view/member/member-list.vue')
          },
          {
              path: 'list/:id',
              name: 'member-detail',
              meta: {
                  hideInMenu: true,
                  title: '会员详情'
              },
              component: () => import('@/view/member/member-detail.vue')
          },
      ]
  }, */
]
