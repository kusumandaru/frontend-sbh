<template>
  <section class="project-preview-wrapper">
    <!-- error -->
    <error :key="'err'+errorKey" />
    <!-- error -->

    <rollback-project
      :is-rollback-sidebar-active="isRollbackSidebarActive"
      :history-options="historyOptions"
      @refetch-data="refetchData"
    />

    <b-row
      v-if="projectData"
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
              <div>
                <div class="logo-wrapper">
                  <logo />
                  <h3 class="text-primary project-logo">
                    {{ projectData.building_name }}
                  </h3>
                </div>
                <p class="card-text mb-25">
                  {{ projectData.building_address }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.city_name }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.province_name }}
                </p>
                <p class="card-text mb-25">
                  {{ projectData.postal_code }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PhoneIcon" />
                  Telephone: {{ projectData.telephone }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PhoneIcon" />
                  Handphone: {{ projectData.handphone }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="MailIcon" />
                  Email: {{ projectData.email }}
                </p>
                <p class="card-text mb-0">
                  <feather-icon icon="PrinterIcon" />
                  Faximile: {{ projectData.faximile }}
                </p>
              </div>

              <!-- Header: Right Content -->
              <div class="mt-md-0 mt-2">
                <h4 class="project-title">
                  Project ID
                  <span class="project-number">#{{ projectData.task_id }}</span>
                </h4>
                <div class="project-date-wrapper">
                  <p class="project-date-title">
                    Date Created:
                  </p>
                  <p class="project-date">
                    {{ projectData.created_at | moment("dddd, MMMM Do YYYY") }}
                  </p>
                </div>
              </div>
            </div>
          </b-card-body>

          <!-- Spacer -->
          <hr class="project-spacing">

          <!-- project Client and Description -->
          <b-card-body
            v-if="projectData.owner"
            class="project-padding pt-0"
          >
            <b-form class="mt-2">
              <b-row>
                <b-col md="6">
                  <b-card-body class="project-padding pb-0">
                    <b-card-title>Project To:</b-card-title>
                    <h6 class="mb-25">
                      {{ projectData.owner }}
                    </h6>
                    <p class="card-text mb-25">
                      {{ projectData.building_name }}
                    </p>
                    <p class="card-text mb-25">
                      {{ projectData.building_address }}, {{ projectData.postal_code }}
                    </p>
                    <p class="card-text mb-25">
                      {{ projectData.phone }}
                    </p>
                    <p class="card-text mb-0">
                      {{ projectData.email }}
                    </p>
                  </b-card-body>
                </b-col>
                <b-col md="6">
                  <b-card-body class="project-padding pb-0">
                    <b-card-title>Project Detail:</b-card-title>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Certification Type:</span>
                        <span class="ml-75">{{ projectData.certification_type }}</span>
                      </b-card-text>
                    </b-row>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Building Type:</span>
                        <span class="ml-75">{{ projectData.building_type_name }}</span>
                      </b-card-text>
                    </b-row>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Owner:</span>
                        <span class="ml-75">{{ projectData.owner }}</span>
                      </b-card-text>
                    </b-row>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Design Recognition:</span>
                        <span class="ml-75">{{ projectData.design_recognition }}</span>
                      </b-card-text>
                    </b-row>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Gross Floor Area:</span>
                        <span class="ml-75">{{ projectData.gross_floor_area }}</span>
                      </b-card-text>
                    </b-row>
                    <b-row>
                      <b-card-text class="mb-0">
                        <span class="font-weight-bold">Tenant:</span>
                        <span class="ml-75">{{ projectData.tenant }}</span>
                      </b-card-text>
                    </b-row>
                  </b-card-body>
                </b-col>
              </b-row>
            </b-form>
          </b-card-body>

          <div :key="'group'+categoryKey">
            <div
              v-for="category in documentCategories"
              :key="'cat'+category.id"
              class="business-item"
            >
              <hr
                class="project-spacing"
              >
              <b-card-body
                class="project-padding pb-0"
              >
                <b-card-title>{{ category.name }}</b-card-title>
                <b-card-sub-title>{{ category.description }}</b-card-sub-title>
                <p />
                <b-row>
                  <!-- Col: Download Files -->
                  <b-col
                    cols="12"
                    md="12"
                    class="mt-md-0 mt-3"
                    order="2"
                    order-md="1"
                  >
                    <app-collapse>
                      <app-collapse-item
                        v-for="(attachments, code) in category.members"
                        v-show="showCategory(attachments)"
                        :key="'attach'+code"
                        :title="codeToName(code)"
                        :is-visible="true"
                      >
                        <b-table
                          responsive
                          :items="attachments"
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
                      </app-collapse-item>
                    </app-collapse>
                  </b-col>
                </b-row>
              </b-card-body>
            </div>
          </div>

          <!-- Spacer -->
          <hr class="project-spacing">

          <b-card-body class="project-padding pb-0">
            <b-card-text
              class="mb-0"
            >
              <span class="font-weight-bold">Berkas : </span>
              <b-button
                variant="gradient-primary"
                :disabled="isLoading"
                @click="downloadAllFiles"
              >
                <feather-icon icon="ArchiveIcon" />
                Download All Archived Document
                <b-spinner
                  v-if="isLoading"
                  small
                  type="grow"
                />
              </b-button>
            </b-card-text>
          </b-card-body>
        </b-card>
      </b-col>

      <!-- Right Col: Card -->
      <b-col
        cols="12"
        md="4"
        xl="3"
        class="project-actions"
      >
        <b-card
          bg-variant="secondary"
          text-variant="white"
        >
          <b-card-title class="text-white text-center">
            {{ projectData.task_name }}
          </b-card-title>
          <b-card-text class="text-center">
            <span>{{ taskDescriptionBody }}</span>
          </b-card-text>
        </b-card>
        <b-card>
          <!-- Button: Approve -->
          <b-button
            v-if="approveShow"
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="approveTask"
          >
            Approve
          </b-button>

          <!-- Button: Reject -->
          <b-button
            v-if="rejectShow"
            v-b-toggle.sidebar-project-reject
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="danger"
            class="mb-75"
            block
          >
            Reject
          </b-button>

          <!-- Button: Design Recognition History-->
          <b-button
            v-if="designRecognitionHistoryShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="info"
            class="mb-75"
            block
            @click="designRecognitionHistory"
          >
            Design Recognition History
          </b-button>

          <!-- Button: Final Assessment History-->
          <b-button
            v-if="finalAssessmentHistoryShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="info"
            class="mb-75"
            block
            @click="finalAssessmentHistory"
          >
            Final Assessment History
          </b-button>

          <!-- Button: Continue to FA -->
          <b-button
            v-if="continueFAShow"
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="continueToFinalAssessment"
          >
            Continue To Final Assessment
          </b-button>

          <!-- Button: Agreement -->
          <b-button
            v-if="agreementShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="agreementPage"
          >
            Agreement Confirmation
          </b-button>

          <!-- Button: Workshop -->
          <b-button
            v-if="workshopShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="workshopPage"
          >
            Workshop and Consultation Submission
          </b-button>

          <!-- Button: Second Payment Confirmation -->
          <b-button
            v-if="secondPaymentConfirmationShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="secondPaymentConfirmationPage"
          >
            Second Payment Confirmation
          </b-button>

          <!-- Button: On Site Verification -->
          <b-button
            v-if="onSiteVerificationShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="onSiteVerificationPage"
          >
            On Site Verification
          </b-button>

          <!-- Button: Design Recognition Review-->
          <b-button
            v-if="designRecognitionReviewShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="designRecognitionReview"
          >
            Design Recognition Review
          </b-button>

          <!-- Button: Design Recognition Evaluation Assessment-->
          <b-button
            v-if="designRecognitionEvaluationAssessmentShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="designRecognitionEvaluationAssessment"
          >
            Design Recognition Evaluation Assessment
          </b-button>

          <!-- Button: Final Assessment Review-->
          <b-button
            v-if="finalAssessmentReviewShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="finalAssessmentReview"
          >
            Final Assessment Review
          </b-button>

          <!-- Button:Final Assessment Evaluation Assessment-->
          <b-button
            v-if="finalAssessmentEvaluationAssessmentShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="finalAssessmentEvaluationAssessment"
          >
            Final Assessment Evaluation Assessment
          </b-button>

          <!-- Button: Print -->
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            class="mb-75"
            block
            @click="printProject"
          >
            Print
          </b-button>

          <!-- Spacer -->
          <hr class="project-spacing">
          <!-- Spacer -->
          <hr class="project-spacing">
          <!-- Spacer -->
          <hr class="project-spacing">

          <!-- Button: Delete -->
          <b-button
            v-if="deleteShow"
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="warning"
            class="mb-75"
            block
            @click="deleteProject"
          >
            Delete
          </b-button>

          <!-- Button: Rollback Project -->
          <b-button
            v-if="rollbackShow"
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="warning"
            class="mb-75"
            block
            @click="isRollbackSidebarActive = true"
          >
            Rollback Project
          </b-button>
        </b-card>
      </b-col>
    </b-row>

    <project-sidebar-reject />
  </section>
</template>

<script>
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import store from '@/store'
import router from '@/router'
import {
  BRow, BCol, BCard, BCardBody, BCardText, BButton, BLink, VBToggle, BCardTitle, BCardSubTitle, BTable, BForm, BSpinner,
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import Logo from '@core/layouts/components/Logo.vue'
import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import Ripple from 'vue-ripple-directive'
import projectStoreModule from '@/views/projectStoreModule'
import ProjectSidebarReject from '@/views/admin/project/SidebarReject.vue'
import fileDownload from 'js-file-download'
import rollback from './rollback'
import Error from './Error.vue'
import RollbackProject from './RollbackProject.vue'

Vue.use(VueSweetalert2)

export default {
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BCardText,
    BButton,
    BLink,
    BTable,
    BForm,
    BSpinner,
    AppCollapse,
    AppCollapseItem,

    Logo,
    ProjectSidebarReject,
    Error,
    RollbackProject,
  },
  data() {
    return {
      projectAttachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'created_at', label: 'Created At' },
      ],
      taskDescription: [
        { task: 'design-recognition-trial', role: 'admin', title: 'Apabila diapprove akan langsung ke Design Recognition Letter, bila direject akan masuk ke revisi DR' },
        { task: 'design-recognition-trial-revision', role: 'client', title: 'Revisi DR oleh client' },
        { task: 'design-recognition-evaluation-assessment', role: 'admin', title: 'Menunggu hasil sidang EAB DR' },
        { task: 'final-assessment-evaluation-assessment', role: 'admin', title: 'Menunggu hasil sidang EAB FA' },
        { task: 'design-recognition-letter', role: 'admin', title: 'Proyek ini sudah dinyatakan lulus dalam sidang tahap design recognition, selanjutnya PT. Sertifikasi Bangunan Hijau akan mengirimkan surat pernyataan design recognition.' },
        { task: 'on-site-verification', role: 'verificator', title: 'Proyek ini sudah dapat melanjutkan tahap on site verification, silahkan menghubungi admin melalui email untuk pendjadwalan' },
      ],
      alertKey: 0,
      errorKey: 0,
    }
  },
  computed: {
    approveShow() {
      return (this.adminTasks.includes(this.projectData.definition_key) && this.userData.group.id !== 'verificator') || (this.verificatorTasks.includes(this.projectData.definition_key) && this.userData.group.id === 'verificator')
    },
    rejectShow() {
      return (this.adminTasks.includes(this.projectData.definition_key) && this.userData.group.id !== 'verificator') || (this.verificatorTasks.includes(this.projectData.definition_key) && this.userData.group.id === 'verificator')
    },
    continueFAShow() {
      return (['design-recognition-letter'].includes(this.projectData.definition_key) && this.userData.group.id !== 'verificator')
    },
    agreementShow() {
      return this.agreementTasks.includes(this.projectData.definition_key)
    },
    workshopShow() {
      return this.workshopTasks.includes(this.projectData.definition_key)
    },
    secondPaymentConfirmationShow() {
      return ['check-second-payment'].includes(this.projectData.definition_key)
    },
    onSiteVerificationShow() {
      return ['on-site-verification'].includes(this.projectData.definition_key) && this.userData.group.id === 'verificator'
    },
    designRecognitionReviewShow() {
      return ['design-recognition-review', 'design-recognition-revision-review'].includes(this.projectData.definition_key) && this.userData.group.id === 'verificator'
    },
    designRecognitionHistoryShow() {
      return this.designRecognitionHistoryTasks.includes(this.projectData.definition_key) && this.projectData.design_recognition
    },
    designRecognitionEvaluationAssessmentShow() {
      return (['design-recognition-evaluation-assessment'].includes(this.projectData.definition_key) && this.userData.group.id !== 'verificator')
    },
    finalAssessmentReviewShow() {
      return ['final-assessment-review', 'final-assessment-revision-review'].includes(this.projectData.definition_key) && this.userData.group.id === 'verificator'
    },
    finalAssessmentHistoryShow() {
      return this.finalAssessmentHistoryTasks.includes(this.projectData.definition_key)
    },
    finalAssessmentEvaluationAssessmentShow() {
      return (['final-assessment-evaluation-assessment'].includes(this.projectData.definition_key) && this.userData.group.id !== 'verificator')
    },
    deleteShow() {
      return !['final-assessment-letter'].includes(this.projectData.definition_key) && this.userData.group.id === 'camunda-admin'
    },
    rollbackShow() {
      return !['final-assessment-letter'].includes(this.projectData.definition_key) && this.userData.group.id === 'camunda-admin'
    },
    taskDescriptionBody() {
      // eslint-disable-next-line
      const filtered = this.taskDescription.filter(f => { 
        // eslint-disable-next-line
        return f.task === this.projectData.definition_key
      })
      if (filtered[0] !== undefined) {
        return filtered[0].title
      }
      return ''
    },
  },
  setup() {
    const projectData = ref(null)
    const userData = ref({})
    const reason = ref(null)

    const claim = ref(null)
    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'
    const isLoading = ref(null)

    const historyOptions = ref([])
    const documentCategories = ref([])
    const buildingDocuments = ref([])
    const generateDocuments = ref([])

    const isRollbackSidebarActive = ref(false)
    const categoryKey = ref(0)

    const eligibilityAttachments = ref({})
    const registeredAttachments = ref({})
    const evaluationAttachments = ref({})

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchUser')
      .then(response => {
        userData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          userData.value = undefined
        }
      })

    store.dispatch('app-project/fetchHistory', { id: router.currentRoute.params.id })
      .then(response => {
        historyOptions.value = response.data
        if (historyOptions.value.length > 0) {
          historyOptions.value.shift()
        }
      })
      .catch(error => {
        if (error.response.status === 404) {
          historyOptions.value = undefined
        }
        if (error.response.status === 500) {
          historyOptions.value = undefined
        }
      })

    store.dispatch('app-project/fetchAdminProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data

        store.dispatch('app-project/allBuildingDocumentCategory')
          .then(responseCat => {
            documentCategories.value = responseCat.data
            documentCategories.value.members = []

            store.dispatch('app-project/fetchBuildingDocumentsByMasterCertificationTypeID', { masterCertificationTypeID: projectData.value.certification_type_id })
              .then(resp => {
                buildingDocuments.value = resp.data
                for (let i = 0; i < documentCategories.value.length; i += 1) {
                  const members = buildingDocuments.value.filter(document => document.category.code === documentCategories.value[i].code).map(document => document.code)
                  /* eslint-disable no-param-reassign */
                  documentCategories.value[i].members = members.reduce((map, key) => {
                    map[key] = []
                    return map
                  }, {})
                  let memberDone = 0
                  const memberCount = members.length

                  /* eslint-enable no-param-reassign */
                  Object.keys(documentCategories.value[i].members).forEach(key => {
                    store.dispatch('app-project/getAttachmentsByType', { taskId: router.currentRoute.params.id, fileType: key })
                      .then(respAttach => {
                        if (documentCategories.value[i].members[key] === undefined) {
                          documentCategories.value[i].members[key] = respAttach.data
                        } else {
                          documentCategories.value[i].members[key] = respAttach.data.concat(documentCategories.value[i].members[key])
                        }
                      })
                      .catch(error => {
                        if (error.response.status === 404) {
                          documentCategories.value[i].members[key] = undefined
                        }
                        if (error.response.status === 500) {
                          documentCategories.value[i].members[key] = undefined
                        }
                      })
                      .finally(() => {
                        memberDone += 1
                        if (memberDone === memberCount) {
                          categoryKey.value += 1
                        }
                      })
                  })
                }
              })
              .catch(err => {
                console.error(err)
              })

            store.dispatch('app-project/fetchGenerateDocumentsByMasterCertificationTypeID', { masterCertificationTypeID: projectData.value.certification_type_id })
              .then(resp => {
                generateDocuments.value = resp.data
                for (let i = 0; i < documentCategories.value.length; i += 1) {
                  const members = generateDocuments.value.filter(document => document.category.code === documentCategories.value[i].code).map(document => document.code)
                  /* eslint-disable no-param-reassign */
                  documentCategories.value[i].members = members.reduce((map, key) => {
                    map[key] = []
                    return map
                  }, {})

                  let memberDone = 0
                  const memberCount = members.length
                  /* eslint-enable no-param-reassign */

                  Object.keys(documentCategories.value[i].members).forEach(key => {
                    store.dispatch('app-project/getAttachmentsByType', { taskId: router.currentRoute.params.id, fileType: key })
                      .then(respAttach => {
                        if (documentCategories.value[i].members[key] === undefined) {
                          documentCategories.value[i].members[key] = respAttach.data
                        } else {
                          documentCategories.value[i].members[key] = respAttach.data.concat(documentCategories.value[i].members[key])
                        }
                      })
                      .catch(error => {
                        if (error.response.status === 404) {
                          documentCategories.value[i].members[key] = undefined
                        }
                        if (error.response.status === 500) {
                          documentCategories.value[i].members[key] = undefined
                        }
                      })
                      .finally(() => {
                        memberDone += 1
                        if (memberDone === memberCount) {
                          categoryKey.value += 1
                        }
                      })
                  })
                }
              })
              .catch(err => {
                console.error(err)
              })
          })
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectData.value = undefined
        }
        if (error.response.status === 400) {
          projectData.value = undefined
        }
        if (error.response.status === 500) {
          projectData.value = undefined
        }
      })

    const printProject = () => {
      window.print()
    }

    const approveTask = () => {
      Vue.swal({
        title: 'Are you sure?',
        text: 'Approve this task',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Approve',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          store.dispatch('app-project/approveTask', { id: router.currentRoute.params.id })
            .then(response => {
              claim.value = response.data
            })
            .catch(error => {
              if (error.response.status === 404) {
                claim.value = undefined
              }
              if (error.response.status === 500) {
                claim.value = undefined
              }
            })
            .finally(() => {
              if (userData.value.group.id === 'verificator') {
                router.push({ name: 'verificator-project-list' })
              } else {
                router.push({ name: 'admin-project-list' })
              }
            })
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

    const downloadAllFiles = () => {
      isLoading.value = true

      store.dispatch('app-project/downloadAllFiles', {
        id: projectData.value.task_id,
      })
        .then(response => {
          isLoading.value = false
          const blob = new Blob([response.data], { type: 'application/zip' })
          const url = window.URL.createObjectURL(blob)

          // window.open(url)
          const downloadLink = document.createElement('a')
          downloadLink.href = url

          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        })
        .catch(error => {
          isLoading.value = false

          if (error.response.status === 404) {
            console.error(error)
          }
          if (error.response.status === 500) {
            console.error(error)
          }
        })
    }

    const registeredProject = () => {
      store.dispatch('app-project/downloadRegisteredProject', {
        id: projectData.value.task_id,
      })
        .then(response => {
          fileDownload(response.data, 'registered-project.pdf')
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

    const deleteProject = () => {
      Vue.swal({
        title: 'Are you sure?',
        text: 'Delete this project',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          isLoading.value = true

          store.dispatch('app-project/deleteProject', {
            id: projectData.value.task_id,
            reason: reason.value,
          })
            .then(() => {
              isLoading.value = false
              this.showToast('success', 'Saved', 'Successfully delete project')
            })
            .catch(error => {
              isLoading.value = false
              this.showToast('danger', 'Cannot Delete', error.response.data.message)
            })
            .finally(() => {
              router.push({ name: 'admin-project-list' })
            })
        }
      })
    }

    const continueToFinalAssessment = () => {
      Vue.swal({
        title: 'Are you sure?',
        text: 'Continue to Final Assessment',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        customClass: {
          confirmButton: 'btn btn-secondary',
          cancelButton: 'btn btn-outline-primary ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          isLoading.value = true

          approveTask()
        }
      })
    }

    const agreementPage = () => {
      router.push({ name: 'admin-project-agreement', params: { id: router.currentRoute.params.id } })
    }

    const workshopPage = () => {
      router.push({ name: 'admin-project-workshop', params: { id: router.currentRoute.params.id } })
    }

    const secondPaymentConfirmationPage = () => {
      router.push({ name: 'admin-project-second-payment-confirmation', params: { id: router.currentRoute.params.id } })
    }

    const onSiteVerificationPage = () => {
      router.push({ name: 'admin-project-on-site-verification', params: { id: router.currentRoute.params.id } })
    }

    const designRecognitionReview = () => {
      router.push({ name: 'admin-project-dr-assessment', params: { id: router.currentRoute.params.id } })
    }

    const designRecognitionHistory = () => {
      router.push({ name: 'admin-project-dr-history', params: { id: router.currentRoute.params.id } })
    }

    const designRecognitionEvaluationAssessment = () => {
      router.push({ name: 'admin-project-dr-evaluation-assessment', params: { id: router.currentRoute.params.id } })
    }

    const finalAssessmentReview = () => {
      router.push({ name: 'admin-project-fa-assessment', params: { id: router.currentRoute.params.id } })
    }

    const finalAssessmentHistory = () => {
      router.push({ name: 'admin-project-fa-history', params: { id: router.currentRoute.params.id } })
    }

    const finalAssessmentEvaluationAssessment = () => {
      router.push({ name: 'admin-project-fa-evaluation-assessment', params: { id: router.currentRoute.params.id } })
    }

    const adminTasks = ['check-registration-project', 'check-document-building', 'check-first-payment', 'check-third-payment', 'check-third-payment-fa', 'design-recognition-trial', 'final-assessment-trial']
    const agreementTasks = ['agreement']
    const workshopTasks = ['workshop']
    const designRecognitionHistoryTasks = ['third-payment', 'check-third-payment', 'design-recognition-evaluation-assessment', 'design-recognition-trial-revision', 'design-recognition-revision-review', 'design-recognition-letter', 'final-assessment-submission', 'final-assessment-review', 'third-payment-fa', 'check-third-payment-fa', 'on-site-verification', 'on-site-revision-submission', 'final-assessment-evaluation-assessment', 'final-assessment-trial-revision', 'final-assessment-revision-review', 'final-assessment-letter']
    const finalAssessmentHistoryTasks = ['third-payment-fa', 'check-third-payment-fa', 'on-site-revision-submission', 'final-assessment-evaluation-assessment', 'final-assessment-trial-revision', 'final-assessment-revision-review', 'final-assessment-letter']
    const verificatorTasks = [
      'design-recognition-revision-review',
      'final-assessment-revision-review']

    const {
      refetchData,
    } = rollback()

    return {
      projectData,
      userData,
      eligibilityAttachments,
      registeredAttachments,
      evaluationAttachments,
      adminTasks,
      agreementTasks,
      workshopTasks,
      designRecognitionHistoryTasks,
      finalAssessmentHistoryTasks,
      verificatorTasks,
      agreementPage,
      workshopPage,
      secondPaymentConfirmationPage,
      onSiteVerificationPage,
      printProject,
      deleteProject,
      approveTask,
      continueToFinalAssessment,
      downloadFileByAttachment,
      downloadAllFiles,
      registeredProject,
      designRecognitionReview,
      designRecognitionHistory,
      designRecognitionEvaluationAssessment,
      finalAssessmentReview,
      finalAssessmentHistory,
      finalAssessmentEvaluationAssessment,
      isLoading,
      isRollbackSidebarActive,
      historyOptions,
      documentCategories,
      buildingDocuments,
      generateDocuments,
      categoryKey,
      refetchData,
    }
  },
  methods: {
    toTitleCase(word) {
      return word.split('_').map(item => item.charAt(0).toUpperCase() + item.substring(1)).join(' ')
    },
    codeToName(code) {
      // eslint-disable-next-line
      const filtered = this.allDocuments().filter(doc => { 
        // eslint-disable-next-line
        return doc.code === code
      })
      if (filtered[0] !== undefined) {
        return filtered[0].name
      }
      return ''
    },
    allDocuments() {
      return this.buildingDocuments.concat(this.generateDocuments)
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
    showCategory(attachments) {
      if (attachments === undefined) {
        return true
      }
      return attachments.length > 0
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-project.scss";
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
