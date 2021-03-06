export default [
  {
    path: '/admin/project/list',
    name: 'admin-project-list',
    component: () => import('@/views/admin/project/List.vue'),
    meta: {
      pageTitle: 'List Project',
      breadcrumb: [
        {
          text: 'List Project',
          active: true,
        },
      ],
      action: 'manage',
      resource: 'admin-project-list',
    },
  },
  {
    path: '/admin/project/preview/:id',
    name: 'admin-project-preview',
    component: () => import('@/views/admin/project/Preview.vue'),
  },
  {
    path: '/admin/project/dr/assesment/:id',
    name: 'admin-project-dr-assessment',
    component: () => import('@/views/admin/dr/DRList.vue'),
  },
  {
    path: '/admin/project/dr/history/:id',
    name: 'admin-project-dr-history',
    component: () => import('@/views/admin/dr/DRListHistory.vue'),
  },
  {
    path: '/admin/project/fa/assesment/:id',
    name: 'admin-project-fa-assessment',
    component: () => import('@/views/admin/fa/FAList.vue'),
  },
  {
    path: '/admin/project/fa/history/:id',
    name: 'admin-project-fa-history',
    component: () => import('@/views/admin/fa/FAListHistory.vue'),
  },
  {
    path: '/admin/project/dr_evaluation_assessment/:id',
    name: 'admin-project-dr-evaluation-assessment',
    component: () => import('@/views/admin/project/DREvaluationAssessment.vue'),
  },
  {
    path: '/admin/project/fa_evaluation_assessment/:id',
    name: 'admin-project-fa-evaluation-assessment',
    component: () => import('@/views/admin/project/FAEvaluationAssessment.vue'),
  },
]
