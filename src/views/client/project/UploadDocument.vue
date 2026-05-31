<template>
  <validation-observer ref="uploadDocumentRules">
    <b-form @submit.prevent>
      <project-header />
      <alert />

      <b-row>
        <!-- Iteration -->
        <b-col
          v-for="(document, index) in buildingDocumentData"
          :key="index"
          md="12"
          lazy
        >
          <b-form-group>
            <label>{{ document.name }}</label>
            <validation-provider
              #default="{ errors }"
              :name="document.name"
              :rules="document.mandatory && validationNotRejected ? 'required' : ''"
            >
              <b-form-file
                v-model.lazy="buildingDocuments[document.code]"
                :placeholder="document.placeholder"
                drop-placeholder="Drop file here..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <b-card-text
                v-if="buildingDocuments[document.code]"
                class="my-1"
              >
                Selected file: <strong>{{ buildingDocuments[document.code] ? buildingDocuments[document.code].name : '' }}</strong>
              </b-card-text>
            </validation-provider>
            <b-table
              v-if="filteredProjectAttachmentPresent(document.code)"
              responsive
              :items="filteredProjectAttachments(document.code)"
              :fields="projectAttachmentFields"
              class="mb-0"
            >
              <template #cell(filename)="doc">
                <b-link
                  class="font-weight-bold d-block text-nowrap text-muted"
                  @click="downloadFileByAttachment(doc.item.id)"
                >
                  {{ doc.value }}
                </b-link>
              </template>
            </b-table>
          </b-form-group>
        </b-col>
        <!-- End of Iteration -->

        <!-- submit and reset -->
        <b-col>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="secondary"
            class="mr-1"
            :disabled="isLoading"
            @click="submitProject()"
          >
            <b-spinner
              v-if="isLoading"
              small
              type="grow"
            />
            Submit
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            variant="outline-secondary"
            @click="reset"
          >
            Reset
          </b-button>
        </b-col>
      </b-row>

      <b-modal
        id="modal-success"
        v-model.lazy="successShow"
        ok-only
        ok-variant="success"
        ok-title="Accept"
        modal-class="modal-success"
        centered
        title="Success Modal"
        hide-header-close
        @ok="gotoIndex"
      >
        <b-card-text>
          <h5>Data success to submit</h5>
          <p v-html="resultId" />
        </b-card-text>
      </b-modal>
    </b-form>
  </validation-observer>
</template>

<script>
import {
  BCardText,
  BRow,
  BCol,
  BFormFile,
  BFormGroup,
  BForm,
  BButton,
  BModal,
  BSpinner,
  BTable,
  BLink,
} from 'bootstrap-vue'
import {
  ref, onUnmounted, reactive,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  required, email, confirmed, url, between, alpha, integer, password, min, digits, alphaDash, length,
} from '@validations'
import projectStoreModule from '@/views/projectStoreModule'
import ProjectHeader from './ProjectHeader.vue'
import Alert from './Alert.vue'

