<!--Dokumen Penilaian -->
<template>
  <b-col md="12">
    <b-modal
      id="scoring-document-modal"
      v-model.lazy="isLoading"
      modal-class="modal-success"
      centered
      title="Processing in background"
      hide-footer
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
    >
      <b-card-text>
        <h5>
          Waiting to process ...
          <b-spinner v-show="isLoading" />
        </h5>
      </b-card-text>
    </b-modal>

    <b-card no-body>
      <b-card-text
        class="mb-0"
      >
        <span class="font-weight-bold" />
        <b-button
          variant="light"
          :disabled="isLoading"
          @click="downloadAllFiles()"
        >
          <feather-icon icon="ArchiveIcon" />
          Download All Design Recognition Document
        </b-button>
      </b-card-text>
    </b-card>
  </b-col>
</template>

<script>
import {
  BCardText,
  BCol,
  BButton,
  BModal,
  BCard,
  BSpinner,
} from 'bootstrap-vue'
import {
  ref, onUnmounted,
} from '@vue/composition-api'
import router from '@/router'
import store from '@/store'
import Ripple from 'vue-ripple-directive'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import masterDrStoreModule from './masterDrStoreModule'

export default {
  components: {
    BCardText,
    BCol,
    BButton,
    BModal,
    BCard,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      attachmentFields: [
        { key: 'filename', label: 'Document Name' },
        { key: 'version', label: 'Version' },
        { key: 'created_at', label: 'Created At' },
      ],
    }
  },
  computed: {
    attachmentExist() {
      return Array.isArray(this.projectAttachments) && this.projectAttachments.length > 0
    },
  },
  created() {
  },
  setup() {
    const DR_APP_STORE_MODULE_NAME = 'app-dr-scoring-form'
    const blankProjectAssessment = {
      temporary_score: 0,
      potential_score: 0,
      proposed_level: {
        name: '',
      },
    }
    const projectAssessment = ref(JSON.parse(JSON.stringify(blankProjectAssessment)))
    const projectAttachments = ref(JSON.parse('[]'))
    const projectData = ref(null)
    const isLoading = ref(null)

    const downloadAllFiles = () => {
      isLoading.value = true
      store.dispatch('app-dr-scoring-form/fetchClientProject', { id: router.currentRoute.params.id })
        .then(response => {
          projectData.value = response.data
          store.dispatch('app-dr-scoring-form/downloadAllScoringFiles', {
            id: router.currentRoute.params.id,
            certificationTypeId: projectData.value.certification_type_id,
            projectType: 'design_recognition',
          })
            .then(resp => {
              isLoading.value = false

              const blob = new Blob([resp.data], { type: 'application/zip' })
              const url = window.URL.createObjectURL(blob)

              // window.open(url)
              const downloadLink = document.createElement('a')
              downloadLink.href = url

              document.body.appendChild(downloadLink)
              downloadLink.click()
              document.body.removeChild(downloadLink)
            })
            .catch(err => {
              isLoading.value = false

              if (err.response.status === 404) {
                console.error(err)
              }
              if (err.response.status === 500) {
                console.error(err)
              }
            })
        })
        .catch(error => {
          isLoading.value = false

          if (error.response.status === 404) {
            projectData.value = undefined
          }
          if (error.response.status === 500) {
            projectData.value = undefined
          }
        })
    }

    // Register module
    if (!store.hasModule(DR_APP_STORE_MODULE_NAME)) store.registerModule(DR_APP_STORE_MODULE_NAME, masterDrStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(DR_APP_STORE_MODULE_NAME)) store.unregisterModule(DR_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-dr-scoring-form/fetchProjectAssessment', { taskId: router.currentRoute.params.id })
      .then(response => {
        // eslint-disable-next-line prefer-destructuring
        projectAssessment.value = response.data[0]
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAssessment.value = undefined
        }
      })

    store.dispatch('app-dr-scoring-form/fetchProjectAttachments', { taskId: router.currentRoute.params.id })
      .then(response => {
        projectAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAttachments.value = undefined
        }
      })

    return {
      projectAssessment,
      projectAttachments,
      downloadAllFiles,
      isLoading,
    }
  },
  methods: {
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
    getAttachment(attachment) {
      this.isLoading = true
      this.$http.get(`/engine-rest/new-building/assessment_attachment/${attachment.id}`).then(response => {
        // window.open(response.data.url)
        const downloadLink = document.createElement('a')
        downloadLink.href = response.data.url
        downloadLink.download = response.data.filename

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
