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
          <div>
            Processing {{ loadedSize }} byte data
          </div>
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
          v-if="!startedArchive"
          variant="light"
          :disabled="isLoading"
          @click="initDownloadAllFiles()"
        >
          <feather-icon icon="ArchiveIcon" />
          Archived All Design Recognition Document
        </b-button>

        <b-button
          variant="light"
          :disabled="isLoading"
          @click="downloadArchivedProject()"
        >
          <feather-icon icon="DownloadIcon" />
          Download
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
import { useToast } from 'vue-toastification/composition'
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
      loadedSize: 0,
    }
  },
  computed: {
    attachmentExist() {
      return Array.isArray(this.projectAttachments) && this.projectAttachments.length > 0
    },
    finishedArchive() {
      return this.projectData != null && this.projectData.finish_archived_final_assessment === 'finished'
    },
    startedArchive() {
      return this.projectData != null && this.projectData.finish_archived_final_assessment === 'started'
    },
  },
  created() {
  },
  setup() {
    const DR_APP_STORE_MODULE_NAME = 'app-dr-scoring-document'
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
    const toast = useToast()

    // Register module
    if (!store.hasModule(DR_APP_STORE_MODULE_NAME)) store.registerModule(DR_APP_STORE_MODULE_NAME, masterDrStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(DR_APP_STORE_MODULE_NAME)) store.unregisterModule(DR_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-dr-scoring-document/fetchClientProject', { id: router.currentRoute.params.id })
      .then(response => {
        projectData.value = response.data
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

    const initDownloadAllFiles = () => {
      isLoading.value = true

      store.dispatch('app-dr-scoring-document/initDownloadAllScoringFiles', {
        id: router.currentRoute.params.id,
        certificationTypeId: projectData.value.certification_type_id,
        projectType: 'design_recognition',
      })
        .then(resp => {
          isLoading.value = false
          toast({
            component: ToastificationContent,
            props: {
              title: 'Success',
              icon: 'InfoIcon',
              text: resp.data.message,
              variant: 'success',
            },
          })
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
    }

    const downloadAllFiles = () => {
      isLoading.value = true

      store.dispatch('app-dr-scoring-document/downloadAllScoringFiles', {
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
          downloadLink.target = '_blank'
          downloadLink.rel = 'noopener noreferrer'
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        })
        .catch(err => {
          isLoading.value = false
          if (err.response.status === 400) {
            toast({
              component: ToastificationContent,
              props: {
                title: 'Archiving file still on background process',
                icon: 'BellIcon',
                text: 'Please waiting',
                variant: 'danger',
              },
            })
          }
          if (err.response.status === 404) {
            console.error(err)
          }
          if (err.response.status === 500) {
            console.error(err)
          }
        })
    }

    store.dispatch('app-dr-scoring-document/fetchProjectAssessment', { taskId: router.currentRoute.params.id })
      .then(response => {
        // eslint-disable-next-line prefer-destructuring
        projectAssessment.value = response.data[0]
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAssessment.value = undefined
        }
      })

    store.dispatch('app-dr-scoring-document/fetchProjectAttachments', { taskId: router.currentRoute.params.id })
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
      projectData,
      initDownloadAllFiles,
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
    downloadArchivedProject() {
      this.isLoading = true
      const vm = this
      const config = {
        responseType: 'arraybuffer',
        onDownloadProgress: progressEvent => {
          vm.loadedSize = progressEvent.loaded
        },
      }

      this.$http.get(`/engine-rest/new-building/project/attachments/${router.currentRoute.params.id}/download_archived_scoring/${this.projectData.certification_type_id}/design_recognition`, config)
        .then(resp => {
          this.isLoading = false
          const blob = new Blob([resp.data], { type: 'application/zip' })
          const url = window.URL.createObjectURL(blob)

          // window.open(url)
          const downloadLink = document.createElement('a')
          downloadLink.href = url
          downloadLink.target = '_blank'
          downloadLink.rel = 'noopener noreferrer'
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        })
        .catch(err => {
          this.isLoading = false
          if (err.response.status === 400) {
            this.showToast('danger', 'Archiving file still on background process', 'Please waiting')
          }
          if (err.response.status === 404) {
            console.error(err)
          }
          if (err.response.status === 500) {
            console.error(err)
          }
        })
    },
  },
}
</script>
