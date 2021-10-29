import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'
import { title } from '@core/utils/filter'
import router from '@/router'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useCriteriasList() {
  // Use toast
  const toast = useToast()

  const refCriteriaListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'user', sortable: true },
    { key: 'email', sortable: true },
    { key: 'role', sortable: true },
    {
      key: 'currentPlan',
      label: 'Plan',
      formatter: title,
      sortable: true,
    },
    { key: 'status', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalCriterias = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const roleFilter = ref(null)
  const planFilter = ref(null)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refCriteriaListTable.value ? refCriteriaListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalCriterias.value,
    }
  })

  const refetchData = () => {
    /* refCriteriaListTable.value.refresh() */
    router.go()
  }

  watch([currentPage, perPage, searchQuery, roleFilter, planFilter, statusFilter], () => {
    refetchData()
  })

  const fetchCriterias = (ctx, callback) => {
    store
      .dispatch('app-criteria/fetchCriterias', {
        q: searchQuery.value,
        perPage: perPage.value,
        page: currentPage.value,
        sortBy: sortBy.value,
        sortDesc: isSortDirDesc.value,
        role: roleFilter.value,
        plan: planFilter.value,
        status: statusFilter.value,
      })
      .then(response => {
        const { criterias, total } = response.data

        callback(criterias)
        totalCriterias.value = total
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching criterias list',
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*

  const resolveExerciseTypeIcon = exerciseType => {
    if (exerciseType === 'prequisite') return 'SettingsIcon'
    if (exerciseType === 'score') return 'ServerIcon'
    if (exerciseType === 'max_score') return 'ServerIcon'

    return 'UserIcon'
  }

  const resolveExerciseTypeTranslation = exerciseType => {
    if (exerciseType === 'prequisite') return 'Prequisite'
    if (exerciseType === 'score') return 'Score'
    if (exerciseType === 'max_score') return 'Max Score'
    return ''
  }

  const resolveExerciseTypeVariant = exerciseType => {
    if (exerciseType === 'prequisite') return 'primary'
    if (exerciseType === 'score') return 'success'
    if (exerciseType === 'max_score') return 'secondary'

    return 'primary'
  }

  return {
    fetchCriterias,
    tableColumns,
    perPage,
    currentPage,
    totalCriterias,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refCriteriaListTable,

    resolveExerciseTypeIcon,
    resolveExerciseTypeVariant,
    resolveExerciseTypeTranslation,
    refetchData,

    // Extra Filters
    roleFilter,
    planFilter,
    statusFilter,
  }
}
