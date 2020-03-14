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
    // hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      // hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/home/home.vue')
  }]
},
//   优惠券管理
{
  path: '/discountCoupon',
  name: 'discountCoupon',
  component: Main,
  meta: {
    title: '优惠券管理',
    icon: 'ios-barcode-outline',
    showAlways: true,
    access: ['优惠券管理', '优惠券列表', '添加优惠券']
  },
  children: [{
    path: 'coupon-list',
    name: 'coupon-list',
    meta: {
      title: '优惠券列表',
      access: ['优惠券列表']
    },
    component: () => import('@/view/discountCoupon/coupon-list.vue')
  },
  {
    path: 'coupon-add',
    name: 'coupon-add',
    meta: {
      //    hideInMenu: true,
      title: '添加优惠券',
      access: ['添加优惠券']
    },
    component: () => import('@/view/discountCoupon/coupon-add.vue')
  }
  ]
},
//   商品管理
{
  path: '/goods',
  name: 'goods',
  component: Main,
  meta: {
    title: '商品模板管理',
    icon: 'ios-cart-outline',
    showAlways: true,
    access: ['商品模板管理', '商品模板列表', '商品类目']
  },
  children: [{
    path: 'goods-list',
    name: 'goods-list',
    meta: {
      title: '商品模板列表',
      access: ['商品模板列表']
    },
    component: () => import('@/view/goods/goods-list.vue')
  },
  {
    path: 'goods-edit',
    name: 'goods-add',
    meta: {
      hideInMenu: true,
      title: '添加商品'
    },
    component: () => import('@/view/goods/goods-edit.vue')
  },
  {
    path: 'goods-edit/:content',
    name: 'goods-edit',
    meta: {
      hideInMenu: true,
      title: '修改商品'
    },
    component: () => import('@/view/goods/goods-edit.vue')
  },
  {
    path: 'goods-classify',
    name: 'goods-classify',
    meta: {
      title: '商品类目',
      access: ['商品类目']
    },
    component: () => import('@/view/goods/goods-classify.vue')
  }

  ]
},
//   区域管理
{
  path: '/district',
  name: 'district',
  component: Main,
  meta: {
    title: '商品管理',
    icon: 'md-grid',
    showAlways: true,
    access: ['商品管理', '商品列表', '区域时段']
  },
  children: [{
    path: 'goods-putaway',
    name: 'goods-putaway',
    meta: {
      title: '商品列表',
      access: ['商品列表']
    },
    component: () => import('@/view/district/goods-putaway.vue')
  },
  {
    path: 'putaway-edit',
    name: 'putaway-add',
    meta: {
      hideInMenu: true,
      title: '添加上架商品'
    },
    component: () => import('@/view/district/putaway-edit.vue')
  },
  {
    path: 'putaway-edit/:content',
    name: 'putaway-edit',
    meta: {
      hideInMenu: true,
      title: '修改上架商品'
    },
    component: () => import('@/view/district/putaway-edit.vue')
  },
  {
    path: 'district-timeList',
    name: 'district-timeList',
    meta: {
      title: '区域时段',
      access: ['区域时段']
    },
    component: () => import('@/view/district/district-timeList.vue')
  }
  ]
},
//   订单管理
{
  path: '/order',
  name: 'order',
  component: Main,
  meta: {
    title: '订单管理',
    icon: 'ios-list-box-outline',
    showAlways: true,
    access: ['订单管理', '订单列表']
  },
  children: [{
    path: 'order-list',
    name: 'order-list',
    meta: {
      title: '订单列表',
      access: ['订单列表']
    },
    component: () => import('@/view/order/order-list.vue')
  }]
},
//   发货管理
/* {
  path: '/shipments',
  name: 'shipments',
  component: Main,
  meta: {
    title: '发货管理',
    icon: 'ios-archive-outline',
    showAlways: true
    // access: ['会员管理', '会员列表', '商家审核']
  },
  children: [{
    path: 'shipments-list',
    name: 'shipments-list',
    meta: {
      title: '待发货列表'
      // access: ['会员列表']
    },
    component: () => import('@/view/shipments/shipments-list.vue')
  },
  {
    path: 'shipments-already',
    name: 'shipments-already',
    meta: {
      title: '已发货列表'
      // access: ['会员列表']
    },
    component: () => import('@/view/shipments/shipments-already.vue')
  }
  ]
}, */
//   会员管理
{
  path: '/user',
  name: 'user',
  component: Main,
  meta: {
    title: '会员管理',
    icon: 'md-person',
    showAlways: true,
    access: ['会员管理', '用户列表', '用户等级']
  },
  children: [{
    path: 'user-list',
    name: 'user-list',
    meta: {
      title: '用户列表',
      access: ['用户列表']
    },
    component: () => import('@/view/user/user-list.vue')
  },
  {
    path: 'user-level',
    name: 'user-level',
    meta: {
      title: '用户等级',
      access: ['用户等级']
    },
    component: () => import('@/view/user/user-level.vue')
  }
  ]
},
//   内容管理
{
  path: '/content',
  name: 'content',
  component: Main,
  meta: {
    title: '内容管理',
    icon: 'ios-map',
    showAlways: true,
    access: ['内容管理', '轮播图管理', '注册协议', '产品介绍']
  },
  children: [{
    path: 'swiper-list',
    name: 'swiper-list',
    meta: {
      title: '轮播图管理',
      access: ['轮播图管理']
    },
    component: () => import('@/view/content/swiper-list.vue')
  },
  {
    path: 'register-text',
    name: 'register-text',
    meta: {
      title: '注册协议',
      access: ['注册协议']
    },
    component: () => import('@/view/content/register-text.vue')
  },
  {
    path: 'product-text',
    name: 'product-text',
    meta: {
      title: '产品介绍',
      access: ['产品介绍']
    },
    component: () => import('@/view/content/product-text.vue')
  }, {
    path: 'buy-text',
    name: 'buy-text',
    meta: {
      title: '购买协议',
      access: ['购买协议']
    },
    component: () => import('@/view/content/buy-text.vue')
  }, {
    path: 'fabu-text',
    name: 'fabu-text',
    meta: {
      title: '委托发布协议',
      access: ['委托发布协议']
    },
    component: () => import('@/view/content/fabu-text.vue')
  }
  ]
},
//   财务管理
{
  path: '/finance',
  name: 'finance',
  component: Main,
  meta: {
    title: '财务管理',
    icon: 'logo-usd',
    showAlways: true,
    access: ['财务管理', '资产明细', '收入统计']
  },
  children: [
    {
      path: 'finance-list',
      name: 'finance-list',
      meta: {
        title: '资产明细',
        access: ['资产明细']
      },
      component: () => import('@/view/finance/finance-list.vue')
    },
    {
      path: 'revenue-statistics',
      name: 'revenue-statistics',
      meta: {
        title: '收入统计',
        // access: ['收入统计']
      },
      component: () => import('@/view/finance/revenue-statistics.vue')
    },
  ]
},
//   系统配置
{
  path: '/system',
  name: 'system',
  component: Main,
  meta: {
    title: '系统配置',
    icon: 'md-cog',
    showAlways: true,
    access: ['系统配置', '平台配置']
  },
  children: [
    {
      path: 'consign-list',
      name: 'consign-list',
      meta: {
        title: '平台配置',
        access: ['平台配置']
      },
      component: () => import('@/view/system/consign-list.vue')
    }
  ]
},
// 权限
{
  path: '/power',
  name: 'power',
  component: Main,
  meta: {
    title: '权限管理',
    icon: 'ios-lock',
    access: ['权限管理', '角色管理', '用户管理'],
    showAlways: true
  },
  children: [{
    path: 'role',
    name: 'role',
    meta: {
      title: '角色管理',
      access: ['角色管理']
    },
    component: () => import('@/view/power/role.vue')
  },
  {
    path: 'admin-list',
    name: 'admin-list',
    meta: {
      title: '用户管理',
      access: ['用户管理']
    },
    component: () => import('@/view/power/admin-list.vue')
  }
  ]
},
{
  path: '/add-role-href',
  name: 'add-role-href',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: 'add-role',
    name: 'add-role',
    meta: {
      title: '新增角色'
    },
    component: () => import('@/view/power/add-role.vue')
  }]
},
{
  path: '/edit-role-href',
  name: 'edit-role-href',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: 'edit-role',
    name: 'edit-role',
    meta: {
      title: '修改角色'
    },
    component: () => import('@/view/power/edit-role.vue')
  }]
}
]
