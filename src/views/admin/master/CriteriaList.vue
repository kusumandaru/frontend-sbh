<template>
  <div>
    <criteria-list-add-new
      :is-add-new-criteria-sidebar-active.sync="isAddNewCriteriaSidebarActive"
      :exercise-type-options="exerciseTypeOptions"
      @refetch-data="refetchData"
    />

    <!-- card 3 -->
    <b-col
      md="6"
      lg="4"
    >
      <b-card
        header=""
        :title="exercise.name"
        :footer="exercise.code"
        class="text-center"
        footer-class="text-muted"
      >
        <b-card-text>
          {{ exercise.exercise_type }}
        </b-card-text>
        <b-card-text>
          {{ exercise.created_by }}
        </b-card-text>
        <b-card-text>
          {{ exercise.created_at }}
        </b-card-text>
      </b-card>
    </b-col>

    <!-- input search -->
    <div class="custom-search d-flex justify-content-end">
      <b-form-group>
        <!-- Search -->
        <b-col
          cols="18"
          md="18"
        >
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchTerm"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <b-button
              variant="primary"
              @click="isAddNewCriteriaSidebarActive = true"
            >
              <span class="text-nowrap">Add Criteria</span>
            </b-button>
          </div>
        </b-col>
      </b-form-group>
    </div>
    <!-- table -->
    <vue-good-table
      :ref="refCriteriaListTable"
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
      :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >
        <!-- Column: Exercise Type -->
        <div
          v-if="props.column.field === 'exercise'"
          class="text-nowrap"
        >
          <b-badge :variant="resolveExerciseTypeVariant(props.row.exercise_type)">
            {{ resolveExerciseTypeTranslation(props.row.exercise_type) }}
          </b-badge>
        </div>

        <!-- Column: Description -->
        <div
          v-if="props.column.field === 'desc'"
        >
          <span v-html="props.row.description" />
        </div>

        <!-- Column: Additional Notes -->
        <div
          v-if="props.column.field === 'note'"
        >
          <span v-html="props.row.additional_notes" />
        </div>

        <!-- Column: Action -->
        <span v-if="props.column.field === 'action'">
          <span>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <feather-icon
                  :id="`project-row-${props.row.id}-criteria-icon`"
                  icon="EyeIcon"
                  size="16"
                  class="mx-1"
                  @click="$router.push({ name: 'admin-document-list', params: { vendorId: $router.currentRoute.params.vendorId, templateId: $router.currentRoute.params.templateId, evaluationId: $router.currentRoute.params.evaluationId, exerciseId: $router.currentRoute.params.exerciseId, criteriaId: props.row.id }})"
                />
                <b-tooltip
                  title="Criteria Detail"
                  :target="`project-row-${props.row.id}-criteria-icon`"
                />

                <feather-icon
                  :id="`project-row-${props.row.id}-criteria-icon-edit`"
                  icon="EditIcon"
                  size="16"
                  class="mx-1"
                  @click="$router.push({ name: 'admin-criteria-edit', params: { criteriaId: props.row.id }})"
                />
                <b-tooltip
                  title="Criteria Update"
                  :target="`project-row-${props.row.id}-criteria-icon-edit`"
                />
              </template>
            </b-dropdown>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template
        slot="pagination-bottom"
        slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap">
              Showing 1 to
            </span>
            <b-form-select
              v-model="pageLength"
              :options="['10','20','50']"
              class="mx-1"
              @input="(value)=>props.perPageChanged({currentPerPage:value})"
            />
            <span class="text-nowrap "> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value)=>props.pageChanged({currentPage:value})"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import {
  BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BButton, BCol, BCard, BCardText, BTooltip, BBadge,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store/index'
import { ref, onUnmounted } from '@vue/composition-api'
import 'vue-good-table/dist/vue-good-table.css'
import router from '@/router'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useCriteriasList from './useCriteriasList'
import masterStoreModule from './masterStoreModule'
import CriteriaListAddNew from './CriteriaListAddNew.vue'

export default {
  components: {
    VueGoodTable,
    BDropdown,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton,
    BCol,
    BCard,
    BCardText,
    BTooltip,
    BBadge,
    CriteriaListAddNew,
  },
  setup() {
    const CRITERIA_APP_STORE_MODULE_NAME = 'app-criteria'

    // Register module
    if (!store.hasModule(CRITERIA_APP_STORE_MODULE_NAME)) store.registerModule(CRITERIA_APP_STORE_MODULE_NAME, masterStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CRITERIA_APP_STORE_MODULE_NAME)) store.unregisterModule(CRITERIA_APP_STORE_MODULE_NAME)
    })

    const isAddNewCriteriaSidebarActive = ref(false)

    const exerciseTypeOptions = [
      { label: 'Prequisite', value: 'prequisite' },
      { label: 'Score', value: 'score' },
      { label: 'Max Score', value: 'max_score' },
    ]

    const {
      resolveExerciseTypeIcon,
      resolveExerciseTypeVariant,
      resolveExerciseTypeTranslation,
      refetchData,
      refCriteriaListTable,
    } = useCriteriasList()
    return {
      // Sidebar
      exerciseTypeOptions,
      isAddNewCriteriaSidebarActive,
      refCriteriaListTable,
      resolveExerciseTypeIcon,
      resolveExerciseTypeVariant,
      resolveExerciseTypeTranslation,
      refetchData,
    }
  },
  data() {
    return {
      exercise: {},
      pageLength: 20,
      dir: false,
      searchTerm: '',
      columns: [
        {
          label: 'Code',
          field: 'code',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Code',
          },
        },
        {
          label: 'Exercise Type',
          field: 'exercise',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Type',
          },
        },
        {
          label: 'Score',
          field: 'score',
          type: 'number',
        },
        {
          label: 'Description',
          field: 'desc',
        },
        {
          label: 'Additional Notes',
          field: 'note',
        },
        {
          label: 'Not Available',
          field: 'not_available',
        },
        {
          label: 'Created At',
          field: 'created_at',
        },
        {
          label: 'Action',
          field: 'action',
        },
      ],
      rows: [],
      options: {
        propertiesPanel: {},
        additionalModules: [],
        moddleExtensions: [],
      },
    }
  },
  computed: {
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  created() {
    this.retrieveExercise()
    this.retrieveCriterias()
  },
  methods: {
    retrieveExercise() {
      this.$http.get(`engine-rest/master-project/exercises/${router.currentRoute.params.exerciseId}`, { })
        .then(res => { this.exercise = res.data })
        .catch(() => {
          useToast({
            component: ToastificationContent,
            props: {
              title: 'Error fetching exercise',
              icon: 'AlertTriangleIcon',
              variant: 'danger',
            },
          })
        })
    },
    retrieveCriterias() {
      this.$http.get(`engine-rest/master-project/exercises/${router.currentRoute.params.exerciseId}/criterias`)
        .then(res => { this.rows = res.data })
    },
    /* eslint-disable object-shorthand */
    handleError(err) {
      console.error('failed to show diagram', err)
    },
    /* eslint-enable object-shorthand */
  },
}
</script>