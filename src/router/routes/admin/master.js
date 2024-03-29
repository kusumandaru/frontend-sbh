export default [
  {
    path: '/admin/master/city',
    name: 'admin-city-list',
    component: () => import('@/views/admin/master/CityList.vue'),
    meta: {
      pageTitle: 'List City',
      breadcrumb: [
        {
          text: 'List City',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/city/:cityId/edit',
    name: 'admin-city-edit',
    component: () => import('@/views/admin/master/CityEdit.vue'),
    meta: {
      pageTitle: 'Update City Type',
      breadcrumb: [
        {
          text: 'List City Type',
          to: '/admin/master/city',
        },
        {
          text: 'Update City Type',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/province',
    name: 'admin-province-list',
    component: () => import('@/views/admin/master/ProvinceList.vue'),
    meta: {
      pageTitle: 'List Province',
      breadcrumb: [
        {
          text: 'List Province',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/province/:provinceId/edit',
    name: 'admin-province-edit',
    component: () => import('@/views/admin/master/ProvinceEdit.vue'),
    meta: {
      pageTitle: 'Update Province Type',
      breadcrumb: [
        {
          text: 'List Province Type',
          to: '/admin/master/province',
        },
        {
          text: 'Update Province Type',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/building-type',
    name: 'admin-building-type-list',
    component: () => import('@/views/admin/master/BuildingTypeList.vue'),
    meta: {
      pageTitle: 'List Building Type',
      breadcrumb: [
        {
          text: 'List Building Type',
          active: true,
        },
      ],
      action: 'manage',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/building-type/:buildingId/edit',
    name: 'admin-building-edit',
    component: () => import('@/views/admin/master/BuildingTypeEdit.vue'),
    meta: {
      pageTitle: 'Update Building Type',
      breadcrumb: [
        {
          text: 'List Building Type',
          to: '/admin/master/building-type',
        },
        {
          text: 'Update Building Type',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/building-category',
    name: 'admin-building-category-list',
    component: () => import('@/views/admin/master/BuildingCategoryList.vue'),
    meta: {
      pageTitle: 'List Building Category',
      breadcrumb: [
        {
          text: 'List Building Category',
          active: true,
        },
      ],
      action: 'manage',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/building-category/:categoryId/edit',
    name: 'admin-building-category-edit',
    component: () => import('@/views/admin/master/BuildingCategoryEdit.vue'),
    meta: {
      pageTitle: 'Update Building Category',
      breadcrumb: [
        {
          text: 'List Building Category',
          to: '/admin/master/building-category',
        },
        {
          text: 'Update Building Category',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/admin-data',
    name: 'admin-data',
    component: () => import('@/views/admin/master/AdminData.vue'),
    meta: {
      pageTitle: 'Admin Data',
      breadcrumb: [
        {
          text: 'Admin Data',
          active: true,
        },
      ],
      action: 'manage',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/admin-data/edit',
    name: 'admin-data-edit',
    component: () => import('@/views/admin/master/AdminDataEdit.vue'),
    meta: {
      pageTitle: 'Admin Data Edit',
      breadcrumb: [
        {
          text: 'Admin Data Edit',
          active: true,
        },
      ],
      action: 'manage',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor',
    name: 'admin-vendor-list',
    component: () => import('@/views/admin/master/VendorList.vue'),
    meta: {
      pageTitle: 'List Vendor',
      breadcrumb: [
        {
          text: 'List Vendor',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/edit',
    name: 'admin-vendor-edit',
    component: () => import('@/views/admin/master/VendorEdit.vue'),
    meta: {
      pageTitle: 'Update Vendor',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'Update Vendor',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications',
    name: 'admin-certification-list',
    component: () => import('@/views/admin/master/CertificationList.vue'),
    meta: {
      pageTitle: 'List Certification',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/edit',
    name: 'admin-certification-edit',
    component: () => import('@/views/admin/master/CertificationEdit.vue'),
    meta: {
      pageTitle: 'Update Template',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'Update Certification',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates',
    name: 'admin-template-list',
    component: () => import('@/views/admin/master/TemplateList.vue'),
    meta: {
      pageTitle: 'List Template',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'List Template',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeIdtemplates/:templateId/edit',
    name: 'admin-template-edit',
    component: () => import('@/views/admin/master/TemplateEdit.vue'),
    meta: {
      pageTitle: 'Update Template',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'Update Vendor',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/building_document/:buildingDocumentId/edit',
    name: 'admin-building-document-edit',
    component: () => import('@/views/admin/master/BuildingDocumentEdit.vue'),
    meta: {
      pageTitle: 'Update Building Document',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Building Document',
        },
        {
          text: 'Update Building Document',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/generate_document/:generateDocumentId/edit',
    name: 'admin-generate-document-edit',
    component: () => import('@/views/admin/master/GenerateDocumentEdit.vue'),
    meta: {
      pageTitle: 'Update Building Document',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Generate Document',
        },
        {
          text: 'Update Generate Document',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/activity_name/:activityNameId/edit',
    name: 'admin-activity-name-edit',
    component: () => import('@/views/admin/master/ActivityNameEdit.vue'),
    meta: {
      pageTitle: 'Update Activity Name',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Certification',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Activity Name',
        },
        {
          text: 'Update Activity Name',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations',
    name: 'admin-evaluation-list',
    component: () => import('@/views/admin/master/EvaluationList.vue'),
    meta: {
      pageTitle: 'List Evaluation',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/edit',
    name: 'admin-evaluation-edit',
    component: () => import('@/views/admin/master/EvaluationEdit.vue'),
    meta: {
      pageTitle: 'Update Evaluation',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'Update Evaluation',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/levels/:levelId/edit',
    name: 'admin-level-edit',
    component: () => import('@/views/admin/master/LevelEdit.vue'),
    meta: {
      pageTitle: 'Update Level',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'Update Level',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises',
    name: 'admin-exercise-list',
    component: () => import('@/views/admin/master/ExerciseList.vue'),
    meta: {
      pageTitle: 'List Exercise',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/edit',
    name: 'admin-exercise-edit',
    component: () => import('@/views/admin/master/ExerciseEdit.vue'),
    meta: {
      pageTitle: 'Update Exercise',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'Update Exercise',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/criterias',
    name: 'admin-criteria-list',
    component: () => import('@/views/admin/master/CriteriaList.vue'),
    meta: {
      pageTitle: 'List Criteria',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Criteria',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/criterias/:criteriaId/edit',
    name: 'admin-criteria-edit',
    component: () => import('@/views/admin/master/CriteriaEdit.vue'),
    meta: {
      pageTitle: 'Update Criteria',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Criteria',
        },
        {
          text: 'Update Criteria',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/score_modifiers/:scoreModifierId/edit',
    name: 'admin-score-modifier-edit',
    component: () => import('@/views/admin/master/ScoreModifierEdit.vue'),
    meta: {
      pageTitle: 'Update Score Modifier',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Score Modifier',
        },
        {
          text: 'Update Score Modifier',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/criterias/:criteriaId/documents',
    name: 'admin-document-list',
    component: () => import('@/views/admin/master/DocumentList.vue'),
    meta: {
      pageTitle: 'List Document',
      breadcrumb: [
        {
          text: 'List Template',
          to: '/admin/master/vendors/:vendorId/templates',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Criteria',
        },
        {
          text: 'List Document And Blcoker',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/criterias/:criteriaId/documents/:documentId/edit',
    name: 'admin-document-edit',
    component: () => import('@/views/admin/master/DocumentEdit.vue'),
    meta: {
      pageTitle: 'Update Document',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Criteria',
        },
        {
          text: 'List Document',
        },
        {
          text: 'Update Document',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
  {
    path: '/admin/master/vendor/:vendorId/certifications/:certificationTypeId/templates/:templateId/evaluations/:evaluationId/exercises/:exerciseId/criterias/:criteriaId/blockers/',
    name: 'admin-blocker-correlation',
    component: () => import('@/views/admin/master/BlockerCorrelation.vue'),
    meta: {
      pageTitle: 'Blocker Correlation',
      breadcrumb: [
        {
          text: 'List Vendor',
          to: '/admin/master/vendor',
        },
        {
          text: 'List Template',
        },
        {
          text: 'List Evaluation',
        },
        {
          text: 'List Exercise',
        },
        {
          text: 'List Criteria',
        },
        {
          text: 'List Document',
        },
        {
          text: 'Blocker Correlation',
          active: true,
        },
      ],
      action: 'read',
      resource: 'admin-master-data',
    },
  },
]
