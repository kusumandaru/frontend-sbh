<template>
  <validation-observer ref="onSiteRevisionSubmissionRules">
    <b-form @submit.prevent>
      <project-header :key="projectHeaderKey" />

      <b-row>
        <!--Approver Report -->
        <b-col
          v-if="verificatorAttachmentExist"
          md="12"
        >
          <!-- Report -->
          <b-form-group
            label="Verificator Report"
            label-for="verificator-report"
          >
            <b-card-text class="mb-0">
              <b-card no-body>
                <b-table
                  responsive
                  :items="verificatorAttachments"
                  :fields="projectAttachmentFields"
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

        <!--Client Submission -->
        <b-col
          v-if="clientAttachmentExist"
          md="12"
        >
          <!-- Report -->
          <b-form-group
            label="Client Submission"
            label-for="client-submission"
          >
            <b-card-text class="mb-0">
              <b-card no-body>
                <b-table
                  responsive
                  :items="clientAttachments"
                  :fields="projectAttachmentFields"
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

        <!--Approver Note -->
        <b-col
          v-if="projectData.on_site_note"
          md="12"
        >
          <!-- Note -->
          <b-form-group
            label="Revision Note"
            label-for="on-site-note"
          >
            <b-form-textarea
              id="on-site-note"
              v-model="projectData.on_site_note"
              plaintext
              rows="5"
              trim
            />
          </b-form-group>
        </b-col>

        <!--OnSite Revision Submission Document -->
        <b-col md="12">
          <b-form-group>
            <label>On Site Revision Submission</label>
            <validation-provider
              #default="{ errors }"
              name="On Site Revision Submission"
              rules="required"
            >
              <b-form-file
                v-model="files"
                placeholder="(Mandatory) Upload revision submission..."
                drop-placeholder="Drop file here..."
                multiple
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>
          </b-form-group>
        </b-col>

        <b-col md="12">
          <!-- Note -->
          <b-form-group
            label="Note"
            label-for="on-site-note"
          >
            <b-form-textarea
              id="on-site-note"
              v-model="onSiteClientRevisionNote"
              placeholder="Note"
              rows="5"
              trim
            />
          </b-form-group>
        </b-col>

        <!-- submit and reset -->
        <b-col md="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            type="submit"
            variant="secondary"
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
  BCard,
  BCardText,
  BRow,
  BCol,
  BFormFile,
  BFormGroup,
  BForm,
  BFormTextarea,
  BLink,
  BTable,
  BButton,
  BModal,
  BSpinner,
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
    BCard,
    BCardText,
    BRow,
    BCol,
    BFormFile,
    BTable,
    BLink,
    BFormGroup,
    BForm,
    BFormTextarea,
    BButton,
    BModal,
    BSpinner,
    ValidationObserver,
    ValidationProvider,
    ProjectHeader,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      projectHeaderKey: 0,
      files: null,
      firstPaymentDocument: null,
      maxChar: 200,
      successShow: false,
      result: {},
      resultId: null,
      isLoading: false,
      projectAttachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'created_at', label: 'Created At' },
      ],
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
    }
  },
  setup() {
    const projectData = ref({})
    const onSiteRevisionSubmissionData = ref([])
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'
    const onSiteClientRevisionNote = ref('')
    const approvedOption = reactive([
      { id: 'true', name: 'Approve' },
      { id: 'false', name: 'Rejected' },
    ])
    const verificatorAttachments = ref(JSON.parse('[]'))
    const clientAttachments = ref(JSON.parse('[]'))

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchClientProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectData.value = undefined
        }
        if (error.response.status === 500) {
          projectData.value = undefined
        }
      })

    store.dispatch('app-project/getAttachmentsByType', { taskId: router.currentRoute.params.id, fileType: 'on_site_revision_submission' })
      .then(response => {
        onSiteRevisionSubmissionData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          onSiteRevisionSubmissionData.value = undefined
        }
        if (error.response.status === 500) {
          onSiteRevisionSubmissionData.value = undefined
        }
      })

    store.dispatch('app-project/fetchProjectAttachmentsByFileType', { taskId: router.currentRoute.params.id, fileType: 'on_site_verification_submission' })
      .then(response => {
        verificatorAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          verificatorAttachments.value = undefined
        }
      })

    store.dispatch('app-project/fetchProjectAttachmentsByFileType', { taskId: router.currentRoute.params.id, fileType: 'on_site_revision_submission' })
      .then(response => {
        clientAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          clientAttachments.value = undefined
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
      onSiteRevisionSubmissionData,
      downloadFileByAttachment,
      onSiteClientRevisionNote,
      approvedOption,
      verificatorAttachments,
      clientAttachments,
    }
  },
  computed: {
    verificatorAttachmentExist() {
      return Array.isArray(this.verificatorAttachments) && this.verificatorAttachments.length > 0
    },
    clientAttachmentExist() {
      return Array.isArray(this.clientAttachments) && this.clientAttachments.length > 0
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
      this.$refs.onSiteRevisionSubmissionRules.validate().then(success => {
        if (success) {
          if (this.files === undefined && this.files.length < 1) {
            return
          }
          this.isLoading = true
          const request = new FormData()
          request.append('task_id', router.currentRoute.params.id)
          for (let i = 0; i < this.files.length; i += 1) {
            request.append('files', this.files[i])
          }
          request.append('on_site_client_revision_note', this.onSiteClientRevisionNote)

          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          this.$http.post('/engine-rest/new-building/on_site_revision_submission', request, config).then(res => {
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
