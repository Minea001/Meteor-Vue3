import Dashboard from'./pages/Dashboard.vue'
import Login from './pages/Login.vue'
import AdminSetting from './pages/AdminSetting.vue'
import Customer from './pages/Customers.vue'
import Item from './pages/Item.vue'
import Sale from './pages/Sale.vue'
import Receipt from './pages/Reciept.vue' 
import ReceiptForm from './pages/RecieptForm.vue'
import SaleForm from './pages/SaleForm.vue'
import Purchase from  './pages/Purchase.vue'
import PurchaseForm from './pages/PurchaseForm.vue'
import Payment from './pages/Payment.vue'
import PaymentForm from './pages/PaymentForm.vue'
import Vendor from './pages/Vendor.vue'
import Employee from  './pages/admin-setting/Employee.vue'
import Category from './pages/admin-setting/Category.vue'
import Unit from './pages/admin-setting/Unit.vue'

// Not found
import NotFound from './pages/NotFound.vue'

// Report
import Report from './reports/index.vue'



export default  [
  {
    path: '/',
    name: 'Dashboard',
    component:Dashboard,
    meta: {
      title: 'Dashboard',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      public: true,
      layout: 'Login',
    },
  },
  {
    path: '/admin-setting/:activeCom?',
    name: 'AdminSetting',
    component: AdminSetting,
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
    component: Customer,
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
    component:Item,
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
    component: Sale,
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
    component: Receipt,
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
    component: ReceiptForm,
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
    component: SaleForm,
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
    component:Purchase,
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
    component: PurchaseForm,
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
    component: Payment,
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
    component: PaymentForm,
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
    component:Vendor,
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
    component:Employee,
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
    component: Category,
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
    component: Unit,
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
    component: NotFound,
    meta: {
      title: 'Not Found',
    },
  },

  // Report
  {
    path: '/report',
    name: 'Report',
    component: Report,
    meta: {
      title: 'Report',
      breadcrumb: {
        parent: 'Dashboard',
      },
    },
  },
  // {
  //   path: '/sample',
  //   name: 'Sample',
  //   component: () => import('./reports/Sample.vue'),
  //   meta: {
  //     title: 'Sample',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/sale-transactions',
  //   name: 'SaleTransactions',
  //   component: () => import('./reports/SaleTransactions.vue'),
  //   meta: {
  //     title: 'SaleTransactions',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/sale-transactions-detail',
  //   name: 'SaleTransactionsDetail',
  //   component: () => import('./reports/SaleTransactionsDetail.vue'),
  //   meta: {
  //     title: 'SaleTransactionsDetail',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/sale-transactions-detail-by-employee',
  //   name: 'SaleTransactionsDetailByEmp',
  //   component: () => import('./reports/SaleTransactionsDetailByEmp.vue'),
  //   meta: {
  //     title: 'SaleTransactionsDetailByEmployee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/open-invoice',
  //   name: 'OpenInvoice',
  //   component: () => import('./reports/OpenInvoice.vue'),
  //   meta: {
  //     title: 'OpenInvoiceByCustomer',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/receipt-summary-by-employee',
  //   name: 'ReceiptSummaryByEmp',
  //   component: () => import('./reports/ReceiptSummaryByEmp.vue'),
  //   meta: {
  //     title: 'Receipt Summary By Emp',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/receipt-detail-by-employee',
  //   name: 'ReceiptDetailByEmp',
  //   component: () => import('./reports/ReceiptDetailByEmp.vue'),
  //   meta: {
  //     title: 'Receipt Detail By Employee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/purchase-transactions',
  //   name: 'PurchaseTransactions',
  //   component: () => import('./reports/PurchaseTransactions.vue'),
  //   meta: {
  //     title: 'PurchaseTransactions',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/purchase-transactions-detail',
  //   name: 'PurchaseTransactionsDetail',
  //   component: () => import('./reports/PurchaseTransactionsDetail.vue'),
  //   meta: {
  //     title: 'PurchaseTransactionsDetail',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/purchase-transactions-detail-by-employee',
  //   name: 'PurchaseTransactionsDetailByEmp',
  //   component: () => import('./reports/PurchaseTransactionsDetailByEmp.vue'),
  //   meta: {
  //     title: 'PurchaseTransactionsDetailByEmployee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/open-payment',
  //   name: 'OpenPayment',
  //   component: () => import('./reports/OpenPayment.vue'),
  //   meta: {
  //     title: 'OpenPaymentByEmployee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/payment-detail-by-emp',
  //   name: 'PaymentDetailByEmp',
  //   component: () => import('./reports/PaymentDetailByEmp.vue'),
  //   meta: {
  //     title: 'PaymentDetail By Employee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
  // {
  //   path: '/payment-summary-by-emp',
  //   name: 'PaymentSummaryByEmp',
  //   component: () => import('./reports/PaymentSummaryByEmp.vue'),
  //   meta: {
  //     title: 'Payment Summary By Employee',
  //     breadcrumb: {
  //       parent: 'Report',
  //     },
  //   },
  // },
]
