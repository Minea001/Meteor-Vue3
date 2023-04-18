
export default  [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
    meta: {
      public: true,
      layout: 'Login',
    },
  },
  {
    path: '/admin-setting/:activeCom?',
    name: 'AdminSetting',
    component: () => import('./pages/AdminSetting.vue'),
    meta: {
      title: 'Admin Setting',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('./pages/Customers.vue'),
    meta: {
      title: 'Customer',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/item',
    name: 'Item',
    component: () => import('./pages/Item.vue'),
    meta: {
      title: 'Item',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/sale',
    name: 'Sale',
    component: () => import('./pages/Sale.vue'),
    meta: {
      title: 'sale',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/saleform',
    name: 'SaleForm',
    component: () => import('./pages/SaleForm.vue'),
    meta: {
      title: 'SaleForm',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },

  {
    path: '/vendor',
    name: 'vendor',
    component: () => import('./pages/Vendor.vue'),
    meta: {
      title: 'Vendor',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
    
  },
  {
    path: '/employee',
    name: 'employee',
    component: () => import('./pages/admin-setting/Employee.vue'),
    meta: {
      title: 'Employee',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('./About.vue'),
  // },

  // NotFound
  {
    path: '/category',
    name: 'category',
    component: () => import('./pages/admin-setting/Category.vue'),
    meta: {
      title: 'Category',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/unit',
    name: 'unit',
    component: () => import('./pages/admin-setting/Unit.vue'),
    meta: {
      title: 'Unit',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: () => import('./pages/NotFound.vue'),
    meta: {
      title: 'Not Found',
    },
  },

  // Report
  {
    path: '/report',
    name: 'Report',
    component: () => import('./reports/index.vue'),
    meta: {
      title: 'Report',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/sample',
    name: 'Sample',
    component: () => import('./reports/Sample.vue'),
    meta: {
      title: 'Sample',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },


]
