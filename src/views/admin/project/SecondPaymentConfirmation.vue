<template>
  <validation-observer ref="secondPaymentConfirmationRules">
    <b-form @submit.prevent>
      <project-header :key="projectHeaderKey" />

      <b-row>
        <!--DR Scoring Form -->
        <b-col md="12">
          <b-form-group>
            <label>Form Penilaian Design Recognition</label>
            <validation-provider
              #default="{ errors }"
              name="Form Penilaian"
              rules="required"
            >
              <b-form-file
                v-model.lazy="drScoringFormInput"
                placeholder="(Mandatory) Upload form penilaian..."
                drop-placeholder="Drop file here..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <b-card-text
                v-if="drScoringFormInput"
                class="my-1"
              >
                Selected file: <strong>{{ drScoringFormInput ? drScoringFormInput.name : '' }}</strong>
              </b-card-text>
            </validation-provider>

            <b-card-text
              v-if="drScoringForm"
              class="mb-0"
            >
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="flat-primary"
                @click="downloadFileByAttachment(drScoringForm.id)"
              >
                <feather-icon icon="ArchiveIcon" />
                Download Form Penilaian Design Recogntion
              </b-button>
            </b-card-text>
          </b-form-group>
        </b-col>

        <!--FA Scoring Form -->
        <b-col md="12">
          <b-form-group>
            <label>Form Penilaian Final Assessment</label>
            <validation-provider
              #default="{ errors }"
              name="Form Penilaian"
              rules="required"
            >
              <b-form-file
                v-model.lazy="faScoringFormInput"
                placeholder="(Mandatory) Upload form penilaian..."
                drop-placeholder="Drop file here..."
              />
              <small class="text-danger">{{ errors[0] }}</small>
              <b-card-text
                v-if="faScoringFormInput"
                class="my-1"
              >
                Selected file: <strong>{{ faScoringFormInput ? faScoringFormInput.name : '' }}</strong>
              </b-card-text>
            </validation-provider>

            <b-card-text
              v-if="faScoringForm"
              class="mb-0"
            >
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="flat-primary"
                @click="downloadFileByAttachment(faScoringForm.id)"
              >
                <feather-icon icon="ArchiveIcon" />
                Download Form Penilaian Final Assessment
              </b-button>
            </b-card-text>
          </b-form-group>
        </b-col>

        <!--Approved-->
        <b-col cols="12">
          <b-form-group
            label="Approve second payment"
            label-for="secondPayment"
            description="Setujui pembayaran kedua"
          >
            <validation-provider
              #default="{ errors }"
              rules=""
              name="Second Payment"
            >
              <b-form-checkbox
                v-model="selectedApproved"
                class="custom-control-success"
                name="check-button"
                switch
              />
              <small class="text-danger">{{ errors[0] }}</small>
            </validation-provider>

            <b-table
              responsive
              :items="secondPaymentData"
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

        <!-- submit and reset -->
        <b-col>
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
  BCardText,
  BRow,
  BCol,
  BFormFile,
  BFormGroup,
  BFormCheckbox,
  BForm,
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
    BCardText,
    BRow,
    BCol,
    BFormFile,
    BTable,
    BLink,
    BFormGroup,
    BFormCheckbox,
    BForm,
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
      drScoringFormInput: null,
      faScoringFormInput: null,
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
    const drScoringForm = ref({})
    const faScoringForm = ref({})
    const secondPaymentData = ref([])
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'
    const selectedApproved = ref(false)
    const approvedOption = reactive([
      { id: 'true', name: 'Approve' },
      { id: 'false', name: 'Rejected' },
    ])

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchAdminProject', { id: router.currentRoute.params.id })
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

    store.dispatch('app-project/getLatestAttachmentByType', { taskId: router.currentRoute.params.id, fileType: 'dr_scoring_form' })
      .then(response => {
        drScoringForm.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          drScoringForm.value = undefined
        }
        if (error.response.status === 500) {
          drScoringForm.value = undefined
        }
      })

    store.dispatch('app-project/getLatestAttachmentByType', { taskId: router.currentRoute.params.id, fileType: 'fa_scoring_form' })
      .then(response => {
        faScoringForm.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          faScoringForm.value = undefined
        }
        if (error.response.status === 500) {
          faScoringForm.value = undefined
        }
      })

    store.dispatch('app-project/getAttachmentsByType', { taskId: router.currentRoute.params.id, fileType: 'second_payment_document' })
      .then(response => {
        secondPaymentData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          secondPaymentData.value = undefined
        }
        if (error.response.status === 500) {
          secondPaymentData.value = undefined
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
      drScoringForm,
      faScoringForm,
      secondPaymentData,
      downloadFileByAttachment,
      selectedApproved,
      approvedOption,
    }
  },
  computed: {
    validationSecondPaymentConfirmationLetter() {
      return this.projectData.scoring_form !== undefined
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
      this.$refs.secondPaymentConfirmationRules.validate().then(success => {
        if (success) {
          this.isLoading = true
          const request = new FormData()
          request.append('task_id', router.currentRoute.params.id)
          request.append('dr_scoring_form', this.drScoringFormInput)
          request.append('fa_scoring_form', this.faScoringFormInput)
          request.append('approved', this.selectedApproved)

          const config = {
            header: {
              'Content-Type': 'multipart/form-data',
            },
          }
          this.$http.post('/engine-rest/new-building/second_payment_approval', request, config).then(res => {
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
      router.push({ name: 'admin-project-list' })
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
