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

    <b-card
      no-body
      style="background: #f6f6f6"
    >
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
          Archived All Final Assessment Document
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
import masterFaStoreModule from './masterFaStoreModule'

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
      loadedSize: 0,
    }
  },
  computed: {
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
    const FA_APP_STORE_MODULE_NAME = 'app-fa-scoring-document'
    const isLoading = ref(null)
    const projectData = ref(null)
    const toast = useToast()

    // Register module
    if (!store.hasModule(FA_APP_STORE_MODULE_NAME)) store.registerModule(FA_APP_STORE_MODULE_NAME, masterFaStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(FA_APP_STORE_MODULE_NAME)) store.unregisterModule(FA_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-fa-scoring-document/fetchClientProject', { id: router.currentRoute.params.id })
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

    const initDownloadAllFiles = () => {
      isLoading.value = true

      store.dispatch('app-fa-scoring-document/initDownloadAllScoringFiles', {
        id: router.currentRoute.params.id,
        certificationTypeId: projectData.value.certification_type_id,
        projectType: 'final_assessment',
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

      store.dispatch('app-fa-scoring-document/downloadAllScoringFiles', {
        id: router.currentRoute.params.id,
        certificationTypeId: projectData.value.certification_type_id,
        projectType: 'final_assessment',
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

    return {
      initDownloadAllFiles,
      downloadAllFiles,
      projectData,
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

      this.$http.get(`/engine-rest/new-building/project/attachments/${router.currentRoute.params.id}/download_archived_scoring/${this.projectData.certification_type_id}/final_assessment`, config)
        .then(resp => {
          this.isLoading = false
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
