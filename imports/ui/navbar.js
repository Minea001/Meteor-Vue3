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
    route:{name: ''},
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
    icon: 'fa-solid fa-user-secret',
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
  // {
  //   title: 'Setting',
  //   route:{name: ''},
  //   icon: 'fa-solid fa-gears',
  //   children:[
  //     {
  //       title: 'Employee',
  //       route:{name: ''},
  //       icon: 'fa-solid fa-users',
  //     },
  //   ]
  // },
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
        route: { name: 'AdminSetting', params: { activeCom: 'employee' } },
        group: 'admin',
        icon:'far fa-people-simple'
        // roles: ['admin'],
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