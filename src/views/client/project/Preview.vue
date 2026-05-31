<template>
  <section class="project-preview-wrapper">
    <!-- error -->
    <error :key="'err'+errorKey" />
    <!-- error -->

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
          <!-- alert -->
          <alert :key="'all'+alertKey" />
          <!-- alert -->

          <!-- Header -->
          <b-card-body class="project-padding pb-0">
            <div class="d-flex justify-content-between flex-md-row flex-column project-spacing mt-0">
              <!-- Header: Left Content -->
              <div>
                <div class="logo-wrapper">
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
                @click="downloadAllFiles()"
              >
                <feather-icon icon="ArchiveIcon" />
                Download All Archived Document
                <b-spinner
                  v-show="isLoading"
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
          <!-- Button: Edit Project-->
          <b-button
            v-if="editProjectShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="editProject"
          >
            Update Project
          </b-button>

          <!-- Button: Eligibility Statement-->
          <b-button
            v-if="eligibilityStatementShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="secondary"
            class="mb-75"
            block
            @click="eligibleStatement"
          >
            Eligibility Statement
          </b-button>

          <!-- Button: Draft Perjanjian Sertifikasi Greenship-->
          <b-button
            v-if="draftRegistrationLetterShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="secondary"
            class="mb-75"
            block
            @click="draftRegistrationLetter"
          >
            Draft Perjanjian Sertifikasi Greenship
          </b-button>

          <!-- Button: Perjanjian Sertifikasi Greenship Attachment-->
          <b-button
            v-if="registrationLetterAttachmentShow"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="secondary"
            class="mb-75"
            block
            @click="registeredProjectAttachment"
          >
            Panduan Registered Project Declaration
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

          <!-- Button: DR Revision-->
          <b-button
            v-if="drRevisionShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="drRevisionSubmissionTask"
          >
            Revisi Design Recognition
          </b-button>

          <!-- Button: FA Revision-->
          <b-button
            v-if="faRevisionShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="faRevisionSubmissionTask"
          >
            Revisi Final Assessment
          </b-button>

          <!-- Button: Upload Document Building-->
          <b-button
            v-if="uploadDocumentShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="uploadDocumentPage"
          >
            Upload Document Building
          </b-button>

          <!-- Button: Upload Plang dan Persetujuan Pemuatan-->
          <b-button
            v-if="uploadSignPostShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            :variant="projectData.any_sign_post ? 'secondary' : 'success'"
            class="mb-75"
            block
            @click="signPostAndLoadApprovalSubmission"
          >
            Upload pemesanan plang dan persetujuan pemuatan
          </b-button>

          <!-- Button: FirstPayment-->
          <b-button
            v-if="firstPaymentShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="firstPaymentTask"
          >
            First Payment
          </b-button>

          <!-- Button: SecondPayment-->
          <b-button
            v-if="secondPaymentShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="secondPaymentTask"
          >
            Second Payment
          </b-button>

          <!-- Button: ThirdPayment-->
          <b-button
            v-if="thirdPaymentShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="thirdPaymentTask"
          >
            Third Payment
          </b-button>

          <!-- Button: Design Recognition-->
          <b-button
            v-if="designRecognitionShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="designRecognitionSubmission"
          >
            Design Recognition Submission
          </b-button>

          <!-- Button: On Site Revision Submission -->
          <b-button
            v-if="onSiteRevisionSubmissionShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="onSiteRevisionSubmissionPage"
          >
            On Site Revision
          </b-button>

          <!-- Button: Final Assessment-->
          <b-button
            v-if="finalAssessmentShow && eligibleAccess"
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="success"
            class="mb-75"
            block
            @click="finalAssessmentSubmission"
          >
            Final Assessment Submission
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
        </b-card>
        <b-card
          v-if="agreementMessageShow"
          class="mb-4"
        >
          <b-card-text>
            Apabila telah mengisi draft perjanjian sertifikasi agar mengirim via email kepada admin@sertifikasibangunanhijau.com.
            <br><br>Untuk proses selanjutnya agar menunggu pemberitahuan diterimanya perjanjian sertifikasi dari admin PT SBH
          </b-card-text>
        </b-card>

        <b-card
          v-if="workshopShow"
          class="mb-4"
        >
          <b-card-text>
            Proses selanjutnya hasil workshop dapat diunduh setelah pelaksanaan workshop selesai.
            <br>
            <br>
            Form Pemesanan Plang GREENSHIP dan Form Persetujuan Pemuatan Data Gedung di Website dan Media Massa dapat di download pada 'Panduan Registered Project Declaration' dan Form yang telah di isi dan ditandatangani dapat diupload pada 'Upload Form Pemesanan Plang'
          </b-card-text>
        </b-card>

        <b-card
          v-if="trialMessageShow"
          class="mb-4"
        >
          <b-card-text>
            Proses selanjutnya, jadwal sidang akan diinfo melalui email admin@sertifikasibangunanhijau.com
          </b-card-text>
        </b-card>

        <b-card
          v-if="finalMessageShow"
          class="mb-4"
        >
          <b-card-text>
            Proses sudah selesai dan proyek ini dinyatakan lulus dalam sertifikasi Greenship NB.
            <br><br>PT. Sertifikasi Bangunan Hijau akan merekomendasikan kepada GBCIndonesia untuk proyek ini mendapatkan sertifikat
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </section>
</template>

