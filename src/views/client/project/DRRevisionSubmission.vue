<template>
  <validation-observer ref="drRevisionSubmissionRules">
    <b-form @submit.prevent>
      <project-header :key="projectHeaderKey" />

      <b-row>
        <!--DR Revision Submission Document -->
        <b-col md="12">
          <b-form-group>
            <label>Dokumen Revisi Design Recognition</label>
            <validation-provider
              #default="{ errors }"
              name="Dokumen Revisi Design Recognition"
              rules="required"
            >
              <b-form-file
                v-model="files"
                placeholder="(Mandatory) Upload revisi dokumen..."
                drop-placeholder="Drop file here..."
                multiple
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
            <b-card-text
              v-if="attachmentExist"
              class="mb-0"
            >
              <b-card no-body>
                <b-table
                  responsive
                  :items="projectAttachments"
                  :fields="attachmentFields"
                  class="mb-0"
                >
                  <template #cell(filename)="doc">
                    <b-link
                      class="font-weight-bold d-block text-nowrap text-muted"
                      @click="getAttachment(doc.item)"
                    >
                      {{ doc.value }}
                    </b-link>
                  </template>
                </b-table>
              </b-card>
            </b-card-text>
          </b-form-group>
        </b-col>

        <!-- submit and reset -->
        <b-col>
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="primary"
            class="mr-1"
            :disabled="isLoading"
            @click="submitProject"
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
            variant="outline-primary"
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
  BCard,
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
    BCard,
    ValidationObserver,
    ValidationProvider,
    ProjectHeader,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      isLoading: false,
      files: null,
      projectHeaderKey: 0,
      maxChar: 200,
      successShow: false,
      result: {},
      resultId: null,
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
      attachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'created_at', label: 'Created At' },
        'action',
      ],
    }
  },
  setup() {
    const projectData = ref({})
    const drRevisionSubmissionDocument = ref({})
    const projectAttachments = ref(JSON.parse('[]'))

    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'
    const selectedDesignRecognition = reactive({
      id: '',
      name: '',
    })
    const designRecognitionOption = reactive([
      { id: 'true', name: 'Need Design Recognition' },
      { id: 'false', name: 'Skip Design Recognition' },
    ])

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchClientProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data
        selectedDesignRecognition.id = response.data.design_recognition.toString()
        selectedDesignRecognition.name = response.data.design_recognition ? 'Need Design Recognition' : 'Skip Design Recognition'
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectData.value = undefined
        }
        if (error.response.status === 500) {
          projectData.value = undefined
        }
      })

    store.dispatch('app-project/fetchProjectAttachmentsByFileType', { taskId: router.currentRoute.params.id, fileType: 'dr_revision_submission' })
      .then(response => {
        projectAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAttachments.value = undefined
        }
      })

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
      drRevisionSubmissionDocument,
      downloadFileByAttachment,
      selectedDesignRecognition,
      designRecognitionOption,
      projectAttachments,
    }
  },
  computed: {
    validationAgreementLetter() {
      return this.projectData.agreement_letter !== undefined
    },
    attachmentExist() {
      return Array.isArray(this.projectAttachments) && this.projectAttachments.length > 0
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
    submitProject() {
      this.$refs.drRevisionSubmissionRules.validate().then(success => {
        if (success) {
          if (this.files === undefined) {
            return
          }

          this.isLoading = true
          const request = new FormData()
          for (let i = 0; i < this.files.length; i += 1) {
            request.append('files', this.files[i])
          }
          request.append('task_id', router.currentRoute.params.id)
          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          this.$http.post('/engine-rest/new-building/dr_revision_submission', request, config).then(res => {
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
    getAttachment(attachment) {
      this.isLoading = true
      this.$http.get(`/engine-rest/new-building/assessment_attachment/${attachment.id}`).then(response => {
        // window.open(response.data.url)
        const downloadLink = document.createElement('a')
        downloadLink.href = response.data.url
        downloadLink.download = response.data.filename
        downloadLink.target = '_blank'
        downloadLink.rel = 'noopener noreferrer'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
        this.showToast('danger', 'Cannot Load Attachment', 'There is error when load attachment, contact administrator')
      })
    },
    gotoIndex() {
      router.push({ name: 'client-project-list' })
    },
    stringToBoolean(value) {
      switch (value.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true
        case 'false': case 'no': case '0': case null: return false
        default: return Boolean(value)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-project.scss";
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
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
