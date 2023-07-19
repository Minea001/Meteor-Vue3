
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
    path: '/reciept',
    name: 'Reciept',
    component: () => import('./pages/Reciept.vue'),
    meta: {
      title: 'reciept',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/recieptform',
    name: 'RecieptForm',
    component: () => import('./pages/RecieptForm.vue'),
    meta: {
      title: 'Reciept Form',
      breadcrumb: {
        parent: 'Reciept',
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
    path: '/purchase',
    name: 'Purchase',
    component: () => import('./pages/Purchase.vue'),
    meta: {
      title: 'Purchase',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/purchase/purchaseform',
    name: 'purchaseform',
    component: () => import('./pages/PurchaseForm.vue'),
    meta: {
      title: 'PurchaseForm',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('./pages/Payment.vue'),
    meta: {
      title: 'Payment',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  {
    path: '/paymentform',
    name: 'PaymentForm',
    component: () => import('./pages/PaymentForm.vue'),
    meta: {
      title: 'Payment Form',
      breadcrumb: {
        parent: 'Payment',
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
  {
    path: '/sale-transactions',
    name: 'SaleTransactions',
    component: () => import('./reports/SaleTransactions.vue'),
    meta: {
      title: 'SaleTransactions',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/sale-transactions-detail',
    name: 'SaleTransactionsDetail',
    component: () => import('./reports/SaleTransactionsDetail.vue'),
    meta: {
      title: 'SaleTransactionsDetail',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/sale-transactions-detail-by-employee',
    name: 'SaleTransactionsDetailByEmp',
    component: () => import('./reports/SaleTransactionsDetailByEmp.vue'),
    meta: {
      title: 'SaleTransactionsDetailByEmployee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/open-invoice',
    name: 'OpenInvoice',
    component: () => import('./reports/OpenInvoice.vue'),
    meta: {
      title: 'OpenInvoiceByCustomer',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/receipt-summary-by-employee',
    name: 'ReceiptSummaryByEmp',
    component: () => import('./reports/ReceiptSummaryByEmp.vue'),
    meta: {
      title: 'Receipt Summary By Emp',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/receipt-detail-by-employee',
    name: 'ReceiptDetailByEmp',
    component: () => import('./reports/ReceiptDetailByEmp.vue'),
    meta: {
      title: 'Receipt Detail By Employee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/purchase-transactions',
    name: 'PurchaseTransactions',
    component: () => import('./reports/PurchaseTransactions.vue'),
    meta: {
      title: 'PurchaseTransactions',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/purchase-transactions-detail',
    name: 'PurchaseTransactionsDetail',
    component: () => import('./reports/PurchaseTransactionsDetail.vue'),
    meta: {
      title: 'PurchaseTransactionsDetail',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/purchase-transactions-detail-by-employee',
    name: 'PurchaseTransactionsDetailByEmp',
    component: () => import('./reports/PurchaseTransactionsDetailByEmp.vue'),
    meta: {
      title: 'PurchaseTransactionsDetailByEmployee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/open-payment',
    name: 'OpenPayment',
    component: () => import('./reports/OpenPayment.vue'),
    meta: {
      title: 'OpenPaymentByEmployee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/payment-detail-by-emp',
    name: 'PaymentDetailByEmp',
    component: () => import('./reports/PaymentDetailByEmp.vue'),
    meta: {
      title: 'PaymentDetail By Employee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
  {
    path: '/payment-summary-by-emp',
    name: 'PaymentSummaryByEmp',
    component: () => import('./reports/PaymentSummaryByEmp.vue'),
    meta: {
      title: 'Payment Summary By Employee',
      breadcrumb: {
        parent: 'Report',
      },
    },
  },
]
