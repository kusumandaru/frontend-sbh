<template>
  <b-row
    v-if="adminData"
    class="project-preview"
  >
    <!-- Col: Left (project Container) -->
    <b-col
      cols="12"
      xl="9"
      md="8"
    >
      <b-card
        no-body
        class="project-preview-card"
      >
        <!-- Header -->
        <b-card-body class="project-padding pb-0">

          <div class="d-flex justify-content-between flex-md-row flex-column project-spacing mt-0">
            <!-- Header: Left Content -->
            <table class="mt-2 mt-xl-0 w-100">
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="UserIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Manager Name</span>
                </th>
                <td class="pb-50">
                  {{ adminData.manager_name }}
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="UserCheckIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Signature</span>
                </th>
                <td class="pb-50 text-capitalize">
                  <div class="d-lg-flex align-items-lefts justify-content-lefts">
                    <b-img-lazy
                      fluid
                      thumbnail
                      :src="signatureImage"
                      alt="signature image"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="FileTextIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Perjanjian Sertifikasi Greenship</span>
                </th>
                <td class="pb-50">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="flat-primary"
                    :disabled="isLoading"
                    @click="downloadMasterFile('registration_letter')"
                  >
                    <b-spinner
                      v-show="isLoading"
                      small
                    />
                    <feather-icon icon="ArchiveIcon" />
                    Download
                  </b-button>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="FileTextIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Lampiran 1</span>
                </th>
                <td class="pb-50">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="flat-primary"
                    :disabled="isLoading"
                    @click="downloadMasterFile('first_attachment')"
                  >
                    <b-spinner
                      v-show="isLoading"
                      small
                    />
                    <feather-icon icon="ArchiveIcon" />
                    Download
                  </b-button>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="FileTextIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Lampiran 2</span>
                </th>
                <td class="pb-50">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="flat-primary"
                    :disabled="isLoading"
                    @click="downloadMasterFile('second_attachment')"
                  >
                    <b-spinner
                      v-show="isLoading"
                      small
                    />
                    <feather-icon icon="ArchiveIcon" />
                    Download
                  </b-button>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="FileTextIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Lampiran 3</span>
                </th>
                <td class="pb-50">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="flat-primary"
                    :disabled="isLoading"
                    @click="downloadMasterFile('third_attachment')"
                  >
                    <b-spinner
                      v-show="isLoading"
                      small
                    />
                    <feather-icon icon="ArchiveIcon" />
                    Download
                  </b-button>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon
                    icon="FileTextIcon"
                    class="mr-75"
                  />
                  <span class="font-weight-bold">Form Penilaian</span>
                </th>
                <td class="pb-50">
                  <b-button
                    v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                    variant="flat-primary"
                    :disabled="isLoading"
                    @click="downloadMasterFile('scoring_form')"
                  >
                    <b-spinner
                      v-show="isLoading"
                      small
                    />
                    <feather-icon icon="ArchiveIcon" />
                    Download
                  </b-button>
                </td>
              </tr>
            </table>
          </div>
        </b-card-body>

        <!-- Spacer -->
        <hr class="project-spacing">

        <b-card-body class="project-padding pb-0">
          <b-row>

            <!-- Col: Certification Type -->
            <b-col
              cols="12"
              md="3"
              class="mt-md-0 mt-3"
              order="2"
              order-md="1"
            >
              <b-card-text
                class="mb-0"
              >
                <!-- Button: Update Admin Data-->
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="success"
                  class="mb-75"
                  block
                  @click="updateAdminData"
                >
                  Update Admin Data
                </b-button>
              </b-card-text>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import store from '@/store/index'
import 'vue-good-table/dist/vue-good-table.css'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import {
  BRow, BCol, BCard, BCardBody, BButton, BImgLazy, BSpinner, BCardText,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import projectStoreModule from '@/views/projectStoreModule'
import router from '@/router'

export default {
  directives: {
    Ripple,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BImgLazy,
    BSpinner,
    BCardText,
  },
  data() {
    return {
      pageLength: 20,
      dir: false,
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
    this.retrieveAdminData()
    this.retrieveManagerSignatureImage()
  },
  setup() {
    const blankAdminData = {
      manager_name: '',
      manager_signature: '',
      registration_letter: '',
      first_attachment: '',
      second_attachment: '',
      third_attachment: '',
      dr_template_id: '',
      fa_template_id: '',
    }
    const adminData = ref(JSON.parse(JSON.stringify(blankAdminData)))
    const blankDrTemplate = {
      project_version: '',
      project_type: '',
      master_vendor_id: '',
    }
    const drTemplate = ref(JSON.parse(JSON.stringify(blankDrTemplate)))

    const blankDrLevel = {
      name: '',
    }
    const blankFaLevel = {
      name: '',
    }

    const drLevel = ref(JSON.parse(JSON.stringify(blankDrLevel)))
    const faLevel = ref(JSON.parse(JSON.stringify(blankFaLevel)))

    const blankFaTemplate = {
      project_version: '',
      project_type: '',
      master_vendor_id: '',
    }
    const faTemplate = ref(JSON.parse(JSON.stringify(blankFaTemplate)))
    const signatureImage = ref(null)
    let isLoading = ref(false)
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    const downloadMasterFile = fileName => {
      isLoading = true
      store.dispatch('app-project/downloadMasterLink', {
        filename: fileName,
      })
        .then(response => {
          isLoading = false
          // window.open(response.data.url)
          const downloadLink = document.createElement('a')
          downloadLink.href = response.data.url
          downloadLink.download = response.data.filename
          downloadLink.target = '_blank'
          downloadLink.rel = 'noopener noreferrer'
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        })
        .catch(error => {
          isLoading = false
          if (error.response.status === 404) {
            console.error(error)
          }
          if (error.response.status === 500) {
            console.error(error)
          }
        })
    }

    const updateAdminData = () => {
      router.push({ name: 'admin-data-edit' })
    }

    return {
      downloadMasterFile,
      adminData,
      drTemplate,
      faTemplate,
      drLevel,
      faLevel,
      signatureImage,
      isLoading,
      updateAdminData,
    }
  },
  methods: {
    retrieveAdminData() {
      this.$http.get('engine-rest/master/master_admins')
        .then(res => {
          this.adminData = res.data
          this.retrieveFaTemplate()
          this.retrieveDrTemplate()
          this.retrieveFaLevel()
          this.retrieveDrLevel()
        })
    },

    /* eslint-enable object-shorthand */
    retrieveManagerSignatureImage() {
      this.$http.get('engine-rest/master/url_file/manager_signature')
        .then(res => {
          this.signatureImage = res.data.url
        })
    },
    retrieveFaTemplate() {
      this.$http.get(`engine-rest/master-project/templates/${this.adminData.fa_template_id}`)
        .then(res => {
          this.faTemplate = res.data
        })
    },
    retrieveDrTemplate() {
      this.$http.get(`engine-rest/master-project/templates/${this.adminData.dr_template_id}`)
        .then(res => {
          this.drTemplate = res.data
        })
    },
    retrieveFaLevel() {
      this.$http.get(`engine-rest/master-project/levels/${this.adminData.default_fa_level}`)
        .then(res => {
          this.faLevel = res.data
        })
    },
    retrieveDrLevel() {
      this.$http.get(`engine-rest/master-project/levels/${this.adminData.default_dr_level}`)
        .then(res => {
          this.drLevel = res.data
        })
    },
    /* eslint-disable object-shorthand */
    handleError(err) {
      console.error('failed to show data', err)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-project.scss";
</style>
