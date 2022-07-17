export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
    resource: 'auth',
    action: 'read',
  },
  {
    title: 'Create Project',
    route: 'project-register',
    icon: 'BookIcon',
    resource: 'client-project-register',
    action: 'manage',
  },

  {
    title: 'List Project',
    icon: 'BookIcon',
    resource: 'client-project-list',
    action: 'manage',
    children: [
      {
        title: 'All Project',
        route: 'client-project-list',
        icon: 'BookIcon',
        resource: 'client-project-list',
        action: 'manage',
      },
      {
        title: 'Self Task',
        route: 'client-self-project-list',
        icon: 'BookIcon',
        resource: 'client-project-list',
        action: 'manage',
      },
    ],
  },
  {
    title: 'List User',
    route: 'client-user-list',
    icon: 'BookIcon',
    resource: 'client-user-list',
    action: 'manage',
  },
  {
    title: 'List Project',
    icon: 'BookIcon',
    resource: 'admin-project-list',
    action: 'manage',
    children: [
      {
        title: 'All Project',
        route: 'admin-project-list',
        icon: 'BookIcon',
        resource: 'admin-project-list',
        action: 'manage',
      },
      {
        title: 'Self Task',
        route: 'admin-self-project-list',
        icon: 'BookIcon',
        resource: 'verificator-project-list',
        action: 'manage',
      },
    ],
  },
  {
    title: 'User List',
    route: 'admin-user-list',
    icon: 'UserIcon',
    resource: 'admin-user-list',
    action: 'manage',
  },
  {
    title: 'Master Data',
    icon: 'SettingsIcon',
    resource: 'admin-master-data',
    action: 'manage',
    children: [
      {
        title: 'Master Vendor',
        route: 'admin-vendor-list',
        icon: 'MapIcon',
        resource: 'admin-master-data',
        action: 'manage',
      },
      {
        title: 'Master City',
        route: 'admin-city-list',
        icon: 'MapIcon',
        resource: 'admin-master-data',
        action: 'manage',
      },
      {
        title: 'Master Province',
        route: 'admin-province-list',
        icon: 'MapIcon',
        resource: 'admin-master-data',
        action: 'manage',
      },
      {
        title: 'Master Building Type',
        route: 'admin-building-type-list',
        icon: 'MapIcon',
        resource: 'admin-master-data',
        action: 'manage',
      },
      {
        title: 'Admin Data',
        route: 'admin-data',
        icon: 'MapIcon',
        resource: 'admin-master-data',
        action: 'manage',
      },
    ],
  },
]
