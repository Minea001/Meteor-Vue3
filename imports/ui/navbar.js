export default [
  {
    title: 'Dashboard',
    route:{name: 'Dashboard'},
    icon: 'fa-solid fa-gauge',
  },
  {
    title: 'Customer',
    route:{name: 'Customer'},
    icon: 'fa-solid fa-users',
  },

  {
    title: 'Sale',
    route:{name: 'Sale'},
    icon: 'fa-solid fa-tag',
  },
  {
    title: 'Receipt',
    route:{name: ''},
    icon:"fa-solid fa-file-invoice"
  },
  {
    title: 'Vendor',
    route:{name: 'vendor'},
    icon: 'fa-solid fa-person-hiking',
  },
  {
    title: 'Purchase',
    route:{name: ''},
    icon: 'fa-solid fa-bag-shopping',
  },
  {
    title: 'Payment',
    route:{name: ''},
    icon: 'fa-solid fa-money-check-dollar',
  },

  {
    title: 'Item',
    route:{name: 'Item'},
    icon: 'fa-solid fa-shapes',
  },
  {
    title: 'Report',
    route:{name: 'Report'},
    icon: 'fa-solid fa-file-contract',
  },
  {
    title: 'Admin Setting',
    icon: 'fa-solid fa-gears',
    group: 'admin',
    route: { name: 'AdminSetting', params: { activeCom: 'profile' } },
    children: [
      {
        title: 'Profile',
        route: { name: 'AdminSetting', params: { activeCom: 'profile' } },
        icon: 'fa-solid fa-user-circle',
        group: 'admin',
      },
      {
        title: 'Employee',
        route: { name: 'employee', params: { activeCom: 'employee' } },
        group: 'admin',
        icon:'far fa-child-dress'
        // roles: ['admin'],
      },
      {
        title: 'Unit',
        route:{name: 'unit'},
        icon: 'fa-solid fa-recycle',
      },
      {
        title: 'Category',
        route:{name: 'category'},
        icon: 'fa-solid fa-cart-plus',
      },
      {
        title: 'User',
        route: { name: 'AdminSetting', params: { activeCom: 'user' } },
        group: 'admin',
        icon: 'fa-solid fa-users',
        // roles: ['admin'],
      },
    ],
  },
]