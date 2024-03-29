<template>
  <div>
    <city-list-add-new
      :is-add-new-city-sidebar-active.sync="isAddNewCitySidebarActive"
      @refetch-data="refetchData"
    />
    <!-- input search -->
    <div class="d-flex align-items-center justify-content-end">
      <b-form-input
        v-model="searchTerm"
        class="d-inline-block mr-1"
        placeholder="Search..."
      />
      <b-button
        variant="primary"
        @click="isAddNewCitySidebarActive = true"
      >
        <span class="text-nowrap">Add City</span>
      </b-button>
    </div>
    <!-- table -->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :rtl="direction"
      :theme="skinLayout"
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

        <!-- Column: Name -->
        <div
          v-if="props.column.field === 'name'"
          class="text-nowrap"
        >
          <!-- <span class="text-nowrap">{{ props.row.name }}</span> -->
        </div>

        <!-- Column: Name -->
        <div
          v-if="props.column.field === 'cityId'"
          class="text-nowrap"
        >
          <span class="text-nowrap">{{ props.row.city.name }}</span>
        </div>

        <!-- Column: Action -->
        <span v-else-if="props.column.field === 'action'">
          <span>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <feather-icon
                  :id="`master-row-${props.row.id}-city-icon-edit`"
                  icon="EditIcon"
                  size="16"
                  class="mx-1"
                  @click="$router.push({ name: 'admin-city-edit', params: { cityId: props.row.id }})"
                />
                <b-tooltip
                  title="City Update"
                  :target="`master-row-${props.row.id}-city-icon-edit`"
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
  BPagination, BFormInput, BFormSelect, BDropdown, BButton, BTooltip,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import { ref, onUnmounted } from '@vue/composition-api'
import store from '@/store/index'
import 'vue-good-table/dist/vue-good-table.css'
import useCitiesList from './useCitiesList'
import masterStoreModule from './masterStoreModule'
import CityListAddNew from './CityListAddNew.vue'

export default {
  components: {
    VueGoodTable,
    BPagination,
    BDropdown,
    BFormInput,
    BFormSelect,
    BButton,
    BTooltip,
    CityListAddNew,
  },
  setup() {
    const CITY_APP_STORE_MODULE_NAME = 'app-city'

    // Register module
    if (!store.hasModule(CITY_APP_STORE_MODULE_NAME)) store.registerModule(CITY_APP_STORE_MODULE_NAME, masterStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(CITY_APP_STORE_MODULE_NAME)) store.unregisterModule(CITY_APP_STORE_MODULE_NAME)
    })

    const isAddNewCitySidebarActive = ref(false)

    const {
      refetchData,
      refCityListTable,
    } = useCitiesList()
    return {
      // Sidebar
      isAddNewCitySidebarActive,
      refCityListTable,
      refetchData,
    }
  },
  data() {
    return {
      pageLength: 20,
      dir: false,
      searchTerm: '',
      columns: [
        {
          label: 'City Name',
          field: 'name',
          filterOptions: {
            enabled: true,
            placeholder: 'Search City',
          },
        },
        {
          label: 'Province Name',
          field: 'province.name',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Province',
          },
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
    skinLayout() {
      const statusColor = {
        /* eslint-disable key-spacing */
        light: 'default',
        dark: 'nocturnal',
        /* eslint-enable key-spacing */
      }
      return statusColor[store.state.appConfig.layout.skin]
    },
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
    this.retrieveCities()
  },
  methods: {
    retrieveCities() {
      this.$http.get('engine-rest/master/cities')
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
