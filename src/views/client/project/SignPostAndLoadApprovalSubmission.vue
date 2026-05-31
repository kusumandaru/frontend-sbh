<template>
  <validation-observer ref="agreementFirstPaymentRules">
    <b-form @submit.prevent>
      <project-header :key="projectHeaderKey" />

      <b-row>
        <!--Form Pemesanan Plang GREENSHIP -->
        <b-col md="12">
          <b-form-group>
            <label>Form Pemesanan Plang Greenship</label>
            <validation-provider
              #default="{ errors }"
              name="Form Pemesanan Plang Greenship"
              rules="required"
            >
              <b-form-file
                v-model.lazy="signPostFormInput"
                placeholder="(Mandatory) Upload form pemesanan plang Greenship..."
                drop-placeholder="Drop file here..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <b-card-text
                v-if="signPostFormInput"
                class="my-1"
              >
                Selected file: <strong>{{ signPostFormInput ? signPostFormInput.name : '' }}</strong>
              </b-card-text>
            </validation-provider>
            <b-card-text
              v-if="signPostAttachmentExist"
              class="mb-0"
            >
              <b-card-text class="text-muted mb-0">
                List of submitted form pemesanan plang Greenship
              </b-card-text>
              <b-card no-body>
                <b-table
                  responsive
                  :items="signPostAttachments"
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

        <!--Persetujuan pemuatan data gedung di website dan media massa -->
        <b-col md="12">
          <b-form-group>
            <label>Persetujuan pemuatan data gedung di website dan media massa</label>
            <validation-provider
              #default="{ errors }"
              name="Persetujuan pemuatan data gedung di website dan media massa"
              rules="required"
            >
              <b-form-file
                v-model.lazy="approvalBuildingReleaseFormInput"
                placeholder="(Mandatory) Upload persetujuan..."
                drop-placeholder="Drop file here..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <b-card-text
                v-if="approvalBuildingReleaseFormInput"
                class="my-1"
              >
                Selected file: <strong>{{ approvalBuildingReleaseFormInput ? approvalBuildingReleaseFormInput.name : '' }}</strong>
              </b-card-text>
            </validation-provider>
            <b-card-text
              v-if="approvalBuildingReleaseAttachmentExist"
              class="mb-0"
            >
              <b-card no-body>
                <b-table
                  responsive
                  :items="approvalBuildingReleaseAttachments"
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
  BLink,
  BTable,
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
    BLink,
    BTable,
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
      projectHeaderKey: 0,
      signPostFormInput: null,
      approvalBuildingReleaseFormInput: null,
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
    const approvalBuildingReleaseForm = ref({})
    const signPostAttachments = ref(JSON.parse('[]'))
    const approvalBuildingReleaseAttachments = ref(JSON.parse('[]'))

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

    store.dispatch('app-project/fetchProjectAttachmentsByFileType', { taskId: router.currentRoute.params.id, fileType: 'sign_post' })
      .then(response => {
        signPostAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          signPostAttachments.value = undefined
        }
        if (error.response.status === 500) {
          signPostAttachments.value = undefined
        }
      })

    store.dispatch('app-project/fetchProjectAttachmentsByFileType', { taskId: router.currentRoute.params.id, fileType: 'approval_building_release' })
      .then(response => {
        approvalBuildingReleaseAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          approvalBuildingReleaseAttachments.value = undefined
        }
        if (error.response.status === 500) {
          approvalBuildingReleaseAttachments.value = undefined
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
      approvalBuildingReleaseForm,
      downloadFileByAttachment,
      selectedDesignRecognition,
      designRecognitionOption,
      approvalBuildingReleaseAttachments,
      signPostAttachments,
    }
  },
  computed: {
    signPostAttachmentExist() {
      return Array.isArray(this.signPostAttachments) && this.signPostAttachments.length > 0
    },
    approvalBuildingReleaseAttachmentExist() {
      return Array.isArray(this.approvalBuildingReleaseAttachments) && this.approvalBuildingReleaseAttachments.length > 0
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
      this.$refs.agreementFirstPaymentRules.validate().then(success => {
        if (success) {
          this.isLoading = true
          const request = new FormData()
          request.append('task_id', router.currentRoute.params.id)
          request.append('sign_post', this.signPostFormInput)
          request.append('approval_building_release', this.approvalBuildingReleaseFormInput)

          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          this.$http.post('/engine-rest/new-building/sign_post', request, config).then(res => {
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
    stringToBoolean(value) {
      switch (value.toLowerCase().trim()) {
        case 'true': case 'yes': case '1': return true
        case 'false': case 'no': case '0': case null: return false
        default: return Boolean(value)
      }
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