<script>
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import store from '@/store'
import router from '@/router'
import {
  BRow, BCol, BCard, BCardBody, BCardTitle, BCardSubTitle, BCardText, BButton, BLink, VBToggle, BTable, BForm, BSpinner,
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Ripple from 'vue-ripple-directive'
import projectStoreModule from '@/views/projectStoreModule'
import fileDownload from 'js-file-download'
import Alert from './Alert.vue'
import Error from './Error.vue'

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
    Alert,
    Error,
  },
  data() {
    return {
      alertKey: 0,
      errorKey: 0,
      projectAttachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'created_at', label: 'Created At' },
      ],
      taskDescription: [
        { task: 'design-recognition-trial', role: 'admin', title: 'Proses approval DR' },
        { task: 'design-recognition-trial-revision', role: 'client', title: 'Revisi DR setelah sidang' },
        { task: 'design-recognition-evaluation-assessment', role: 'admin', title: 'Menunggu hasil sidang EAB DR' },
        { task: 'final-assessment-evaluation-assessment', role: 'admin', title: 'Menunggu hasil sidang EAB FA' },
        { task: 'design-recognition-letter', role: 'admin', title: 'Proyek ini sudah dinyatakan lulus dalam sidang tahap design recognition, selanjutnya PT. Sertifikasi Bangunan Hijau akan mengirimkan surat pernyataan design recognition.' },
        { task: 'on-site-verification', role: 'verificator', title: 'Proyek ini sudah dapat melanjutkan tahap on site verification, silahkan menghubungi admin melalui email untuk pendjadwalan' },
      ],
    }
  },
  computed: {
    eligibleAccess() {
      return (this.userData.group_id === 'user' || this.userData.group_id === 'superuser') && (this.projectData.tenant === this.userData.tenant_id)
    },
    editProjectShow() {
      return ['fill-registration-project'].includes(this.projectData.definition_key)
    },
    uploadDocumentShow() {
      return ['fill-document-building'].includes(this.projectData.definition_key)
    },
    draftRegistrationLetterShow() {
      return ['agreement'].includes(this.projectData.definition_key)
    },
    firstPaymentShow() {
      return ['first-payment'].includes(this.projectData.definition_key)
    },
    secondPaymentShow() {
      return ['second-payment'].includes(this.projectData.definition_key)
    },
    thirdPaymentShow() {
      return ['third-payment', 'third-payment-fa'].includes(this.projectData.definition_key)
    },
    eligibilityStatementShow() {
      return !(this.aboveCheckBuildingTasks.includes(this.projectData.definition_key))
    },
    registrationLetterAttachmentShow() {
      return !(this.aboveFirstPaymentTasks.includes(this.projectData.definition_key))
    },
    drRevisionShow() {
      return ['design-recognition-trial-revision'].includes(this.projectData.definition_key)
    },
    faRevisionShow() {
      return ['final-assessment-trial-revision'].includes(this.projectData.definition_key)
    },
    designRecognitionShow() {
      return ['design-recognition-submission'].includes(this.projectData.definition_key)
    },
    designRecognitionHistoryShow() {
      return this.designRecognitionHistoryTasks.includes(this.projectData.definition_key) && this.projectData.design_recognition
    },
    finalAssessmentShow() {
      return ['final-assessment-submission'].includes(this.projectData.definition_key)
    },
    finalAssessmentHistoryShow() {
      return this.finalAssessmentHistoryTasks.includes(this.projectData.definition_key)
    },
    agreementMessageShow() {
      return ['agreement-and-first-payment', 'agreement'].includes(this.projectData.definition_key)
    },
    workshopShow() {
      return ['workshop'].includes(this.projectData.definition_key)
    },
    uploadSignPostShow() {
      return ['workshop', 'second-payment', 'check-second-payment'].includes(this.projectData.definition_key)
    },
    onSiteRevisionSubmissionShow() {
      return ['on-site-revision-submission'].includes(this.projectData.definition_key)
    },
    trialMessageShow() {
      return ['design-recognition-trial', 'final-assessment-trial'].includes(this.projectData.definition_key)
    },
    finalMessageShow() {
      return ['final-assessment-letter'].includes(this.projectData.definition_key)
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
    const userData = ref(null)
    const isLoading = ref(null)

    const documentCategories = ref([])
    const buildingDocuments = ref([])
    const generateDocuments = ref([])
    const categoryKey = ref(0)

    const eligibilityAttachments = ref({})
    const registeredAttachments = ref({})
    const evaluationAttachments = ref({})

    const PROJECT_APP_STORE_MODULE_NAME = 'app-project'

    // Register module
    if (!store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.registerModule(PROJECT_APP_STORE_MODULE_NAME, projectStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(PROJECT_APP_STORE_MODULE_NAME)) store.unregisterModule(PROJECT_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-project/fetchClientProject', { id: router.currentRoute.params.id })
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
        console.error(error)
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

    store.dispatch('app-project/fetchUser')
      .then(response => {
        userData.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          userData.value = undefined
        }
      })

    const printProject = () => {
      window.print()
    }

    const editProject = () => {
      router.push({ name: 'client-project-edit', params: { id: router.currentRoute.params.id } })
    }

    const firstPaymentTask = () => {
      router.push({ name: 'client-project-first-payment', params: { id: router.currentRoute.params.id } })
    }

    const drRevisionSubmissionTask = () => {
      router.push({ name: 'client-project-dr-revision-submission', params: { id: router.currentRoute.params.id } })
    }

    const faRevisionSubmissionTask = () => {
      router.push({ name: 'client-project-fa-revision-submission', params: { id: router.currentRoute.params.id } })
    }

    const secondPaymentTask = () => {
      router.push({ name: 'client-project-second-payment', params: { id: router.currentRoute.params.id } })
    }

    const thirdPaymentTask = () => {
      router.push({ name: 'client-project-third-payment', params: { id: router.currentRoute.params.id } })
    }

    const uploadDocumentPage = () => {
      router.push({ name: 'client-project-upload-document', params: { id: router.currentRoute.params.id } })
    }

    const designRecognitionSubmission = () => {
      router.push({ name: 'client-project-dr-assessment', params: { id: router.currentRoute.params.id } })
    }

    const designRecognitionHistory = () => {
      router.push({ name: 'client-project-dr-history', params: { id: router.currentRoute.params.id } })
    }

    const signPostAndLoadApprovalSubmission = () => {
      router.push({ name: 'client-project-sign-post-load-approval', params: { id: router.currentRoute.params.id } })
    }

    const onSiteRevisionSubmissionPage = () => {
      router.push({ name: 'client-project-on-site-revision-submission', params: { id: router.currentRoute.params.id } })
    }

    const finalAssessmentSubmission = () => {
      router.push({ name: 'client-project-fa-assessment', params: { id: router.currentRoute.params.id } })
    }

    const finalAssessmentHistory = () => {
      router.push({ name: 'client-project-fa-history', params: { id: router.currentRoute.params.id } })
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

    const eligibleStatement = () => {
      store.dispatch('app-project/downloadEligibleStatement', {
        id: projectData.value.task_id,
      })
        .then(response => {
          fileDownload(response.data, 'eligible.pdf')
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

    const registeredProjectAttachment = () => {
      store.dispatch('app-project/downloadRegisteredProjectAttachment', {
        id: projectData.value.task_id,
      })
        .then(response => {
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
          if (error.response.status === 404) {
            console.error(error)
          }
          if (error.response.status === 500) {
            console.error(error)
          }
        })
    }

    const draftRegistrationLetter = () => {
      store.dispatch('app-project/downloadMasterLink', {
        filename: 'registration_letter',
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

    const aboveCheckBuildingTasks = ['check-registration-project', 'fill-registration-project', 'fill-document-building', 'check-document-building']
    const aboveFirstPaymentTasks = ['check-registration-project', 'fill-registration-project', 'fill-document-building', 'check-document-building', 'agreement', 'first-payment']
    const submissionTasks = ['design-recognition-submission', 'final-assessment-submission']
    const designRecognitionHistoryTasks = ['design-recognition-review', 'third-payment', 'check-third-payment', 'design-recognition-evaluation-assessment', 'design-recognition-trial-revision', 'design-recognition-revision-review', 'design-recognition-letter', 'final-assessment-submission', 'final-assessment-review', 'third-payment-fa', 'check-third-payment-fa', 'on-site-verification', 'on-site-revision-submission', 'final-assessment-evaluation-assessment', 'final-assessment-trial-revision', 'final-assessment-revision-review', 'final-assessment-letter']
    const finalAssessmentHistoryTasks = ['final-assessment-review', 'third-payment-fa', 'check-third-payment-fa', 'on-site-verification', 'on-site-revision-submission', 'final-assessment-evaluation-assessment', 'final-assessment-trial-revision', 'final-assessment-revision-review', 'final-assessment-letter']

    return {
      projectData,
      userData,
      eligibilityAttachments,
      registeredAttachments,
      evaluationAttachments,
      printProject,
      editProject,
      firstPaymentTask,
      secondPaymentTask,
      thirdPaymentTask,
      drRevisionSubmissionTask,
      faRevisionSubmissionTask,
      designRecognitionHistoryTasks,
      finalAssessmentHistoryTasks,
      uploadDocumentPage,
      downloadFileByAttachment,
      downloadAllFiles,
      eligibleStatement,
      registeredProject,
      registeredProjectAttachment,
      designRecognitionSubmission,
      designRecognitionHistory,
      signPostAndLoadApprovalSubmission,
      onSiteRevisionSubmissionPage,
      finalAssessmentSubmission,
      finalAssessmentHistory,
      draftRegistrationLetter,
      aboveCheckBuildingTasks,
      aboveFirstPaymentTasks,
      submissionTasks,
      isLoading,
      documentCategories,
      buildingDocuments,
      generateDocuments,
      categoryKey,
    }
  },
  methods: {
    toTitleCase(word) {
      return word.split('_').map(item => item.charAt(0).toUpperCase() + item.substring(1)).join(' ')
    },
    filteredAttachment(attachment) {
      // eslint-disable-next-line no-unused-vars
      return Object.fromEntries(Object.entries(attachment).filter(([k, v]) => v != null && v.length > 0))
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
