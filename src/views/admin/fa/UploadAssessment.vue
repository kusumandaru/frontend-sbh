<!--Dokumen Penilaian -->
<template>
  <b-col md="12">
    <b-modal
      id="upload-assessment-modal"
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
    <b-form-group>
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
</template>

<script>
import {
  BCardText,
  BCol,
  BFormGroup,
  BTable,
  BModal,
  BLink,
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
import masterFaStoreModule from './masterFaStoreModule'

export default {
  components: {
    BCardText,
    BCol,
    BFormGroup,
    BTable,
    BModal,
    BLink,
    BCard,
    BSpinner,
  },
  directives: {
    Ripple,
  },
  props: {
    rerenderUploadAssessment: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isLoading: false,
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
    const FA_APP_STORE_MODULE_NAME = 'app-fa'
    const projectAttachments = ref(JSON.parse('[]'))
    const isLoading = ref(null)

    // Register module
    if (!store.hasModule(FA_APP_STORE_MODULE_NAME)) store.registerModule(FA_APP_STORE_MODULE_NAME, masterFaStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(FA_APP_STORE_MODULE_NAME)) store.unregisterModule(FA_APP_STORE_MODULE_NAME)
    })

    store.dispatch('app-fa/fetchProjectAttachments', { taskId: router.currentRoute.params.id })
      .then(response => {
        projectAttachments.value = response.data
      })
      .catch(error => {
        if (error.response.status === 404) {
          projectAttachments.value = undefined
        }
      })

    return {
      projectAttachments,
      isLoading,
    }
  },
  methods: {
    rerenderAssessment() {
      this.rerenderUploadAssessment()
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