export default {
  components: {
    BCardText,
    BRow,
    BCol,
    BFormFile,
    BFormGroup,
    BForm,
    BButton,
    BModal,
    BSpinner,
    BTable,
    BLink,
    ValidationObserver,
    ValidationProvider,
    ProjectHeader,
    Alert,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      projectHeaderKey: 0,
      alertKey: 0,
      maxChar: 200,
      successShow: false,
      result: {},
      resultId: null,
      isLoading: false,
      options: {
        number: {
          numeral: true,
          numeralThousandsGroupStyle: 'thousand',
        },
        phone: {
          phone: true,
          phoneRegionCode: 'ID',
        },
        time: {
          time: true,
          timePattern: ['h', 'm', 's'],
        },
        date: {
          date: true,
          delimiter: '-',
          datePattern: ['Y', 'm', 'd'],
        },
        prefix: {
          prefix: '+63',
          blocks: [3, 3, 3, 4],
          uppercase: true,
        },
        required,
        confirmed,
        password,
        email,
        min,
        integer,
        url,
        alpha,
        between,
        digits,
        length,
        alphaDash,
      },
      projectAttachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'created_at', label: 'Created At' },
      ],
    }
  },
  setup() {
    const projectData = ref({})
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'
    const blankAdminData = {
      manager_name: '',
      manager_signature: '',
      registration_letter: '',
      first_attachment: '',
      second_attachment: '',
      third_attachment: '',
      scoring_form: '',
      dr_template_id: '',
      fa_template_id: '',
      default_dr_level: '',
      default_fa_level: '',
    }
    const adminData = ref(JSON.parse(JSON.stringify(blankAdminData)))

    const buildingDocumentData = ref(JSON.parse('[]'))
    const buildingDocuments = ref(JSON.parse('{}'))
    const projectAttachments = ref(JSON.parse('[]'))
    const paymentProps = reactive({
      center: true,
      fluidGrow: true,
      blank: true,
      blankColor: '#bbb',
      class: 'my-5',
    })

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchClientProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data
        paymentProps.blank = false
        paymentProps.src = response.data.proof_of_payment_url

        store.dispatch('app-project/fetchBuildingDocumentsByMasterCertificationTypeID', { masterCertificationTypeID: projectData.value.certification_type_id })
          .then(resp => {
            buildingDocumentData.value = resp.data
          })
          .catch(err => {
            console.error(err)
          })
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectData.value = undefined
        }
        if (error.response.status === 500) {
          projectData.value = undefined
        }
      })

    store.dispatch('app-project/fetchProjectAttachments', { id: router.currentRoute.params.id })
      .then(response => {
        projectAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAttachments.value = undefined
        }
        if (error.response.status === 500) {
          projectAttachments.value = undefined
        }
      })

    const downloadFile = fileName => {
      store.dispatch('app-project/downloadLink', {
        id: projectData.value.task_id,
        filename: fileName,
      })
        .then(response => {
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
          if (error.response.status === 404) {
            console.error(error)
          }
          if (error.response.status === 500) {
            console.error(error)
          }
        })
    }

    const downloadFileByAttachment = attachmentId => {
      store.dispatch('app-project/downloadLinkByAttachmentId', {
        taskId: projectData.value.task_id,
        attachmentId,
      })
        .then(response => {
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
          if (error.response.status === 404) {
            console.error(error)
          }
          if (error.response.status === 500) {
            console.error(error)
          }
        })
    }

    return {
      projectData,
      adminData,
      buildingDocumentData,
      buildingDocuments,
      projectAttachments,
      downloadFile,
      downloadFileByAttachment,
    }
  },
  computed: {
    message: {
      get() {
        return this.$store.state.obj.message
      },
      set(value) {
        this.$store.commit('updateMessage', value)
      },
    },
    validationNotRejected() {
      return this.projectData.approved !== false
    },
  },
  methods: {
    reset() {
      this.projectData = {}
    },
    showToast(variant, titleToast, description) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title: titleToast,
          icon: 'BellIcon',
          text: description,
          variant,
        },
      })
    },
    filteredProjectAttachments(fileType) {
      // eslint-disable-next-line
      const filtered = this.projectAttachments.filter(pa => { 
        // eslint-disable-next-line
        return pa.file_type === fileType
      })
      return filtered
    },
    submitProject() {
      this.$refs.uploadDocumentRules.validate().then(success => {
        if (success) {
          this.isLoading = true
          const request = new FormData()
          request.append('task_id', router.currentRoute.params.id)

          // eslint-disable-next-line no-restricted-syntax
          for (const [key, value] of Object.entries(this.buildingDocuments)) {
            request.append(key, value)
          }

          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          this.$http.post('/engine-rest/new-building/upload-eligibility-document', request, config).then(res => {
            this.result = JSON.parse(JSON.stringify(res.data))
            this.successShow = true
            this.isLoading = false
          }).catch(error => {
            this.isLoading = false
            console.error(error)
            this.showToast('danger', 'Cannot Save', 'There is error when submit data, contact administrator')
          })
        } else {
          this.showToast('danger', 'Cannot Save', 'There is any empty data')
        }
      })
    },
    gotoIndex() {
      router.push({ name: 'client-project-list' })
    },
    filteredProjectAttachmentPresent(fileType) {
      return this.filteredProjectAttachments(fileType).length > 0
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-project.scss";
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style lang="scss">
@media print {

  // Global Styles
  body {
    background-color: transparent !important;
  }
  nav.header-navbar {
    display: none;
  }
  .main-menu {
    display: none;
  }
  .header-navbar-shadow {
    display: none !important;
  }
  .content.app-content {
    margin-left: 0;
    padding-top: 2rem !important;
  }
  footer.footer {
    display: none;
  }
  .card {
    background-color: transparent;
    box-shadow: none;
  }
  .customizer-toggle {
    display: none !important;
  }

  // project Specific Styles
  .project-preview-wrapper {
    .row.project-preview {
      .col-md-8 {
        max-width: 100%;
        flex-grow: 1;
      }

      .project-preview-card {
        .card-body:nth-of-type(2) {
          .row {
              > .col-12 {
              max-width: 50% !important;
            }

            .col-12:nth-child(2) {
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
              margin-top: 0 !important;
            }
          }
        }
      }
    }

    // Action Right Col
    .project-actions {
      display: none;
    }
  }
}
</style>
